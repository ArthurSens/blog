# Cozy family loop

Arthur relaxes on a small neutral rug, gently petting Gon while Pitou rests beside him. No chasing, fighting, surprise, or separation story.

- Canvas: 300×260, transparent.
- Timing: 1,667 ms at 6 FPS, ten frames with 166/167 ms delays.
- Six complete-scene drawings generated with built-in ImageGen, using the established Arthur/Gon/Pitou reference. A targeted edit removes the aura outside the rug.
- Sequence: 0, 1, 2, 3, 4, 5, 4, 3, 2, 1. Reused drawings are deliberate; no interpolation or independent character transforms.
- Source: `public/assets/cast/family-cozy-source.webp`, a regular 3×2 sheet. Each equal cell is resized onto the same fixed canvas; no per-frame bounding-box crop.
- Output: `arth-gon-pitou-loop.webp` and `arth-gon-pitou-still.webp` in the same directory.
- Reproduce with `node scripts/design/render-cozy-family.cjs`.

Prompt: six chronological complete-scene poses in a regular 3×2 transparent sheet. Arthur seated cross-legged, Gon black-and-white at his left knee, Pitou gray-and-white curled at his right. Small incremental petting and ear movements, fixed camera/scale/floor, no chase or fight, no extra characters, no labels. Preserve established 2D appearance. Targeted edit: remove background aura and keep the three characters and rug opaque with transparent surroundings.

Validation: source drawings and light-background still inspected; production build, TypeScript, diff checks, and animation timing/canvas test pass. Local browser playback could not be reviewed: the workspace Chromium executable crashes, and the cloud browser cannot reach localhost. Arthur previously authorized pushing to the draft PR for preview feedback; do not report this as a completed playback review.

The rejected 30 FPS chase MP4, atlas, metadata and specific rendering scripts are removed from the current branch. Earlier commits remain in Git history.
