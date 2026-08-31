import { BRAND, FOOTER, NAV_LINKS } from "@/content/product";

import { VersoSignature } from "./verso-signature";

/**
 * Minimal close. Only destinations that genuinely exist on this page are
 * listed — no invented social, legal or contact links.
 */
export function SiteFooter() {
  const backToTop = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <footer className="ft">
      <div className="ft-top">
        <a className="ft-brand" href="#topo" onClick={backToTop}>
          <span aria-hidden className="fsh-brand-dot" />
          {BRAND.name}
        </a>

        <a className="ft-top-link" href="#topo" onClick={backToTop}>
          {FOOTER.backToTop}
          <span aria-hidden className="ft-arrow">
            ↑
          </span>
        </a>
      </div>

      <nav className="ft-links" aria-label="Seções">
        {NAV_LINKS.map((link) => (
          <a key={link.id} href={`#${link.id}`}>
            {link.label}
          </a>
        ))}
      </nav>

      <div className="ft-sign">
        <VersoSignature />
      </div>
    </footer>
  );
}
