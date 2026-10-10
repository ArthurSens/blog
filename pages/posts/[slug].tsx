import Container from '../../components/container'
import PostBody from '../../components/post-body'
import Header from '../../components/header'
import PostHeader from '../../components/post-header'
import Layout from '../../components/layout'
import { getPostBySlug, getAllPosts, translationsFor } from '../../lib/api'
import Head from 'next/head'
import markdownToHtml from '../../lib/markdownToHtml'
import type PostType from '../../interfaces/post'
import LanguageSwitcher from '../../components/language-switcher'
import LanguageMeta from '../../components/language-meta'
import { getLocale, siteUrl, type Translation } from '../../lib/i18n'

type Props = { post: PostType; translations: Translation[]; preview?: boolean }

export default function Post({ post, translations, preview }: Props) {
  const imageURL = new URL(post.ogImage.url, siteUrl).href
  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        <LanguageSwitcher translations={translations} />
        <LanguageMeta path={`/posts/${post.slug}`} locale={post.lang}
          alternates={translations.map(({ slug, lang }) => ({ path: `/posts/${slug}`, lang }))} />
        <article className="mb-32">
          <Head>
            <title>{post.title} | Arthur Sens</title>
            <meta name="description" content={post.excerpt} key="description" />
            <meta property="og:title" content={post.title} />
            <meta property="og:description" content={post.excerpt} />
            <meta property="og:image" content={imageURL} key="og:image" />
            <meta name="twitter:title" content={post.title} key="twitter:title" />
            <meta name="twitter:description" content={post.excerpt} key="twitter:description" />
            <meta name="twitter:image:src" content={imageURL} key="twitter:image:src" />
          </Head>
          <PostHeader title={post.title} coverImage={post.coverImage} date={post.date} author={post.author} />
          <PostBody content={post.content} />
        </article>
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params, locale }: { params: { slug: string }; locale?: string }) {
  const post = getPostBySlug(params.slug)
  if (!post || post.lang !== getLocale(locale)) return { notFound: true }
  const translations = translationsFor(post, getAllPosts())
  const content = await markdownToHtml(post.content)
  return { props: { post: { ...post, content }, translations } }
}

export async function getStaticPaths() {
  return {
    paths: getAllPosts().map(({ slug, lang }) => ({ params: { slug }, locale: lang })),
    fallback: false,
  }
}
