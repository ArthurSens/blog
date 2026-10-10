import { useState } from "react";
import { useMotion } from "./motion";
import { useLanguage } from "../lib/use-language";
import { designCopy } from "../lib/design-copy";

export default function Memorial() {
  const { locale } = useLanguage();
  const c = designCopy[locale];
  const { enabled } = useMotion();
  const [playing, setPlaying] = useState(false);
  return (
    <figure
      className={`memorial ${playing && enabled ? "memory-playing" : ""}`}
    >
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
      <figcaption>
        <span>{c.memory}</span>
        {enabled && (
          <button
            type="button"
            onClick={() => setPlaying(!playing)}
            aria-pressed={playing}
          >
            {playing ? c.stopMoment : c.moment}{" "}
            <span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span>
          </button>
        )}
      </figcaption>
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
