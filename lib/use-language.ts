import { useRouter } from 'next/router'
import { getLocale, messages } from './i18n'

export function useLanguage() {
  const locale = getLocale(useRouter().locale)
  return { locale, t: messages[locale] }
}
