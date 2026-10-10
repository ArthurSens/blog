# Full-scene family animation — preview draft

Replaces the rejected independent character cutout approach. Every drawing and every output frame contains Arthur, Gon, and Pitou together. Natural overlap is part of the drawing. The website displays a single animated image; it never moves character layers independently.

## Output and honest provenance

- Canvas: 300×260 with real transparency.
- Duration: 3.6 seconds; 108 output frames at 30 FPS (33/34 ms).
- Sources: 36 complete-scene slots, containing 35 distinct drawings. The final slot copies the complete opening scene to close the loop.
- In-betweens: 72 frames generated offline with RIFE v4.6 on CPU. These are interpolated frames, not separately drawn AI images.
- Artwork: built-in ImageGen; no paid service or Pets account modification.
- Main asset: `public/assets/cast/arth-gon-pitou-loop.webp`.
- Reduced-motion poster: `public/assets/cast/arth-gon-pitou-still.webp`.
- Registered source drawings: `public/assets/cast/family-full-keyframes.webp`.
- Playback export: `design/family-full-scene-review.mp4`.

The earlier FFmpeg motion-compensated interpolation was rejected during in-between inspection because it produced ghosted legs and tails. The source sheets were also inspected for adjacent-cell fragments and changing cat identity. Alpha-connected scene extraction removes unrelated fragments; the incorrect gray Gon drawing was corrected as a complete scene with ImageGen.

## Story and generation prompt set

Shared production prompt: complete-scene animation drawings in the established inked 2D Pets-inspired style. Arthur has tan skin, black beanie, moustache and short beard, earrings, arm/neck tattoos, white shirt, black sling bag, black trousers and shoes. Gon is the black-and-white tuxedo cat; Pitou is the fluffy gray-and-white cat. Exactly one person and two cats, on a small neutral gray rug. Every scene uses the same front three-quarter camera and character proportions. Lock Arthur's seated hips and crossed shoes, rug, and floor. Keep all tails, paws, elbows, and fingers inside each frame with generous transparent margins. No labels, grid lines, extra characters, magenta edge artifacts, or shadow glow. The cats and person interact within one complete drawing, including occlusion behind Arthur.

1. **Ready, four full scenes (2×2):** together at rest; Pitou perks up while Gon watches; Pitou stands and Gon crouches to follow; Pitou takes the first step and Gon leans forward to chase. Arthur watches calmly.
2. **Chase, sixteen full scenes (4×4):** Pitou leads, Gon follows about half a cat-length behind. Pitou's ordered positions: front center, front-left, left lower edge, left middle edge, left upper edge, back-left, behind Arthur left, behind center, behind right, back-right, right upper edge, right middle edge, right lower edge, front-right, front center, front-left as Gon catches up. Running uses changing extended, landing, gathered, pushing, and flying feline poses. Heads and body sizes remain consistent; intentional perspective on the floor is distinct from unwanted cutout bouncing.
3. **Play and separation, sixteen full scenes (4×4):** catch; crouch face-to-face; Gon touches Pitou's shoulder; Pitou swats back; paws meet; Gon leans over; Pitou rolls onto her side; gentle paw batting; Arthur's surprised eyes and raised hands; arms extend; hands lower; one reassuring hand on each cat; gently guide cats toward opposite knees without lifting them; sit apart; strokes and relaxed expression; return to the original peaceful pose.
4. **Targeted chase edit:** retain the running anatomy and complete scene, recolor the trailing cat behind Arthur as black-and-white Gon, keep gray-and-white Pitou in front, remove a stray third-cat fragment at the left edge, and preserve camera, rug, and Arthur's pose.

## Reproduction

`normalize-full-scenes.cjs` takes the ready, chase, and interaction sheets plus the corrected chase scene. It isolates the alpha-connected complete scene and registers its beanie center/top and rug floor with one affine transform. It does not extract or move individual characters. Sources are retained as the registered lossless WebP atlas.

`render-full-family-loop.cjs` requires `FAMILY_RIFE_BIN` and `FAMILY_RIFE_MODEL` pointing to the local [rife-ncnn-vulkan](https://github.com/nihui/rife-ncnn-vulkan) executable and `rife-v4.6` model. It packs premultiplied RGB and alpha onto a 640×288 inference canvas, generates whole-scene in-betweens at one-third and two-thirds of each interval, restores RGBA, and renders every output frame individually. The 32-pixel-aligned inference dimensions are required by the CPU path. The website has no dependency on this offline executable.

## Review status

The complete source sequence and consecutive in-between frames were inspected, including running, occlusion, surprise, and separation. The MP4 has 108 frames at 30/1 FPS and 3.6 seconds. A production build and local HTTP server succeeded.

Browser playback review remains pending. The cloud browser could not reach the local server; the workspace browser could not launch. Do not claim that the loop was watched in the website. Arthur explicitly requested a push on October 10, 2026 to review the Vercel preview and give feedback. The animation remains a draft for that review.
