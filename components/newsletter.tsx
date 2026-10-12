import { useState } from "react";
import { useLanguage } from "../lib/use-language";
import { designCopy } from "../lib/design-copy";
import { type Locale } from "../lib/i18n";

const destinations = {
  en: process.env.NEXT_PUBLIC_NEWSLETTER_URL_EN ??
    "https://be00fc41.sibforms.com/v2/serve/MUIFAFUfAUTa5mJuyzvQ1XqUcUZY5Ce-sUkguEUg2s4spxQZulhjFCF3SLkZX3yb0S_pV7msYCKvdDquGvOf8v0wm8cTWy8Y1lwbuX_Qb3mLCoMS3_KdlCh9I3nrqm_9dIyp5x0NfXWp2sN9DMCU7KSdhalo4iaGUkyPEFK9ZeHv69SL3fWytxTHfAUJLKY3FEEO6lCnYXLO1_CzoQ==",
  "pt-br": process.env.NEXT_PUBLIC_NEWSLETTER_URL_PT_BR ??
    "https://be00fc41.sibforms.com/v2/serve/MUIFABlCu9pyqhwq3opt8ID4bHLv2YfWY_q53-meGx2hTW3TD8e_4MilSU37ZAvuxhzGdrHd7EWTDlez9yi-7udEGh_c0T7UP_yeDhKqCY0BZTn1539bR8sRNJBEsfO9NXMLfjT7n6c4c5R_2kqu5pganRs7lymBz-J8I_ttOQlZoG6uY-n0vVWGbJIJB8iOXrO81yW8Lr1fdi2Gqg==",
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
  const [openedLocale, setOpenedLocale] = useState<Locale | null>(null);
  const formOpen = openedLocale === locale;
  const c = designCopy[locale];
  const url = newsletterUrl(locale);
  const embeddable = url && new URL(url).hostname.endsWith(".sibforms.com");
  return (
    <section className="newsletter" aria-labelledby="newsletter-title">
      <div className="newsletter-copy">
        <h2 id="newsletter-title">{c.newsletter}</h2>
        <p>{url ? c.newsletterText : c.newsletterFallback}</p>
      </div>
      <div className="newsletter-actions">
        {url && embeddable && (
          <button className="button button-dark" type="button"
            aria-expanded={formOpen} aria-controls="newsletter-form"
            onClick={() => setOpenedLocale(formOpen ? null : locale)}>
            {formOpen ? (locale === "en" ? "Close form" : "Fechar formulário") : c.subscribe}
          </button>
        )}
        {url && !embeddable && (
          <a className="button button-dark" href={url}>
            {c.subscribe} <span aria-hidden="true">↗</span>
          </a>
        )}
        <a
          className={url ? "text-link" : "button button-dark"}
          href={locale === "en" ? "/feed.xml" : "/pt-br/feed.xml"}
        >
          {c.rss} <span aria-hidden="true">↗</span>
        </a>
      </div>
      {url && embeddable && formOpen && (
        <div id="newsletter-form" className="newsletter-form">
          <iframe key={url} src={url} width="540" height="520"
            title={locale === "en" ? "Subscribe to Arthur Sens’s blog in English" : "Assinar o blog de Arthur Sens em português"}
            referrerPolicy="no-referrer" />
        </div>
      )}
    </section>
  );
}
