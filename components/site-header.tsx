import Link from "next/link";
import { useLanguage } from "../lib/use-language";
import { ThemePreference, useTheme } from "./theme";

const nextTheme: Record<ThemePreference, ThemePreference> = {
  system: "light",
  light: "dark",
  dark: "system",
};

function ThemeIcon({ preference }: { preference: ThemePreference }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      {preference === "system" ? (
        <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></>
      ) : preference === "light" ? (
        <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>
      ) : (
        <path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z" />
      )}
    </svg>
  );
}

export default function SiteHeader() {
  const { locale } = useLanguage();
  const { preference, setPreference } = useTheme();
  const pt = locale === "pt-br";
  const names = pt
    ? { system: "sistema", light: "claro", dark: "escuro" }
    : { system: "system", light: "light", dark: "dark" };
  const next = nextTheme[preference];
  const label = pt
    ? `Tema: ${names[preference]}. Mudar para ${names[next]}`
    : `Theme: ${names[preference]}. Switch to ${names[next]}`;
  return (
    <header className="site-header">
      <Link href="/" className="wordmark">
        <span className="brand-mark" aria-hidden="true">a<span>.</span></span>
        <span>arthursens.dev</span>
      </Link>
      <button type="button" className="theme-button" aria-label={label}
        title={label} data-theme-preference={preference}
        onClick={() => setPreference(next)}>
        <ThemeIcon preference={preference} />
      </button>
    </header>
  );
}
