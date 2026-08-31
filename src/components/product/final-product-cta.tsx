import { useRef } from "react";

import { useSectionProgress } from "@/hooks/use-section-progress";
import { range } from "@/lib/utils";
import { CLOSING, SCENES, SECTION_IDS } from "@/content/product";

import { SceneImage } from "./scene-image";

/**
 * The closing scene mirrors the opening: the product settles, the line
 * resolves, the CTA arrives last. Motion decays as the page ends rather than
 * stopping abruptly.
 */
export function FinalProductCta() {
  const ref = useRef<HTMLElement | null>(null);

  useSectionProgress(ref, (p) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--settle", String(range(p, 0.1, 0.55)));
    el.style.setProperty("--title", String(range(p, 0.32, 0.58)));
    el.style.setProperty("--body", String(range(p, 0.42, 0.66)));
    el.style.setProperty("--cta", String(range(p, 0.52, 0.74)));
  });

  return (
    <section ref={ref} id={SECTION_IDS.closing} className="fc">
      <div className="fc-stage">
        <figure className="fc-media">
          <SceneImage scene={SCENES.closing} />
        </figure>

        <div className="fc-copy">
          <p className="micro-label fc-label">{CLOSING.label}</p>
          <h2 className="fc-title">{CLOSING.title}</h2>
          <p className="fc-text">{CLOSING.body}</p>
          <a href={CLOSING.ctaHref} className="fc-cta">
            {CLOSING.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
