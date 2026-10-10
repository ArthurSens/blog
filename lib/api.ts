import fs from 'fs'
import { join } from 'path'
import { parse } from 'yaml'
import type Post from '../interfaces/post'
import { getLocale, locales, type Locale, type Translation } from './i18n'

const postsDirectory = join(process.cwd(), '_posts')

export function parsePost(fileContents: string, slug: string): Post {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(fileContents)
  if (!match) throw new Error(`${slug}: missing valid YAML front matter`)
  const data = parse(match[1]) as Record<string, unknown>
  const rawLanguage = data.lang ?? 'en'
  if (typeof rawLanguage !== 'string' || !locales.includes(rawLanguage.toLowerCase() as Locale)) {
    throw new Error(`${slug}: unsupported language ${rawLanguage}`)
  }
  const translationKey = data.translationKey ?? slug
  if (typeof translationKey !== 'string' || !translationKey.trim()) {
    throw new Error(`${slug}: translationKey must be a non-empty string`)
  }
  return { ...data, slug, lang: getLocale(rawLanguage), translationKey, content: match[2] } as Post
}

export function validateTranslations(posts: Post[]) {
  const seen = new Set<string>()
  for (const post of posts) {
    const key = `${post.lang}:${post.translationKey}`
    if (seen.has(key)) throw new Error(`Duplicate translation: ${key}`)
    seen.add(key)
  }
}

export function translationsFor(post: Post, posts: Post[]): Translation[] {
  return posts.filter((candidate) => candidate.translationKey === post.translationKey)
    .map(({ slug, lang }) => ({ slug, lang }))
}

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.md'))
}

export function getPostBySlug(slug: string): Post | undefined {
  const realSlug = slug.replace(/\.md$/, '')
  // Resolve only known filenames, never a path supplied by a request.
  if (!getPostSlugs().includes(`${realSlug}.md`)) return undefined
  return parsePost(fs.readFileSync(join(postsDirectory, `${realSlug}.md`), 'utf8'), realSlug)
}

export function getAllPosts(locale?: Locale): Post[] {
  const posts = getPostSlugs().map((slug) => getPostBySlug(slug)!)
  validateTranslations(posts)
  return posts.filter((post) => !locale || post.lang === locale)
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
}
