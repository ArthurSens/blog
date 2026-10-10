import { useLanguage } from "../lib/use-language";
import Head from "next/head";
import { HOME_OG_IMAGE_URL } from "../lib/constants";

const Meta = () => {
  const { t, locale } = useLanguage();
  return (
    <Head>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/favicon-16x16.png"
      />
      <link rel="manifest" href="/favicon/site.webmanifest" />
      <link
        rel="mask-icon"
        href="/favicon/safari-pinned-tab.svg"
        color="#000000"
      />
      <link rel="shortcut icon" href="/favicon/favicon.ico" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
      <meta name="theme-color" content="#f7f6f2" />
      <link
        rel="alternate"
        type="application/rss+xml"
        href={locale === "en" ? "/feed.xml" : "/pt-br/feed.xml"}
      />
      <meta name="description" content={t.description} key="description" />
      <meta property="og:image" content={HOME_OG_IMAGE_URL} key="og:image" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@ArthurSilvaSens" />
      <meta name="twitter:creator" content="@ArthurSilvaSens" />
      <meta name="twitter:title" content={t.description} key="twitter:title" />
      <meta
        name="twitter:description"
        content={t.socialDescription}
        key="twitter:description"
      />
      <meta
        name="twitter:image:src"
        content="https://arthursens.dev/assets/blog/authors/arthursens.jpg"
        key="twitter:image:src"
      />
    </Head>
  );
};

export default Meta;
