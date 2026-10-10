import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { parse } from "yaml";
const escape = (value) =>
  String(value ?? "").replace(
    /[<>&"']/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[c],
  );
const posts = readdirSync("_posts")
  .filter((f) => f.endsWith(".md"))
  .map((file) => {
    const source = readFileSync(`_posts/${file}`, "utf8");
    const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(source);
    if (!match) throw new Error(`Invalid front matter: ${file}`);
    return { ...parse(match[1]), slug: file.slice(0, -3) };
  })
  .sort((a, b) => String(b.date).localeCompare(String(a.date)));
for (const locale of ["en", "pt-br"]) {
  const prefix = locale === "en" ? "" : "/pt-br";
  const entries = posts
    .filter((p) => (p.lang || "en").toLowerCase() === locale)
    .map((p) => {
      const url = `https://arthursens.dev${prefix}/posts/${p.slug}`;
      return `<item><title>${escape(p.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(p.date).toUTCString()}</pubDate><description>${escape(p.excerpt)}</description></item>`;
    })
    .join("\n");
  mkdirSync(`public${prefix}`, { recursive: true });
  writeFileSync(
    `public${prefix}/feed.xml`,
    `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Arthur Sens</title><link>https://arthursens.dev${prefix}</link><description>${locale === "en" ? "Systems, stories, and a little life." : "Sistemas, histórias e um pouco da vida."}</description><language>${locale === "en" ? "en" : "pt-BR"}</language><atom:link href="https://arthursens.dev${prefix}/feed.xml" rel="self" type="application/rss+xml"/>${entries}</channel></rss>\n`,
  );
}
console.log("Generated English and Portuguese RSS feeds.");
