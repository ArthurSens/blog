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

## Visual design and characters

The approved brief is in `design/brief.md`; generation prompts and asset provenance are in `design/`.
`styles/index.css` defines the responsive layout and colors. `lib/design-copy.ts` contains English and Portuguese UI copy.

The cast uses ordinary image assets and discrete sprite frames. `Character` stops frame updates offscreen and while the page is hidden. Animations follow the visitor’s system reduced-motion preference without storing a local setting. Article pages do not run the homepage cast. The Grief memorial is still, the original photo remains available, and a small running vignette appears after the essay.

Gon and Pitou's artwork is based on Arthur's supplied photographs. Gon is black-and-white; Pitou is gray-and-white with a fluffy tail. Killua is tri-color.

Every original `_posts/*.md` file is preserved. Presentation decisions such as Grief's memorial live outside the post in `lib/post-presentation.ts` and the article renderer. Future post-specific interactive explanations can be added as explicit React components, alongside prepared assets; they do not require rewriting the Markdown pipeline or adding a CMS. Prefer a useful static fallback and opt-in motion.

## Free email subscriptions

The site stays on Vercel. Brevo stores subscribers; there is no custom subscriber database.

1. Create a free Brevo account and verify the sending domain.
2. Create separate English and Brazilian Portuguese contact lists and hosted signup forms. Each form should add only to its matching list. Request email only, enable double opt-in, and provide unsubscribe support. Disable open/click tracking if it isn't needed.
3. Set `NEXT_PUBLIC_NEWSLETTER_URL_EN` and `NEXT_PUBLIC_NEWSLETTER_URL_PT_BR` to the respective HTTPS hosted-form URLs in Vercel, then redeploy. These are public links, not API keys.
4. Until configured, the site explicitly offers working RSS links rather than collecting email addresses that cannot be stored.

Prepare a notification with `npm run newsletter:draft -- <post-slug>`. It writes reviewable HTML and metadata under `.newsletter-drafts/`, which is ignored by Git. It has **no sending capability**. Review the HTML, import it into a Brevo campaign draft, select the matching language list, verify Brevo's unsubscribe link, and send only after Arthur approves that exact draft. Track the `translationKey` and language from the JSON when scheduling: one notification per story per subscribed language, never resend for an edit or a redeploy.

Brevo's free daily sending cap is currently 300 emails, with Brevo branding. Larger lists need deliberate batches within the free allowance; no paid upgrade is enabled by this repository. Provider limits should be checked before sending.

The RSS feeds `/feed.xml` and `/pt-br/feed.xml` are generated from each language's catalog during `prebuild` and `predev`.

## Audience measurement

Vercel Analytics remains enabled for aggregate visitor/page-view measurements. Brevo supplies confirmed subscriber counts after setup. We add no cross-site identifiers, email tracking events, or long-lived visitor IDs. Vercel discards visitor-session identifiers after 24 hours, so it does **not** reliably measure returning readers across weeks; don't report that metric as available.

## Review checks

The redesign adds HTTP checks for feeds, privacy pages, the unchanged memorial text, and notification drafts. Browser interaction checks cover topic filters, motion, mobile overflow and memorial behavior. Existing macOS visual snapshots describe the previous design and must be deliberately rebaselined after visual approval; they are not an acceptance test for matching the new design to the old one.
