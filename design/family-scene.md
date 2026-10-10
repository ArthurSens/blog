# Arthur, Gon and Pitou — shared homepage scene

Created with built-in ImageGen, using `arth-wave.webp`, `gon.webp`, and `pitou.webp` as identity/style references. No ChatGPT Pet records were modified. The exercise/wave strips and individual cat assets remain available for future contextual uses.

Public asset: `public/assets/cast/arth-gon-pitou.webp`, a transparent 4-column × 3-row sheet normalized to 1536×1152 with Sharp and WebP encoding. Every frame contains the whole connected scene, including natural occlusion when cats run behind Arthur. `components/family-scene.tsx` crops one cell at a time without crossfades or transforms that would move the characters independently.

The loop holds a cozy frame for six seconds, plays two chase laps, shows Gon catching Pitou and a short playful tussle, Arthur's surprise and gentle separation, then holds the peaceful reunion before restarting. Reduced motion, an invisible stage, and a hidden document use the first calm frame and cancel the timer. No extra animation control is added. The illustration has a single localized accessible description; changing frames are not live-announced.

## Generation prompt

Use case: illustration-story. Create a production animation sprite sheet for Arthur's blog homepage, replacing his disconnected exercise animation with one connected playful scene of Arthur and his TWO cats. Reference1 is Arthur identity and established 2D Pets cartoon style (ignore sprite backdrop artifacts). Reference2 is Gon: short-haired black-and-white tuxedo, white nose blaze/bib/paws, yellow-green eyes, no collar. Reference3 is Pitou: fluffy GRAY-and-white cat, white bib/paws, yellow-green eyes, no collar. Arthur: tan skin, black beanie, short dark hair, moustache and short beard, earrings, arm and neck tattoos, white t-shirt, black trousers, black sneakers. Warm small relaxed smile. NO third cat. Lock their exact appearances throughout.
Deliver ONE transparent 2048x1536 PNG sheet in EXACT uniform 4 columns by 3 rows grid, twelve equal 512x512 cells. No gutters, no gridlines, no lettering, no numbers. Every cell same orthographic front three-quarter camera and scale. Keep each entire scene centered within its cell and within a safe inset of 35px, each scene bottom baseline y450 within cell. Arthur sits cross-legged in the center on a simple small oval neutral-gray cushion/rug, not standing and no gym equipment. Surrounding transparent. All three are interacting in one scene; cats run around Arthur, passing behind him and across his lap area. Crisp dark outlines, expressive compact 2D illustrated Pets style, no 3D. Natural cat colors, Arthur black-and-white clothes. Small gray cushion is only environment.
Read frames row-major left-to-right:
FRAME1: calm starting/ending pose, Arthur seated relaxed looking toward his two cats lounging close to his knees.
FRAME2: Gon starts chasing Pitou clockwise on Arthur's left, Pitou leading, bodies stretched in running poses; Arthur watches.
FRAME3: both cats sprint behind Arthur, parts naturally occluded by his body, Pitou on right ahead, Gon close behind.
FRAME4: Pitou runs down front-right side, Gon follows close, Arthur looks right.
FRAME5: cats run right-to-left across foreground in front of Arthur's crossed feet, Pitou ahead, Gon behind, fluffy tails up.
FRAME6: Gon catches up to Pitou front-left and pounces gently, Arthur notices.
FRAME7: cats in a small playful tussle at Arthur's feet, one on side with paws up, Gon leaning over; friendly comedic play, no injury.
FRAME8: cats roll and play-wrestle, Arthur eyebrows rise and eyes widen in a mild funny surprise, mouth small open, no shouting or symbols.
FRAME9: Arthur leans forward and reaches BOTH hands toward the cats to calmly interrupt them; cats look up.
FRAME10: Arthur gently separates them with one hand reassuring each cat, cats safely supported close to the ground; no grabbing tails/necks, no distress.
FRAME11: cats sit peacefully one on each side at Arthur's knees, Arthur strokes them both, relaxed smile.
FRAME12: same calm pose as FRAME1, cats lying near his knees, Arthur relaxed looking down, for a seamless loop.
Important: Each cell contains only one Arthur plus two cats, consistent body sizes and camera, no extra arms/legs, no text, no decorative UI, no magenta or brown background blocks, no drop-shadow boxes. Output genuine alpha transparency. This is a single coherent friendly chase/story loop, not a collage of unrelated poses.

## Inspection

Generated sheet: 1448×1086, matching the requested 4:3 sheet aspect ratio with twelve square cells. The identity, natural cat colors, interaction beats, and transparent background were inspected. The public version keeps the same aspect ratio and grid. The art is a compact frame animation, not a smooth video.
