import { useLanguage } from "../lib/use-language";
import { designCopy } from "../lib/design-copy";

export default function Memorial() {
  const { locale } = useLanguage();
  const c = designCopy[locale];
  return (
    <figure className="memorial">
      <div className="memory-art">
        <img
          src="/assets/cast/killua-memory.webp"
          alt={
            locale === "en"
              ? "An illustration of Arthur sitting quietly with Killua."
              : "Uma ilustração de Arthur sentado tranquilamente com Killua."
          }
          width="1000"
          height="550"
        />
      </div>
      <figcaption>{c.memory}</figcaption>
      <details className="memory-photo">
        <summary>{c.photo}</summary>
        <img
          src="/assets/blog/grief/cover.png"
          alt="Killua"
          width="512"
          height="640"
          loading="lazy"
        />
      </details>
    </figure>
  );
}
