import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "../components/layout";
import SiteHeader from "../components/site-header";
import DateFormatter from "../components/date-formatter";
import Character from "../components/character";
import Newsletter from "../components/newsletter";
import LanguageSwitcher from "../components/language-switcher";
import LanguageMeta from "../components/language-meta";
import { getAllPosts } from "../lib/api";
import { getLocale, locales } from "../lib/i18n";
import { useLanguage } from "../lib/use-language";
import { designCopy } from "../lib/design-copy";
import { readingMinutes, topicFor } from "../lib/post-presentation";
import type Post from "../interfaces/post";

type ListedPost = Omit<Post, "content"> & { readingMinutes: number };
type Props = { allPosts: ListedPost[] };

export default function Index({ allPosts }: Props) {
  const { locale, t } = useLanguage();
  const c = designCopy[locale];
  const [filter, setFilter] = useState("all");
  const [friend, setFriend] = useState<string | null>(null);
  const filtered = allPosts.filter(
    (p) => filter === "all" || topicFor(p) === filter,
  );
  const [latest, ...rest] = filtered;
  const companions = [
    { id: "gon", name: "Gon" },
    { id: "pitou", name: "Pitou" },
  ];
  return (
    <Layout>
      <Head>
        <title>
          {locale === "en"
            ? "Arthur Sens — systems, stories & a little life"
            : "Arthur Sens — sistemas, histórias e um pouco da vida"}
        </title>
      </Head>
      <div className="shell">
        <SiteHeader />
        <div className="locale-row">
          <span className="eyebrow">{c.aside}</span>
          <LanguageSwitcher />
        </div>
        <LanguageMeta
          path="/"
          locale={locale}
          alternates={locales.map((lang) => ({ path: "/", lang }))}
        />
        <section className="welcome" aria-labelledby="welcome-title">
          <div className="welcome-copy">
            <h1 id="welcome-title">
              {c.hello}
              <span className="accent">*</span>
            </h1>
            <p>{c.intro}</p>
            <details className="about-details">
              <summary>
                {c.about} <span aria-hidden="true">↗</span>
              </summary>
              <p>{c.aboutText}</p>
            </details>
          </div>
          <div className="cast-scene" aria-label={c.scene}>
            <div className="scene-orbit" aria-hidden="true" />
            <Character label={c.wave} />
            <div className="cat-pair">
              {companions.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  className="cat-button"
                  aria-label={cat.name}
                  onClick={() =>
                    setFriend(friend === cat.name ? null : cat.name)
                  }
                >
                  <img
                    src={`/assets/cast/${cat.id}.webp`}
                    alt=""
                    width="80"
                    height="80"
                  />
                </button>
              ))}
            </div>
            {friend && (
              <span className="cast-name" role="status">
                {friend} ♡
              </span>
            )}
            <span className="scene-floor" aria-hidden="true" />
          </div>
        </section>
        <section
          className="writing-section"
          id="writing"
          aria-labelledby="writing-title"
        >
          <div className="section-heading">
            <h2 id="writing-title">
              {c.writing}
              <span className="article-count">
                {allPosts.length.toString().padStart(2, "0")}
              </span>
            </h2>
            <div className="post-filters" role="group" aria-label={c.filter}>
              {(["all", "systems", "life"] as const).map((key) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setFilter(key)}
                  aria-pressed={filter === key}
                >
                  {c[key]}
                </button>
              ))}
            </div>
          </div>
          {!latest && (
            <div className="empty-state">
              <p>{allPosts.length ? c.noResults : t.empty}</p>
              {!allPosts.length && (
                <Link href="/" locale="en" className="text-link">
                  {t.browseEnglish} →
                </Link>
              )}
            </div>
          )}
          {latest && (
            <article className={`featured-post topic-${topicFor(latest)}`}>
              <div className="featured-copy">
                <span className="eyebrow featured-label">
                  {c.latest} <span aria-hidden="true">↗</span>
                </span>
                <div className="post-meta">
                  <span className="topic-label">{c[topicFor(latest)]}</span>
                  <span aria-hidden="true">·</span>
                  <DateFormatter dateString={latest.date} />
                </div>
                <h3>
                  <Link href={`/posts/${latest.slug}`}>{latest.title}</Link>
                </h3>
                {latest.excerpt && <p>{latest.excerpt}</p>}
                <Link href={`/posts/${latest.slug}`} className="read-link">
                  {c.read} <span aria-hidden="true">↗</span>
                </Link>
              </div>
              <Link
                href={`/posts/${latest.slug}`}
                className="featured-art"
                tabIndex={-1}
                aria-hidden="true"
              >
                <img src={latest.coverImage} alt="" width="400" height="300" />
              </Link>
            </article>
          )}
          {rest.length > 0 && (
            <div className="archive">
              <h3 className="eyebrow archive-label">{c.archive}</h3>
              {rest.map((post, i) => (
                <article className="post-row" key={post.slug}>
                  <span className="post-index" aria-hidden="true">
                    {String(i + 2).padStart(2, "0")}
                  </span>
                  <div className="post-row-content">
                    <div className="post-meta">
                      <span className="topic-label">{c[topicFor(post)]}</span>
                      <span aria-hidden="true">·</span>
                      <DateFormatter dateString={post.date} />
                    </div>
                    <h3>
                      <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                    </h3>
                    {post.excerpt && <p>{post.excerpt}</p>}
                    <span className="reading-time">
                      {post.readingMinutes} {c.minutes}
                    </span>
                  </div>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="row-image"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <img
                      src={post.coverImage}
                      alt=""
                      loading="lazy"
                      width="128"
                      height="100"
                    />
                  </Link>
                  <span className="row-arrow" aria-hidden="true">
                    ↗
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>
        <Newsletter key={locale} />
      </div>
    </Layout>
  );
}
export const getStaticProps = async ({ locale }: { locale?: string }) => {
  const allPosts = getAllPosts(getLocale(locale)).map(
    ({ content, ...post }) => ({
      ...post,
      readingMinutes: readingMinutes(content),
    }),
  );
  return { props: { allPosts } };
};
