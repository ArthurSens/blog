import Container from '../components/container'
import MoreStories from '../components/more-stories'
import HeroPost from '../components/hero-post'
import Intro from '../components/intro'
import Layout from '../components/layout'
import { getAllPosts } from '../lib/api'
import Head from 'next/head'
import Post from '../interfaces/post'
import Link from 'next/link'
import LanguageSwitcher from '../components/language-switcher'
import LanguageMeta from '../components/language-meta'
import { getLocale, locales } from '../lib/i18n'
import { useLanguage } from '../lib/use-language'

type Props = {
  allPosts: Post[]
}

export default function Index({ allPosts }: Props) {
  const { locale, t } = useLanguage()
  const heroPost = allPosts[0]
  const morePosts = allPosts.slice(1)
  return (
    <>
      <Layout>
        <Head>
          <title>{`ArthurSens.dev`}</title>
        </Head>
        <Container>
          <Intro />
          <LanguageSwitcher />
          <LanguageMeta path="/" locale={locale} alternates={locales.map((lang) => ({ path: '/', lang }))} />
          {!heroPost && (
            <div className="mb-32">
              <p className="mb-4">{t.empty}</p>
              <Link href="/" locale="en" className="underline">{t.browseEnglish}</Link>
            </div>
          )}
          {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.coverImage}
              date={heroPost.date}
              author={heroPost.author}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt}
            />
          )}
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        </Container>
      </Layout>
    </>
  )
}

export const getStaticProps = async ({ locale }: { locale?: string }) => {
  const allPosts = getAllPosts(getLocale(locale)).map(({ content, ...post }) => post)
  return { props: { allPosts } }
}
