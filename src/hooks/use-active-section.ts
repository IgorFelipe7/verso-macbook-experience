import { useEffect, useState } from "react";

/**
 * Tracks which section owns the viewport, for the navigation's active state.
 * IntersectionObserver rather than scroll math: this only changes a handful of
 * times per page and shouldn't cost anything while scrolling.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    const seen = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          seen.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let best = "";
        let bestRatio = 0;
        for (const id of ids) {
          const ratio = seen.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (best) setActive(best);
      },
      {
        // Ignore the band under the fixed nav so a section only counts as
        // active once it is genuinely the thing being read.
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.15, 0.4, 0.75, 1],
      }
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [ids]);

  return active;
}
