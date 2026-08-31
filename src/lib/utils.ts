export const cx = (...c: (string | false | null | undefined)[]) =>
  c.filter(Boolean).join(" ");

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Progress of `v` inside [a, b], clamped to 0..1. */
export const range = (v: number, a: number, b: number) =>
  clamp01((v - a) / (b - a || 1));

/** Frame index → public URL. Browser paths always use forward slashes. */
export const framePath = (i: number) =>
  `/sequence/frame_${String(i).padStart(4, "0")}.jpg`;
