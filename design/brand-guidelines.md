# Arthur Sens brand guidelines

This is the source of truth for Arthur’s blog, illustrations, newsletters, slides, and social assets. The identity is precise, approachable, and quietly bold. It connects technical expertise at the intersection of Prometheus and OpenTelemetry with Arthur’s life outside work. Black, white, and red reflect his clothing, tattoos, and accessories; avoid claiming universal psychological meanings for colors.

## Color system

Use semantic roles rather than choosing new colors per page. Website tokens live in `styles/index.css`.

| Role / token | Light | Dark | Use |
| --- | --- | --- | --- |
| Surface / `--paper` | `#FAFAFA` | `#171717` | Main background |
| Text / `--ink` | `#191919` | `#F4F4F4` | Body, headings, controls |
| Secondary text / `--muted` | `#626262` | `#B5B5B5` | Metadata and supporting copy |
| Signal / `--accent` | `#C6262D` | `#FF686F` | Links, selected states, focus, small brand details |
| Secondary surface / `--soft` | `#EFEFEF` | `#252525` | Code, supporting panels, image beds |
| Separator / `--line` | `#D5D5D5` | `#444444` | Nonessential dividers and panel outlines |
| Selected surface / `--accent-soft` | `#FBE7E8` | `#3B2325` | Active filters |
| Selection / `--selection` | `#F5C5C7` | `#653035` | Text selection with `--ink` |

Keep blog pages mostly neutral, with restrained red. Do not fill long reading sections with red or add unrelated accent colors. Larger red areas can support a deliberate title or focal point in a slide or social asset; the same identity still applies. Always test foreground/background combinations in the actual medium. The two reds are theme-specific: do not use the light red for small text on the dark background.

Body and secondary text and red links must meet WCAG AA 4.5:1 against their surfaces. Large text needs 3:1. Essential control boundaries, state indicators, and focus indicators need 3:1 against adjacent backgrounds; decorative separators are exempt. Links in prose remain underlined, selected filters expose state, and color never carries meaning alone. For diagrams, use labels and shape or line differences as well as color. Do not assume red always means an error; label errors explicitly.

The website defaults to the system color scheme. A single icon button cycles System → Light → Dark → System, displaying a monitor, sun, or moon for the current preference. Its accessible label and tooltip name the current and next choices in the reader’s language. The header has no Writing link. A manual preference is stored only in browser local storage; System clears it. Both themes must work before hydration and with reduced motion. Avoid animated full-page color transitions.

## Typography and layout

- Headings: `--serif`, Georgia with Times New Roman and serif fallbacks. Quiet editorial character; avoid decorative anime lettering.
- Body and UI: `--sans`, system sans-serif with Segoe UI and Arial fallbacks. No external font download is required.
- Code: `--mono`, SFMono-Regular, Consolas, Liberation Mono, monospace. Preserve whitespace and horizontal scrolling.

Use the shared font tokens, comfortable line lengths, generous spacing, and readable line height. Posts are the main content. The homepage welcome stays brief and the post list remains prominent. Article pages focus on the writing. Avoid dense panels, giant promotional heroes, and visual clutter. Check mobile widths, long code, tables, English, and Brazilian Portuguese.

## Artwork and motion

Arthur is the main character; Gon and Pitou are close supporting characters. Gon is black and white, Pitou gray and white, and Killua tri-color. Use their established likenesses and natural colors. Prometheus and OpenTelemetry recur when the content calls for them. Preserve official project logo colors and shapes; their colors belong to their marks and relevant diagrams, not the site's global UI. Do not imply an official endorsement.

Use the established 2D Pets-inspired art direction. No 3D characters. Keep artwork consistent in scale, rendering, and character identity. Retain assets for future use without forcing them into unrelated pages. Anime references are occasional contextual Easter eggs, not the identity's centerpiece. Avoid ornamental kanji or a full Japanese theme.

The homepage uses a simplified comfortable scene: Arthur seated on a small neutral rug with Gon and Pitou beside him. Target 1–2 seconds at 6 FPS, with small affectionate hand and ear movements. No chasing, fighting, surprise, or separation story. Each frame contains the whole scene; keep the camera, seated hips, character scale, and floor stable. Do not interpolate frames or independently move static character layers. A short forward-and-back cycle may reuse drawings, with provenance documented honestly. Use a calm together frame for reduced motion.

Review animation playback in the locally running website before committing an animation revision. Still-frame inspection and FPS metadata alone do not establish natural motion. Document the source drawing count and any interpolation honestly; do not describe repeated or interpolated frames as independently drawn frames. If playback cannot be reviewed, retain the result as an uncommitted draft and report the limitation unless Arthur explicitly requests a push for preview feedback.

Motion should feel playful and modest: short character interactions, gentle idle exercise/rest loops, or a useful explanation within a post. Respect `prefers-reduced-motion` and keep the static frame meaningful. Never distract from reading or require motion to understand content. Do not add a start/stop motion button, arbitrary scene controls, or decorative interactions without a purpose. New post animations are explicitly authored assets/components, not automatically generated by the site.

The Killua memorial is peaceful and still, with Arthur looking at Killua and a small, relaxed smile. Preserve the original article text. The playful Killua cat/character artwork belongs after the reading, rather than interrupting the story.

## Voice and channels

Write clearly, warmly, and directly. Technical depth and human personality can coexist. Avoid grandiose slogans, forced mentoring calls to action, and artificial anime language. Use one identity across the blog, newsletters, presentations, and social visuals, adapting density to the medium rather than inventing new palettes.

Keep existing posts and their URLs intact unless Arthur explicitly requests a text change. No Source/GitHub footer link is needed. Email drafts require Arthur's approval before sending; brand work does not authorize sending messages. Prefer free services and minimal data collection.

## Applying changes

1. Read these rules before visual or content-facing changes.
2. Reuse the shared tokens; update this document and both theme token sets together if Arthur approves a brand change.
3. Verify contrast, keyboard access, reduced motion, both themes, and both languages for the affected area.
4. Keep original posts untouched and run the repository checks. Use CI screenshots when available; do not browse the preview if Arthur asks to review it himself.

The approved direction draws on the supplied Shopify and Canva color guidance and Runway and Lovable brand consistency examples. Those sources inform practice; Arthur's approved choices and this document govern the brand.
