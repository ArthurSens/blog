import Footer from "./footer";
import Meta from "./meta";
import { useLanguage } from "../lib/use-language";
import { designCopy } from "../lib/design-copy";

type Props = { preview?: boolean; children: React.ReactNode };
export default function Layout({ preview, children }: Props) {
  const { locale, t } = useLanguage();
  return (
    <>
      <Meta />
      <a className="skip-link" href="#content">
        {designCopy[locale].skip}
      </a>
      {preview && (
        <div className="preview-banner">
          {t.preview} <a href="/api/exit-preview">{t.exitPreview}</a>
        </div>
      )}
      <main id="content">{children}</main>
      <Footer />
    </>
  );
}
