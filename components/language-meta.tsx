import Head from 'next/head'
import { languageTag, localizedPath, siteUrl, type Locale } from '../lib/i18n'

type Alternate = { path: string; lang: Locale }
type Props = { path: string; locale: Locale; alternates: Alternate[] }

export default function LanguageMeta({ path, locale, alternates }: Props) {
  const defaultVersion = alternates.find((item) => item.lang === 'en')
  return (
    <Head>
      <link rel="canonical" href={siteUrl + localizedPath(path, locale)} />
      {alternates.map((item) => (
        <link key={item.lang} rel="alternate" hrefLang={languageTag(item.lang)}
          href={siteUrl + localizedPath(item.path, item.lang)} />
      ))}
      {defaultVersion && <link rel="alternate" hrefLang="x-default"
        href={siteUrl + defaultVersion.path} />}
      <meta property="og:locale" content={locale === 'en' ? 'en_US' : 'pt_BR'} />
    </Head>
  )
}
