import { useRef } from "react";
import type { CSSProperties } from "react";

import { useSectionProgress } from "@/hooks/use-section-progress";
import { range } from "@/lib/utils";
import {
  HIGHLIGHTS,
  HIGHLIGHTS_HEADING,
  SECTION_IDS,
} from "@/content/product";

import { SceneImage } from "./scene-image";

/**
 * Destaques — asymmetric editorial panels, not a feature grid. Each panel
 * uncovers its still with a mask wipe on its own slice of the scroll, which
 * keeps this section's reveal distinct from the statement above it.
 */
export function ProductHighlights() {
  const ref = useRef<HTMLElement | null>(null);

  useSectionProgress(ref, (p) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--head", String(range(p, 0.06, 0.24)));
    for (let i = 0; i < HIGHLIGHTS.length; i++) {
      const start = 0.16 + i * 0.07;
      el.style.setProperty(`--r${i}`, String(range(p, start, start + 0.3)));
    }
  });

  return (
    <section ref={ref} id={SECTION_IDS.highlights} className="hl">
      <header className="hl-head">
        <p className="micro-label">{HIGHLIGHTS_HEADING.label}</p>
        <h2 className="hl-title">{HIGHLIGHTS_HEADING.title}</h2>
      </header>

      <div className="hl-grid">
        {HIGHLIGHTS.map((item, i) => (
          <article
            key={item.id}
            className={`hl-panel is-${item.span}`}
            style={
              {
                "--c": item.accent,
                "--r": `var(--r${i}, 0)`,
              } as CSSProperties
            }
          >
            <div className="hl-media">
              <SceneImage scene={item.scene} />
            </div>
            <div className="hl-body">
              <p className="micro-label" style={{ color: item.accent }}>
                {item.label}
              </p>
              <h3 className="hl-headline">{item.headline}</h3>
              <p className="hl-text">{item.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
