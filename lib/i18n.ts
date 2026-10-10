export const locales = ['en', 'pt-br'] as const
export type Locale = (typeof locales)[number]
export type Translation = { slug: string; lang: Locale }
export const siteUrl = 'https://arthursens.dev'
export const languageNames: Record<Locale, string> = { en: 'English', 'pt-br': 'Português' }

export function getLocale(value?: string): Locale {
  return value?.toLowerCase() === 'pt-br' ? 'pt-br' : 'en'
}

export function languageTag(locale: Locale) {
  return locale === 'pt-br' ? 'pt-BR' : 'en'
}

export function localizedPath(path: string, locale: Locale) {
  return locale === 'en' ? path : `/pt-br${path === '/' ? '' : path}`
}

export const messages = {
  en: {
    languages: 'Languages', moreStories: 'More Stories', loading: 'Loading…',
    sourceIntro: 'The source code for this blog is ', sourceLink: 'available on GitHub',
    preview: 'This page is a preview.', exitPreview: 'Exit preview mode',
    footer: 'Statically Generated with Next.js.', cover: 'Cover image for',
    description: 'Arthur Sens personal blog.',
    socialDescription: "Arthur’s adventures in distributed systems, observability and weightlifting!",
    empty: 'No posts in English yet.', browseEnglish: 'Explore the English archive',
    missingTranslation: 'This article is not available in', browsePosts: 'Browse posts in',
  },
  'pt-br': {
    languages: 'Idiomas', moreStories: 'Mais artigos', loading: 'Carregando…',
    sourceIntro: 'O código-fonte deste blog está ', sourceLink: 'disponível no GitHub',
    preview: 'Esta página é uma prévia.', exitPreview: 'Sair do modo de prévia',
    footer: 'Gerado estaticamente com Next.js.', cover: 'Imagem de capa de',
    description: 'Blog pessoal de Arthur Sens.',
    socialDescription: 'As aventuras de Arthur em sistemas distribuídos, observabilidade e levantamento de peso!',
    empty: 'Ainda não há artigos em português.', browseEnglish: 'Explore o acervo em inglês',
    missingTranslation: 'Este artigo não está disponível em', browsePosts: 'Ver artigos em',
  },
}
