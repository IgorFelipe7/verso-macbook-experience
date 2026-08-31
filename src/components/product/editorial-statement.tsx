import { useRef } from "react";

import { useSectionProgress } from "@/hooks/use-section-progress";
import { range } from "@/lib/utils";
import { SECTION_IDS, STATEMENT } from "@/content/product";

/**
 * The breath after the sequence. Lines resolve on their own staggered slice of
 * the section's progress, so the reveal is tied to the scroll rather than
 * played back on entry.
 */
export function EditorialStatement() {
  const ref = useRef<HTMLElement | null>(null);

  useSectionProgress(ref, (p) => {
    const el = ref.current;
    if (!el) return;

    for (let i = 0; i < STATEMENT.lines.length; i++) {
      const start = 0.18 + i * 0.1;
      el.style.setProperty(`--l${i}`, String(range(p, start, start + 0.26)));
    }
    el.style.setProperty("--note", String(range(p, 0.52, 0.74)));
  });

  return (
    <section ref={ref} id={SECTION_IDS.statement} className="es">
      <div className="es-inner">
        <h2 className="es-title">
          {STATEMENT.lines.map((line, i) => (
            <span key={line} className="es-line" data-i={i}>
              <span className="es-line-inner">{line}</span>
            </span>
          ))}
        </h2>
        <p className="es-note">{STATEMENT.note}</p>
      </div>
    </section>
  );
}
