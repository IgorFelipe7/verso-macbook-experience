import { useEffect, useRef } from "react";
import type { RefObject } from "react";

import { subscribe } from "@/lib/scroll-ticker";
import { clamp01 } from "@/lib/utils";

/**
 * `through` — 0 when the section's top reaches the viewport bottom, 1 when its
 * bottom clears the viewport top. For sections that animate as they pass by.
 *
 * `pin` — 0 when the section's top hits the viewport top, 1 when its bottom
 * hits the viewport bottom. For sticky/pinned stages.
 */
export type ProgressMode = "through" | "pin";

/**
 * Scroll progress for a section, delivered imperatively.
 *
 * The callback runs inside the shared rAF loop and receives 0..1. It never
 * sets state, so a scrolling page produces zero React renders — write to CSS
 * custom properties or element styles instead. Geometry is measured once and
 * re-measured only on resize, so no layout is read while scrolling.
 *
 * Return `true` from the callback to request another frame (used by the hero,
 * which keeps easing toward its target frame after scrolling stops).
 */
export function useSectionProgress(
  ref: RefObject<HTMLElement | null>,
  onUpdate: (p: number) => boolean | void,
  mode: ProgressMode = "through"
) {
  const cbRef = useRef(onUpdate);

  useEffect(() => {
    cbRef.current = onUpdate;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let top = 0;
    let height = 0;
    let lastP = Number.NaN;

    const measure = () => {
      top = el.getBoundingClientRect().top + window.scrollY;
      height = el.offsetHeight;
    };

    measure();

    return subscribe((scrollY, viewportH, resized) => {
      if (resized) measure();

      const span =
        mode === "pin"
          ? Math.max(1, height - viewportH)
          : Math.max(1, height + viewportH);
      const travelled =
        mode === "pin" ? scrollY - top : scrollY + viewportH - top;

      const p = clamp01(travelled / span);

      // Parked at an edge with nothing to re-measure: skip the work entirely.
      if (p === lastP && !resized) return;
      lastP = p;

      return cbRef.current(p);
    });
  }, [ref, mode]);
}
