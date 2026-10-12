import markdownStyles from "./markdown-styles.module.css";
import ArticleImage from "./article-image";
import { mdxPosts } from "../lib/mdx-posts.generated";

export default function PostBody({ content, slug, format }: {
  content: string; slug: string; format?: "md" | "mdx";
}) {
  if (format === "mdx") {
    const Article = mdxPosts[slug];
    if (!Article) throw new Error(`Missing compiled MDX article: ${slug}`);
    return <div className={`${markdownStyles.markdown} mdx-article`}><Article components={{ img: ArticleImage }} /></div>;
  }
  return (
    <div className="reading-column">
      <div className={markdownStyles.markdown} dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
