import Link from 'next/link'
import { locales, languageNames, languageTag, type Translation } from '../lib/i18n'
import { useLanguage } from '../lib/use-language'

type Props = { translations?: Translation[] }

export default function LanguageSwitcher({ translations }: Props) {
  const { locale, t } = useLanguage()
  return (
    <nav aria-label={t.languages} className="my-6 text-sm">
      <ul className="flex flex-wrap gap-x-6 gap-y-3">
        {locales.map((language) => {
          const translation = translations?.find((post) => post.lang === language)
          const missing = translations && !translation
          return (
            <li key={language}>
              {language === locale ? (
                <span lang={languageTag(language)} aria-current="page" className="font-bold">{languageNames[language]}</span>
              ) : missing ? (
                <span>
                  {t.missingTranslation} {languageNames[language]}.{' '}
                  <Link href="/" locale={language} className="underline">
                    {t.browsePosts} {languageNames[language]}
                  </Link>
                </span>
              ) : (
                <Link href={translation ? `/posts/${translation.slug}` : '/'} locale={language}
                  hrefLang={languageTag(language)} lang={languageTag(language)} className="underline">
                  {languageNames[language]}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
