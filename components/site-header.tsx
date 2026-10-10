import Link from "next/link";
import { useLanguage } from "../lib/use-language";
import { designCopy } from "../lib/design-copy";

import { useTheme, isThemePreference } from "./theme";

export default function SiteHeader() {
  const { locale } = useLanguage();
  const c = designCopy[locale];
  const { preference, setPreference } = useTheme();
  const pt = locale === "pt-br";
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
        <select className="theme-select" aria-label={pt ? "Tema" : "Theme"} value={preference}
          onChange={(event) => { if (isThemePreference(event.target.value)) setPreference(event.target.value); }}>
          <option value="system">{pt ? "Sistema" : "System"}</option>
          <option value="light">{pt ? "Claro" : "Light"}</option>
          <option value="dark">{pt ? "Escuro" : "Dark"}</option>
        </select>
      </div>
    </header>
  );
}
