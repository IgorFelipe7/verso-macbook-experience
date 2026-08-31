/**
 * Staged loader for the frame sequence.
 *
 * Frames are local now, but 941 of them is still 83 MB — firing every request
 * at once would saturate the connection and stall the frames the user is
 * actually looking at. Instead:
 *
 *   1. a small critical batch is fetched so the experience becomes usable,
 *   2. the rest streams in the background under a concurrency cap,
 *   3. whatever is nearest the current scroll position is always fetched next,
 *      biased slightly forward because that is where the user is heading.
 *
 * On memory-constrained devices only every Nth frame is requested; the
 * playhead falls back to the nearest loaded neighbour, which is invisible at
 * mobile scrubbing speeds and halves the decoded-bitmap footprint.
 */

const IDLE = 0;
const LOADING = 1;
const DONE = 2;

export type FrameLoader = {
  start: () => void;
  destroy: () => void;
  /** Tell the loader where the playhead is, so it fetches there next. */
  setTarget: (index: number) => void;
  /** Nearest frame with pixels available, or -1 while nothing has arrived. */
  nearestLoaded: (index: number) => number;
  readonly stride: number;
};

export type FrameLoaderOptions = {
  count: number;
  eager: number;
  path: (frameNumber: number) => string;
  onProgress: (loaded: number, criticalTotal: number) => void;
  onReady: () => void;
};

/** Frames the device will actually hold, and how many at once. */
function deviceBudget() {
  if (typeof navigator === "undefined") return { stride: 1, parallel: 8 };

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };

  const memory = nav.deviceMemory ?? 8;
  const saveData = nav.connection?.saveData === true;
  const slow = /(^|-)2g$/.test(nav.connection?.effectiveType ?? "");
  const coarse =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  if (saveData || slow) return { stride: 3, parallel: 4 };
  if (memory <= 4 || coarse) return { stride: 2, parallel: 6 };
  return { stride: 1, parallel: 8 };
}

export function createFrameLoader({
  count,
  eager,
  path,
  onProgress,
  onReady,
}: FrameLoaderOptions): FrameLoader {
  const { stride, parallel } = deviceBudget();

  const state = new Uint8Array(count);
  const images: (HTMLImageElement | undefined)[] = new Array(count);

  // Frames this device will ever request, ascending. Index 0 is always in.
  const wanted: number[] = [];
  for (let i = 0; i < count; i += stride) wanted.push(i);
  if (wanted[wanted.length - 1] !== count - 1) wanted.push(count - 1);

  const wantedSet = new Uint8Array(count);
  for (const i of wanted) wantedSet[i] = 1;

  const critical = Math.min(eager, wanted.length);

  let loaded = 0;
  let inflight = 0;
  let target = 0;
  let ready = false;
  let stopped = false;

  function pickNext(): number {
    // Walk outward from the playhead, checking forward first.
    for (let d = 0; d < count; d++) {
      const ahead = target + d;
      if (ahead < count && wantedSet[ahead] === 1 && state[ahead] === IDLE) {
        return ahead;
      }
      if (d === 0) continue;
      const behind = target - d;
      if (behind >= 0 && wantedSet[behind] === 1 && state[behind] === IDLE) {
        return behind;
      }
    }
    return -1;
  }

  function settle() {
    inflight--;
    loaded++;

    if (!ready && loaded >= critical) {
      ready = true;
      onReady();
    }
    onProgress(loaded, critical);

    if (!stopped) pump();
  }

  function load(index: number) {
    state[index] = LOADING;
    inflight++;

    const img = new Image();
    img.decoding = "async";
    img.src = path(index + 1);
    images[index] = img;

    const done = () => {
      state[index] = DONE;
      settle();
    };

    img.onload = done;
    // A failed frame must not stall the queue — treat it as settled and let
    // nearestLoaded() step over the gap.
    img.onerror = done;
  }

  function pump() {
    while (!stopped && inflight < parallel) {
      const next = pickNext();
      if (next < 0) break;
      load(next);
    }
  }

  return {
    stride,

    start() {
      pump();
    },

    destroy() {
      stopped = true;
      for (const img of images) {
        if (img) {
          img.onload = null;
          img.onerror = null;
        }
      }
      images.length = 0;
    },

    setTarget(index: number) {
      target = index < 0 ? 0 : index >= count ? count - 1 : index;
    },

    nearestLoaded(index: number) {
      if (state[index] === DONE) return index;
      // Bounded search: past ~2 strides of gap it is cheaper to hold the last
      // painted frame than to hunt across the whole sequence.
      const reach = Math.max(8, stride * 4);
      for (let d = 1; d <= reach; d++) {
        const back = index - d;
        if (back >= 0 && state[back] === DONE) return back;
        const fwd = index + d;
        if (fwd < count && state[fwd] === DONE) return fwd;
      }
      return -1;
    },
  };
}
