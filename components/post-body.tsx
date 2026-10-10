import markdownStyles from "./markdown-styles.module.css";

export default function PostBody({ content }: { content: string }) {
  return (
    <div className="reading-column">
      <div
        className={markdownStyles.markdown}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
