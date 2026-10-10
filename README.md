# Arthur Sens's blog

## Development

Use Node.js 22, then `npm ci` and `npm run dev`.
Run `npm run typecheck`, `npm run build`, and `npm run test:i18n` before submitting changes.
Install the browser for browser tests with `npx playwright install chromium`.
`npm run test:i18n:http` verifies production HTML, routes, catalogs, and metadata without a browser.
Visual baselines can be reviewed with `npm run test:visual` (the existing baselines were captured on macOS).

## Languages and translations

English is the default: `/` and `/posts/<slug>` keep their existing URLs.
Brazilian Portuguese uses `/pt-br` and `/pt-br/posts/<slug>`.
The URL determines the language; browser preferences do not redirect visitors.
Each home lists only articles in its language. Articles without translations stay accessible in their original language.

Keep Markdown files directly in `_posts/`. Filenames define slugs independently in each language.
Add these fields to every new article's YAML front matter:

```yaml
lang: en
translationKey: my-article
```

For the Brazilian Portuguese version use `lang: pt-BR` and the **same** `translationKey`.
The title, excerpt, filename, and body may differ. Share cover assets where appropriate.
Only one article per language may use a given translation key; duplicates and unsupported languages fail the build.
Legacy posts without these fields default to English and use their filename as the translation key.

The language selector links directly to available translations. If a translation is missing, it explains this and links to the other language's catalog rather than presenting the original as a translation.
Each article has its own canonical URL and reciprocal `hreflang` links for available versions.
UI strings are maintained in `lib/i18n.ts`.

This uses Next.js Pages Router i18n with static generation and `next start`; `output: 'export'` is not supported by Next.js i18n routing.
