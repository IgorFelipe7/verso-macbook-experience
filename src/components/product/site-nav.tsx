import { useEffect, useRef, useState } from "react";

import { useActiveSection } from "@/hooks/use-active-section";
import { subscribe } from "@/lib/scroll-ticker";
import { cx } from "@/lib/utils";
import { BRAND, CTA, NAV_LINKS } from "@/content/product";

const SECTION_IDS = NAV_LINKS.map((l) => l.id);

/**
 * Lifted out of the hero so it can follow the whole page rather than just the
 * cinematic act. Same markup, same classes, same identity — it now also knows
 * which section is being read, and the CTA leans very slightly toward the
 * pointer on precise-pointer devices.
 */
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  const active = useActiveSection(SECTION_IDS);

  useEffect(() => {
    let last = false;
    return subscribe((scrollY) => {
      const next = scrollY > 4;
      if (next !== last) {
        last = next;
        setScrolled(next);
      }
    });
  }, []);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let frame = 0;

    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = el.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const distance = Math.hypot(dx, dy);
        const reach = 90;

        if (distance > reach) {
          el.style.setProperty("--mx", "0px");
          el.style.setProperty("--my", "0px");
          return;
        }
        const pull = (1 - distance / reach) * 0.28;
        el.style.setProperty("--mx", `${dx * pull}px`);
        el.style.setProperty("--my", `${dy * pull}px`);
      });
    };

    const onLeave = () => {
      el.style.setProperty("--mx", "0px");
      el.style.setProperty("--my", "0px");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <nav className={cx("fsh-nav", scrolled && "fsh-nav-scrolled")}>
      <a className="fsh-brand" href="#topo">
        <span aria-hidden className="fsh-brand-dot" />
        {BRAND.name}
        <span className="sr-only"> — início</span>
      </a>

      <div className="fsh-nav-links">
        {NAV_LINKS.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={cx("fsh-nav-link", active === link.id && "is-active")}
            aria-current={active === link.id ? "true" : undefined}
          >
            {link.label}
          </a>
        ))}
      </div>

      <a ref={ctaRef} href={CTA.href} className="fsh-cta">
        {CTA.label}
      </a>
    </nav>
  );
}
