# Writing stories with prose and React

Use `_posts/<slug>.md` for ordinary prose. Use `.mdx` when an article needs React
components inside its narrative. Keep the same YAML frontmatter (`lang`,
`translationKey`, title, date, excerpt, cover, author, ogImage). Converting an
existing post changes its extension, not its slug or URL. A slug cannot have both
formats. Translations may use different formats and share a translationKey.

MDX is trusted, author-owned source compiled by `@next/mdx` at build time. It is not
fetched or evaluated from a string in the reader's browser. Component imports are
ordinary relative imports, so each post can own a different visual language and
animation technique. There is no universal requirement to use a scroll story.

```mdx
import { CreatedTimestampsStory } from '../components/stories/created-timestamps-story'
import { StoryStep } from '../components/stories/scroll-story'
import { CounterExperiment } from '../components/stories/counter-experiment'

Your introduction goes here.

<CreatedTimestampsStory>

<StoryStep value={0}>

The beginning of the story, written in Markdown.

</StoryStep>

<StoryStep value={10}>

The next observation.

</StoryStep>

</CreatedTimestampsStory>

<CounterExperiment />
```

Keep blank lines around Markdown inside JSX blocks. HTML becomes JSX: use
`className`, close every tag, and escape literal braces when necessary.

## Adding a new visual

Import a custom React component directly in the post. For a scroll explanation,
`ScrollStory` accepts a `renderScene(value)` function and labeled `StoryStep`
values. It interpolates between step values at a viewport anchor, in either scroll
direction. The article defines what those values mean: seconds, a diagram stage,
or any numeric parameter. See `CreatedTimestampsStory` for a small wrapper example.

Native scrolling is never intercepted. The scene is sticky beside the prose on
wide screens. Mobile and reduced-motion readers get a static scene at each step.
Rendering is event driven, throttled to animation frames, and paused when the story
is offscreen or the tab hidden. There is no independent animation clock.

Keep the writing sufficient to understand the explanation without motion. Supply
SVG labels, useful captions and keyboard-operable controls. Reuse semantic tokens,
check both themes, and keep data simulation assumptions explicit. The counter
experiment displays sample-to-sample change; it does **not** implement PromQL's
rate/increase algorithms. Its dataset is illustrative, not collected telemetry.

## Local preview and validation

`npm run dev` and `npm run build` generate a registry of literal dynamic imports
for every `.mdx` file. These preserve static rendering and split each MDX article
into its own chunk. Restart development after adding or renaming an MDX file;
edits to existing files support hot reload. Do not edit
`lib/mdx-posts.generated.ts` by hand. `npm run typecheck` also refreshes it.

Feeds and newsletter drafts discover both extensions. The newsletter command only
writes review files; it does not send mail.

Before review, run build, typecheck and `npm run test:i18n`. The authoring tests
exercise scroll reversibility, mobile/reduced-motion scenes, browser errors,
keyboard-controlled experiments and Markdown/MDX URL/feed compatibility. Review
actual scroll playback in the running site as well as the captured stills. Keep
changes in a draft PR for Arthur's visual feedback.
