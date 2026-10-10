# Fixed-stage family loop

Historical study. Arthur rejected this animation. The replacement full-scene draft and current review status are documented in `family-full-scene.md`; statements below describe the earlier implementation.

This supersedes the original twelve-pose atlas in `family-scene.md`. That atlas had drawings extending beyond nominal cells and inconsistent framing. It is retained for provenance, but is not served by the homepage.

The homepage now uses `arth-gon-pitou-loop.webp`: 300×260, transparent, 2.5 seconds, with movement sampled at 24 FPS. `arth-gon-pitou-still.webp` is the matching calm poster. WebP coalesces identical resting frames; moving frames retain 41/42ms timing, with total delays exactly 2500ms. The browser decodes the animation natively instead of React advancing twelve poses with timers. Reduced motion, off-screen visibility, and hidden tabs select the still image.

Arthur's seated body has the same pixel position and size throughout. A separately anchored surprised face is used during the scuffle. Gon and Pitou follow continuous ellipse paths with depth ordering behind/in front of Arthur, converge for a small playful tumble, and separate toward his open hands. The compact loop has a short start/end pause; it does not repeat the previous long rests or two-lap timing. This is a 2D cutout animation, not generative video.

## Extraction and rendering

New cutouts were created with built-in ImageGen using the established Arthur, Gon, and Pitou assets as references. No Pets records were changed and no paid service was used.

`scripts/design/extract-family-rig.cjs` locates six alpha-connected characters, including portions outside nominal atlas cells. It extracts complete bounds with padding. Complementary cat gaits use the same scale and nose landmark on a fixed 240×200 canvas, so tucked paws cannot change character scale or bounce their heads. The calibration and resulting bounds are recorded in `family-rig-layout.json`.

`scripts/design/render-family-loop.cjs` draws sixty sampled frames on one 300×260 transparent canvas and encodes the loop and poster. It also creates an ignored contact sheet for alignment inspection. The characters keep their natural colors; the website draws a neutral rug behind the transparent animation through its theme tokens.

Optimized source cutouts are committed as `arth-seated.webp`, `arth-surprised.webp`, `gon-run-0.webp`, `gon-run-1.webp`, `pitou-run-0.webp`, and `pitou-run-1.webp` under `public/assets/cast/`. Old exercise, wave, and pose-atlas assets remain available for future contextual use. Re-run extraction only with the same atlas or recalibrate the nose landmarks for a new one.

## Final generation prompt

Use case illustration-story. Production animation CUTOUT ASSET atlas, NOT a complete-frame animation. We will animate these fixed cutouts computationally to avoid shifting identities/scale/camera. Match the established reference 2D outlined Pets illustration style precisely, no 3D. Arthur identity from image1: tan man, black beanie, moustache and short beard, small earrings, neck/arm tattoos, white tee, black trousers and sneakers. Gon from image2 black-white tuxedo, white face blaze/chest/paws, no collar. Pitou from image3 fluffy gray-white cat, white bib/paws, no collar. Keep natural colors. Transparent surrounding every individual cutout.
Layout EXACTLY 3 columns × 2 rows, 6 equal square cells, with wide fully transparent gutters between isolated assets so each can be extracted cleanly. NO captions/text/lines/background. Requested canvas 1536x1024. Each individual safely inset inside own cell. Each cell contains ONE character, NOT a scene or two characters.
Cell1 top-left: Arthur FULL BODY seated cross-legged, leaning slightly forward, calm small smile watching his cats below, both hands relaxed open reaching gently beside his knees, palms down, elbows out. This is ONE fixed puppet pose that will remain constant through the loop; expressive friendly face and clear visible hands near knees. All of head, arms, knees, sneakers complete. No rug/cushion/ground underneath him. No cats. Body front three-quarter view.
Cell2 top-middle: Gon running toward LEFT in a low energetic bounding pose, side profile, all four paws visible, front and back legs extended opposite, tail up. Body horizontal. Cat only.
Cell3 top-right: SAME Gon running toward LEFT, same head/body/tail size and position as cell2, but paws tucked in the complementary running gait. Cat only.
Cell4 bottom-left: Pitou running toward LEFT in a low energetic bounding pose, fluffy tail up, legs extended, matching Gon general scale, consistent anatomy. Cat only.
Cell5 bottom-middle: SAME Pitou running toward LEFT, same head/body/tail size and position as cell4, but paws tucked in the complementary running gait. Cat only.
Cell6 bottom-right: Arthur HEAD ONLY looking slightly down, mildly comically surprised with raised eyebrows and small open mouth, black beanie and neck top. No torso. This head's face/beanie silhouette must match cell1's calm head size/angle exactly, except expression; it will be swapped over that fixed head. Isolated head with transparency.
No extra cats, no scenery, no rug, no floor shadow, no collars, no extra limbs, no angry/hurt cats. The purpose is a smoothly rigged 2.5-second 24-fps connected animation, not slideshow redraws. Strong natural outlines, no magical red effects.
