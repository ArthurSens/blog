import { useState } from "react";
import { useLanguage } from "../lib/use-language";
import { designCopy } from "../lib/design-copy";
import { type Locale } from "../lib/i18n";

const destinations = {
  en: process.env.NEXT_PUBLIC_NEWSLETTER_URL_EN || "",
  "pt-br": process.env.NEXT_PUBLIC_NEWSLETTER_URL_PT_BR || "",
};
export function newsletterUrl(locale: Locale) {
  try {
    const url = new URL(destinations[locale]);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}
export default function Newsletter() {
  const { locale } = useLanguage();
  const [language, setLanguage] = useState<Locale>(locale);
  const c = designCopy[locale];
  const url = newsletterUrl(language);
  return (
    <section className="newsletter" aria-labelledby="newsletter-title">
      <div className="newsletter-copy">
        <span className="eyebrow">
          {locale === "en" ? "THE OCCASIONAL NOTE" : "DE VEZ EM QUANDO"}
        </span>
        <h2 id="newsletter-title">{c.newsletter}</h2>
        <p>{url ? c.newsletterText : c.newsletterFallback}</p>
      </div>
      <div className="newsletter-actions">
        <label htmlFor="newsletter-language">
          {locale === "en" ? "Reading language" : "Idioma de leitura"}
        </label>
        <select
          id="newsletter-language"
          value={language}
          onChange={(e) => setLanguage(e.target.value as Locale)}
        >
          <option value="en">English</option>
          <option value="pt-br">Português</option>
        </select>
        {url && (
          <a className="button button-dark" href={url}>
            {c.subscribe} <span aria-hidden="true">↗</span>
          </a>
        )}
        <a
          className={url ? "text-link" : "button button-dark"}
          href={language === "en" ? "/feed.xml" : "/pt-br/feed.xml"}
        >
          {c.rss} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
