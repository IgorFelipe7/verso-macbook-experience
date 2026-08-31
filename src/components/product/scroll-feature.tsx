import { useRef } from "react";

import { useSectionProgress } from "@/hooks/use-section-progress";
import { range } from "@/lib/utils";
import type { Moment } from "@/content/product";

import { SceneImage } from "./scene-image";

/**
 * One immersive product moment: the still holds while the copy travels past it.
 *
 * The three treatments are deliberately different crops of the same sequence —
 * one grows into frame, one pushes into a detail, one returns the whole
 * silhouette — so the section reads as three photographs rather than three
 * repetitions of the hero.
 */
export function ScrollFeature({ moment }: { moment: Moment }) {
  const ref = useRef<HTMLElement | null>(null);

  useSectionProgress(ref, (p) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--p", String(p));
    // Resolves early and stays put — copy that is on screen never fades back out.
    el.style.setProperty("--reveal", String(range(p, 0.12, 0.36)));
  });

  return (
    <section
      ref={ref}
      id={moment.id}
      className={`sf is-${moment.treatment} is-${moment.align}`}
      style={{ ["--c" as string]: moment.accent }}
      aria-labelledby={`${moment.id}-title`}
    >
      <div className="sf-sticky">
        <figure className="sf-media">
          <SceneImage
            scene={moment.scene}
            fit={moment.treatment === "silhouette" ? "contain" : "cover"}
          />
        </figure>
      </div>

      <div className="sf-copy">
        <div className="sf-copy-inner">
          <p className="micro-label sf-label">{moment.label}</p>
          <h2 id={`${moment.id}-title`} className="sf-title">
            {moment.title}
          </h2>
          <p className="sf-text">{moment.body}</p>
        </div>
      </div>
    </section>
  );
}
