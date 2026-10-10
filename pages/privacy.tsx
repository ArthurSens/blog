import Head from "next/head";
import Layout from "../components/layout";
import SiteHeader from "../components/site-header";
import { useLanguage } from "../lib/use-language";
import LanguageMeta from "../components/language-meta";
import { locales } from "../lib/i18n";

export default function Privacy() {
  const { locale } = useLanguage();
  const pt = locale === "pt-br";
  return (
    <Layout>
      <Head>
        <title>{pt ? "Privacidade" : "Privacy"} | Arthur Sens</title>
      </Head>
      <div className="shell">
        <SiteHeader />
        <LanguageMeta
          path="/privacy"
          locale={locale}
          alternates={locales.map((lang) => ({ path: "/privacy", lang }))}
        />
        <div className="reading-column privacy-content">
          <h1>{pt ? "Um pouco de privacidade." : "A little privacy."}</h1>
          <h2>{pt ? "Leitura" : "Reading"}</h2>
          <p>
            {pt
              ? "Este site usa Vercel Web Analytics para estatísticas agregadas de visitas. Não adicionamos identificadores persistentes para acompanhar você ao longo de semanas ou entre sites."
              : "This site uses Vercel Web Analytics for aggregate visitor statistics. We don’t add persistent identifiers to follow you across weeks or across websites."}{" "}
            <a href="https://vercel.com/docs/analytics/privacy-policy">
              Vercel Web Analytics
            </a>
            .
          </p>
          <h2>{pt ? "Preferências" : "Preferences"}</h2>
          <p>
            {pt
              ? "O controle de movimento salva apenas sua preferência neste navegador. Essa preferência não é enviada para um servidor."
              : "The motion control saves only your preference in this browser. That preference is not sent to a server."}
          </p>
          <h2>{pt ? "Novos artigos" : "New posts"}</h2>
          <p>
            {pt
              ? "RSS funciona sem cadastro. Quando a inscrição por e-mail estiver disponível, o formulário será hospedado pela Brevo e solicitará seu e-mail e idioma. Você poderá cancelar a inscrição pelo link em cada mensagem."
              : "RSS works without signing up. When email signup is available, the form is hosted by Brevo and asks for your email and reading language. You can unsubscribe using the link in each message."}
          </p>
        </div>
      </div>
    </Layout>
  );
}
