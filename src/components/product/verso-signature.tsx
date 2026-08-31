import { cx } from "@/lib/utils";
import { FOOTER } from "@/content/product";

export type VersoSignatureProps = {
  /**
   * No Verso destination exists in this project, so the signature renders as
   * text by default. Supply a real URL here and it becomes a link — nothing
   * else about the treatment changes.
   */
  href?: string;
  className?: string;
};

/** Creator credit: present and legible, never competing with the product. */
export function VersoSignature({ href, className }: VersoSignatureProps) {
  const { prefix, name, suffix } = FOOTER.signature;

  const mark = <span className="verso-name">{name}</span>;

  return (
    <p className={cx("verso", className)}>
      {prefix}{" "}
      {href ? (
        <a
          className="verso-link"
          href={href}
          target="_blank"
          rel="noreferrer noopener"
        >
          {mark}
        </a>
      ) : (
        mark
      )}
      {suffix}
    </p>
  );
}
