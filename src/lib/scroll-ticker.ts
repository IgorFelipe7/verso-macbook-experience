/**
 * One passive scroll listener and one rAF loop for the whole page.
 *
 * Every scroll-linked section subscribes here instead of attaching its own
 * listener, so N sections cost 1 listener and 1 frame callback. Subscribers
 * that are mid-animation return `true` to keep the loop alive for another
 * frame; otherwise the loop parks itself until the next scroll or resize.
 */

export type TickerSub = (
  scrollY: number,
  viewportH: number,
  /** True on the first tick after a resize — re-measure cached geometry. */
  resized: boolean
) => boolean | void;

const subs = new Set<TickerSub>();

let rafId = 0;
let resizePending = true;

function tick() {
  rafId = 0;
  const scrollY = window.scrollY;
  const viewportH = window.innerHeight;
  const resized = resizePending;
  resizePending = false;

  let again = false;
  for (const sub of subs) {
    if (sub(scrollY, viewportH, resized) === true) again = true;
  }

  if (again) schedule();
}

function schedule() {
  if (rafId === 0 && subs.size > 0) rafId = requestAnimationFrame(tick);
}

function onScroll() {
  schedule();
}

function onResize() {
  resizePending = true;
  schedule();
}

function onVisibility() {
  if (document.visibilityState === "visible") {
    resizePending = true;
    schedule();
  }
}

function attach() {
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
}

function detach() {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onResize);
  document.removeEventListener("visibilitychange", onVisibility);
  if (rafId !== 0) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
}

/** Subscribe to the shared loop. Returns an unsubscribe function. */
export function subscribe(sub: TickerSub): () => void {
  if (subs.size === 0) attach();
  subs.add(sub);
  resizePending = true;
  schedule();

  return () => {
    subs.delete(sub);
    if (subs.size === 0) detach();
  };
}

/** Ask for one more frame (after a layout change a subscriber knows about). */
export function requestTick() {
  resizePending = true;
  schedule();
}
