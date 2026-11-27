# Genre playbooks

Each playbook: format, structure, signature moves, traps. Pick one; mixing two genres is fine, mixing four is a template.

## UI morph loop

- **Format:** 1440x1440, 60 fps, 14 s (120 BPM x 7 bars = 28 beats), seamless loop.
- **Structure:** 8-12 states, one per 2-4 beats; every beat has an event (click, type, snap, draw-on).
- **Signature moves:** one rounded rect whose width/height/radius/position/colour are each a spring chain; cursor drives everything and aims where the target *will be* when it lands; liquid tab indicator (two edges, two springs); slider that rubber-bands past max; play/pause morph; chart draws itself + hover tooltip; Cmd-K palette typing derived from time (`chars = floor(p * len)`, caret blinks only when idle); toast whose check becomes the next button.
- **Traps:** text overlapping during morphs; cursor jump at wrap (use `t - D*floor(t/D)` and match velocity); cursor faster than ~65 px/frame; fading black into the accent (move an accent element between states instead).

## Product launch film

- **Format:** 16:9 1920x1080 master (+ recomposed 9:16, not cropped), 60 fps, 15-30 s.
- **Structure (30 s):** why the market matters -> why it hurts today -> how the product fixes it -> what you get -> animated logo + tagline + URL. 4-5 scenes, one short title each. For 15 s: ~4 visual ideas, chaos -> control -> clarity -> brand.
- **Signature moves:** real UI rebuilt in layers so regions animate (never a giant screenshot sliding); hero number resolves crisply; chart draws in, supporting metrics settle late; shared-element transitions; camera "macro product shoot" (soft parallax, rim light, specular pass); one accent colour treated as precious; logo traced to SVG so it can animate.
- **Traps:** feature list energy; invented metrics; marketing paragraphs; every frame busy; logo intro > 1.5 s; copyrighted music.

## Showreel ("show what a motion designer you are")

- **Format:** 15-30 s, 60 fps, cut to 120-128 BPM; each section one bar.
- **Structure:** 0-2 s hook that grabs in 0.5 s; 2-10 s a new technique every 1.5-2 s; 10-13 s densest climax; 13-15 s name/wordmark lands cleanly; optional loop.
- **Technique menu (use >= 6):** per-letter type entrances and reassembly; shape morph (circle -> square -> hex); mask transitions; depth (parallax, 3D rotation); particle gather/scatter (deterministic); counters and draw-on lines; tiling; 2D -> 3D (hex reads as a cube); unfold into a UI; data that reflects the film itself (one bar per second, real frame count).
- **Formal-idea examples that worked:** one line promoted three times (graphite on paper -> wire on blueprint -> light on black), each stage's accent = next stage's colour, scene changes by a hard-edged flood or a single scan line; a single orange circle with motion blur is the through-line and the cut; every frame is code, the closing line says so and a ball lands as its period.
- **Traps:** 20 different animation styles with no system; glow and particle crutches; corner HUD numbers that mean nothing.

## Kinetic type film (manifesto, spoken word, lyric, poster bumper)

- **Format:** 1080x1080 or 1080x1350, 60 fps, 15-20 s, often a loop.
- **Structure:** one locked line per beat group; layout pressure changes with meaning; one earned moment of alignment; hold the full statement 1.5-2 s.
- **Signature moves:** mask line rises; words with structural roles built from real glyph paths; destination revealed through the outgoing word's outline; rails/clips that resize to fit each word; per-glyph springs (y, opacity, blur) staggered on 1/16 notes; print misregistration (+-2-4 px magenta/green at 40 %) on accent frames only; three type roles (scream display, urban grotesque, mono crumbs <= 18 chars).
- **Traps:** every word bouncing independently; distressed-poster clichés; destroying a line before it can be read; interpolating arbitrary path points between unrelated words.

## Explainer (science, history, product, codebase, podcast inserts)

- **Format:** 16:9 or 4:5 for LinkedIn/X; 25 s-3 min; VO optional, captions mandatory if VO.
- **Structure:** curiosity hook -> one core question -> 3 ideas max (25-60 s) -> payoff/callback. For a repo: what/why -> map of the code -> life of a request -> core abstractions -> real trace.
- **Signature moves:** simulate the real phenomenon (random walk, ray paths, actual block data); a continuous zoom across scales with a live ruler (metre -> nanometre); timeline of "what was happening on Earth meanwhile"; a style bible + component kit before building many inserts; one simple original character for gags and callbacks; live counters with units.
- **Traps:** decorative imitation that makes the topic look easier than it is; secondary sources; numbers without uncertainty; tiny unreadable code.

## Illustrated story / music video / character short

- **Format:** song length (never shortened), 30 fps is fine; 2.39:1 or 16:9 for cinematic.
- **Structure:** opening hook with big lyric type; recurring motifs; slow section mid-way; ending that returns or resolves.
- **Signature moves:** paper/pencil/crayon/tissue/sand/sumi-e rendered in code (wobbly resampled strokes, paper tooth, hatching); pose parameters animated smoothly then held "on twos" (12 fps feel) for hand-made texture; characters built procedurally with parameterised poses; lyrics alternate subtitle-size and giant with a calmer background behind giant type; music analysed into sections that drive effect intensity (intro 40 %, verse 70 %, chorus 100 %).
- **Traps:** jittery mouths faking lip-sync (give expressions instead); unnatural limbs; invented lyrics; expensive textures that make render impractical (use cheap code-drawn grain).

## 3D scene (object film, world fly-through, interactive model)

- **Format:** Three.js/WebGPU or raw WebGL2 in one HTML file; for video, scripted camera as a function of t and offline per-frame render.
- **Structure:** one continuous camera move with 4-5 stops (e.g. desk -> case -> chip -> die -> transistor -> atom; Earth 2026 -> Moon base -> Mars); or object hero with explode/cutaway.
- **Signature moves:** MeshPhysicalMaterial (clearcoat 1, roughness ~0.4), ACES filmic, cool + warm rim spots, room env map; procedural geometry (no assets); labels on explode; live technical drawings as orthographic renders; real planet maps; self-critique loop where a vision pass reviews renders "like a VFX supervisor".
- **Traps:** random particle explosions; screen-recorded output; WebGL not rendering headless (use swiftshader); camera paths that reset abruptly between stops.

## Pixel / sprite loop

- **Format:** logical 128x96 (or similar) canvas blitted at integer scale, `imageSmoothingEnabled=false`, ~24-colour fixed palette.
- **Moves:** procedural character from rects; pose parameters eased then quantised to 8-12 fps; state machine IDLE -> CHARGE -> CAST -> RECOVER; pooled deterministic particles stepping palette indices; 1 px rim light.
- **Traps:** sub-pixel positions, gradients, shadowBlur; vector shapes scaled down instead of real pixel art.

## Footage-to-particles / stylised remix

- **Pipeline:** pick footage with a full-body subject, clean background, clear action moments -> per frame extract colour, depth (Depth Anything), subject mask, and shot cuts, stabilised per shot -> choose a particle (dot, square, glyph, line) and 4-6 styles from three rules (where: whole frame / subject only; size: uniform / by luminance / by depth; colour: source / 1-2 inks) + flat vs depth-extruded -> beat grid where one cell is an integer number of frames -> a schedule table (style, palette, camera per cell) kept separate -> hit feedback tiers: light every hit (particles deform, camera nudge), medium on bigger hits (part of the particles fly toward camera), heavy 1-2 times (time freeze + orbit).
- **Rules:** show the original first so viewers understand the transformation; alternate fast and slow; adjacent cells contrast hard; end by resolving (particles grow into blocks or return to the source); weak and short reactions only; fix all randomness; render 5-6 density options side by side to choose.
