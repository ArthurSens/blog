import { useState } from "react";
import { useLanguage } from "../lib/use-language";
import { designCopy } from "../lib/design-copy";
import { type Locale } from "../lib/i18n";

const destinations = {
  en: process.env.NEXT_PUBLIC_NEWSLETTER_URL_EN || "",
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
  const [language, setLanguage] = useState<Locale>(locale);
  const [formOpen, setFormOpen] = useState(false);
  const c = designCopy[locale];
  const url = newsletterUrl(language);
  const embeddable = url && new URL(url).hostname.endsWith(".sibforms.com");
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
          onChange={(e) => {
            setLanguage(e.target.value as Locale);
            setFormOpen(false);
          }}
        >
          <option value="en">English</option>
          <option value="pt-br">Português</option>
        </select>
        {url && embeddable && (
          <button className="button button-dark" type="button"
            aria-expanded={formOpen} aria-controls="newsletter-form"
            onClick={() => setFormOpen(!formOpen)}>
            {formOpen ? (locale === "en" ? "Close form" : "Fechar formulário") : c.subscribe}
          </button>
        )}
        {url && (
          <a className={embeddable ? "text-link" : "button button-dark"} href={url}>
            {embeddable ? (locale === "en" ? "Open signup in another page" : "Abrir inscrição em outra página") : c.subscribe} <span aria-hidden="true">↗</span>
          </a>
        )}
        <a
          className={url ? "text-link" : "button button-dark"}
          href={language === "en" ? "/feed.xml" : "/pt-br/feed.xml"}
        >
          {c.rss} <span aria-hidden="true">↗</span>
        </a>
      </div>
      {url && embeddable && formOpen && (
        <div id="newsletter-form" className="newsletter-form">
          <p>{locale === "en" ? "This signup form is hosted by Brevo." : "Este formulário de inscrição é hospedado pelo Brevo."}</p>
          <iframe key={url} src={url} width="540" height="520"
            title={language === "en" ? "Subscribe to Arthur Sens’s blog in English" : "Assinar o blog de Arthur Sens em português"}
            referrerPolicy="no-referrer" />
        </div>
      )}
    </section>
  );
}
