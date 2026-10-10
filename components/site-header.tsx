import Link from "next/link";
import { useLanguage } from "../lib/use-language";
import { designCopy } from "../lib/design-copy";

export default function SiteHeader() {
  const { locale } = useLanguage();
  const c = designCopy[locale];
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
      </div>
    </header>
  );
}
