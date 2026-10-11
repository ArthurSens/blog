import type Author from './author'
import type { Locale } from '../lib/i18n'

type PostType = {
  slug: string
  lang: Locale
  translationKey: string
  title: string
  date: string
  coverImage: string
  author: Author
  excerpt: string
  ogImage: {
    url: string
  }
  format?: "md" | "mdx"
  content: string
}

export default PostType
