import Link from "next/link";
import { useLanguage } from "../lib/use-language";
import { designCopy } from "../lib/design-copy";

export default function Footer() {
  const { locale } = useLanguage();
  const c = designCopy[locale];
  return (
    <footer className="site-footer shell">
      <div>
        <strong>
          Arthur Sens<span className="accent">.</span>
        </strong>
        <p>{c.footer}</p>
      </div>
      <div className="footer-links">
        <a href="https://github.com/ArthurSens/blog">{c.source} ↗</a>
        <a href="https://www.linkedin.com/in/arthursilvasens/">LinkedIn ↗</a>
        <a href="https://twitter.com/ArthurSilvaSens">Twitter ↗</a>
        <Link href="/privacy">{c.privacy}</Link>
      </div>
    </footer>
  );
}
