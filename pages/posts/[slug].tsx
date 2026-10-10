import Head from "next/head";
import Link from "next/link";
import PostBody from "../../components/post-body";
import SiteHeader from "../../components/site-header";
import DateFormatter from "../../components/date-formatter";
import Layout from "../../components/layout";
import Memorial from "../../components/memorial";
import Newsletter from "../../components/newsletter";
import { getPostBySlug, getAllPosts, translationsFor } from "../../lib/api";
import markdownToHtml from "../../lib/markdownToHtml";
import type PostType from "../../interfaces/post";
import LanguageSwitcher from "../../components/language-switcher";
import LanguageMeta from "../../components/language-meta";
import { getLocale, siteUrl, type Translation } from "../../lib/i18n";
import { designCopy } from "../../lib/design-copy";
import { readingMinutes, topicFor } from "../../lib/post-presentation";

type Props = {
  post: PostType;
  translations: Translation[];
  readingTime: number;
  preview?: boolean;
};
export default function Post({
  post,
  translations,
  readingTime,
  preview,
}: Props) {
  const imageURL = new URL(post.ogImage.url, siteUrl).href;
  const c = designCopy[post.lang];
  const memorial = post.translationKey === "grief";
  return (
    <Layout preview={preview}>
      <div className={`shell article-shell ${memorial ? "memorial-page" : ""}`}>
        <SiteHeader />
        <div className="article-navigation">
          <Link href="/" className="back-link">
            ← {c.back}
          </Link>
          <LanguageSwitcher translations={translations} />
        </div>
        <LanguageMeta
          path={`/posts/${post.slug}`}
          locale={post.lang}
          alternates={translations.map(({ slug, lang }) => ({
            path: `/posts/${slug}`,
            lang,
          }))}
        />
        <article className="article">
          <Head>
            <title>{post.title} | Arthur Sens</title>
            <meta name="description" content={post.excerpt} key="description" />
            <meta property="og:title" content={post.title} />
            <meta property="og:description" content={post.excerpt} />
            <meta property="og:image" content={imageURL} key="og:image" />
            <meta
              name="twitter:title"
              content={post.title}
              key="twitter:title"
            />
            <meta
              name="twitter:description"
              content={post.excerpt}
              key="twitter:description"
            />
            <meta
              name="twitter:image:src"
              content={imageURL}
              key="twitter:image:src"
            />
          </Head>
          <header className="article-heading reading-column">
            <span className="eyebrow">{c[topicFor(post)]}</span>
            <h1>{post.title}</h1>
            <div className="article-byline">
              <img src={post.author.picture} alt="" width="32" height="32" />
              <span>{post.author.name}</span>
              <span aria-hidden="true">·</span>
              <DateFormatter dateString={post.date} />
              <span aria-hidden="true">·</span>
              <span>
                {readingTime} {c.minutes}
              </span>
            </div>
          </header>
          {memorial ? (
            <Memorial />
          ) : (
            <div className="article-cover">
              <img
                src={post.coverImage}
                alt={`${post.title} — ${post.lang === "en" ? "cover illustration" : "ilustração de capa"}`}
                width="1200"
                height="600"
              />
            </div>
          )}
          <PostBody content={post.content} />
          {memorial && (
            <div className="killua-chase reading-column">
              <img
                src="/assets/cast/killua-chase.webp"
                alt={
                  post.lang === "en"
                    ? "Killua the cat runs playfully with Killua from Hunter × Hunter."
                    : "O gato Killua corre brincando com Killua de Hunter × Hunter."
                }
                width="520"
                height="347"
                loading="lazy"
              />
            </div>
          )}
          <div className="article-end reading-column">
            <span aria-hidden="true">✳</span>
            <Link href="/">← {c.back}</Link>
          </div>
        </article>
        <Newsletter key={post.lang} />
      </div>
    </Layout>
  );
}
export async function getStaticProps({
  params,
  locale,
}: {
  params: { slug: string };
  locale?: string;
}) {
  const post = getPostBySlug(params.slug);
  if (!post || post.lang !== getLocale(locale)) return { notFound: true };
  const translations = translationsFor(post, getAllPosts());
  const readingTime = readingMinutes(post.content);
  const content = await markdownToHtml(post.content);
  return { props: { post: { ...post, content }, translations, readingTime } };
}
export async function getStaticPaths() {
  return {
    paths: getAllPosts().map(({ slug, lang }) => ({
      params: { slug },
      locale: lang,
    })),
    fallback: false,
  };
}
