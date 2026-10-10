# Arthur training sprite

Created with built-in ImageGen from `design/source/arth-reference.png`, using the existing Arth ChatGPT pet as a character/style reference. This is website-specific artwork; no ChatGPT pet or v2 pet atlas was created or changed.

## Files and playback

- Generated source: `design/source/arth-training-generated.png` (2172 × 724 RGBA).
- Website sprite: `public/assets/cast/arth-training.png` (1152 × 208 RGBA).
- Six equal 192 × 208 cells, left to right: ready standing; lowering squat; deep squat; rising squat; hands-on-hips rest; watch glance.
- Suggested choreography: 0 → 1 → 2 → 3 → 0, repeat briefly, then 4 → 5 → 4 for a longer resting interval. Use discrete frame changes; smooth frame interpolation is not supplied.
- Baseline: y=202. One uniform scale factor across poses preserves squat height change. Characters centered per cell.

## Generation prompt

Create production animation sprite artwork for a personal website. Use attached image as exact character and 2D inked cartoon style reference: friendly adult Arthur with black beanie, moustache, arm/neck tattoos, white t-shirt, black trousers, black/white sneakers. Remove crossbody bag consistently. NOT 3D. A single horizontal row of SIX full-body separated poses, consistent drawing scale/head size and common shoe baseline, generous transparent gaps. Exactly six copies, left to right: 1 standing ready to do a bodyweight squat with feet planted shoulder width; 2 lowering half way, knees bending arms extending forward; 3 deep controlled squat hips down and arms forward; 4 rising half way; 5 standing relaxed resting hands at hips; 6 standing resting glancing down at a wristwatch. Same front three-quarter camera angle and facial identity across frames. Squat changes height naturally, do not enlarge squatting figures. Entire bodies fully visible. True transparent background, no backdrop no ground no shadows no labels no frame lines. Aim for each pose in its own equal-width cell in one long row, 6 columns, 1 row. Sharp attractive outlined Pets style, matches the attached character.

## QA

Inspected the generated source and final normalized strip visually. All six complete poses are separate, with consistent clothes, beanie, moustache, tattoos and shoes; crossbody bag removed throughout. The squat and watch glance read clearly at the final 192 × 208 cell size. Transparent alpha verified (range 0–255). Deterministic processing only cropped, uniformly resized, and placed the generated poses into equal cells; no character artwork was drawn programmatically. Minor frame-to-frame differences inherent in generated artwork remain, so discrete gentle animation is appropriate.

## Website delivery

Optimized WebP versions are served from `public/assets/cast/`. PNGs mentioned above describe the generation-stage masters in local `design/source/`; see `asset-manifest.md`.
