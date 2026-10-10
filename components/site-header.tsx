import Link from "next/link";
import { useLanguage } from "../lib/use-language";
import { designCopy } from "../lib/design-copy";
import { useMotion } from "./motion";

export default function SiteHeader() {
  const { locale } = useLanguage();
  const c = designCopy[locale];
  const { enabled, toggle } = useMotion();
  return (
    <header className="site-header">
      <Link href="/" className="wordmark">
        <span className="brand-mark" aria-hidden="true">
          a<span>.</span>
        </span>
        <span>arthursens.dev</span>
      </Link>
      <div className="header-actions">
        <Link href="/#writing" className="header-writing">
          {c.writing}
        </Link>
        <a href="https://github.com/ArthurSens" className="github-link">
          GitHub <span aria-hidden="true">↗</span>
        </a>
        <button
          type="button"
          onClick={toggle}
          className="motion-toggle"
          aria-label={enabled ? c.pause : c.play}
          title={enabled ? c.pause : c.play}
          aria-pressed={enabled}
        >
          <span aria-hidden="true">{enabled ? "Ⅱ" : "▷"}</span>
        </button>
      </div>
    </header>
  );
}
