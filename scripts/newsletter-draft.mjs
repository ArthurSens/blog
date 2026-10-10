// Creates files for review. This script has no email-sending capability.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { parse } from "yaml";
const slug = process.argv[2];
if (
  !slug ||
  !/^[a-zA-Z0-9_-]+$/.test(slug) ||
  !existsSync(`_posts/${slug}.md`)
) {
  console.error("Usage: npm run newsletter:draft -- <existing-post-slug>");
  process.exit(1);
}
const source = readFileSync(`_posts/${slug}.md`, "utf8");
const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(source);
if (!match) throw new Error("Invalid front matter");
const post = parse(match[1]);
const lang = (post.lang || "en").toLowerCase();
if (!["en", "pt-br"].includes(lang)) throw new Error("Unsupported language");
const escape = (value) =>
  String(value ?? "").replace(
    /[<>&"']/g,
    (c) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const url = `https://arthursens.dev${lang === "en" ? "" : "/pt-br"}/posts/${slug}`;
const action = lang === "en" ? "Read the post" : "Ler o artigo";
const html = `<!doctype html><html lang="${lang}"><meta charset="utf-8"><title>${escape(post.title)}</title><body style="font-family:Arial,sans-serif;max-width:600px;margin:40px auto;padding:24px;color:#242725;background:#f7f6f2"><p>Arthur Sens</p><h1 style="font-family:Georgia,serif">${escape(post.title)}</h1><p>${escape(post.excerpt)}</p><p><a href="${url}" style="color:#486737">${action} →</a></p><hr><p style="font-size:12px"><a href="{{ unsubscribe }}">${lang === "en" ? "Unsubscribe" : "Cancelar inscrição"}</a></p></body></html>`;
mkdirSync(".newsletter-drafts", { recursive: true });
writeFileSync(`.newsletter-drafts/${slug}.html`, html);
writeFileSync(
  `.newsletter-drafts/${slug}.json`,
  JSON.stringify(
    {
      status: "draft",
      subject: post.title,
      language: lang,
      translationKey: post.translationKey || slug,
      url,
      approvalRequired: true,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `Draft prepared at .newsletter-drafts/${slug}.html. Review before importing into Brevo. Nothing was sent.`,
);
