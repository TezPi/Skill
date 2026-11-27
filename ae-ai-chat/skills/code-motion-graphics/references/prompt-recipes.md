# Prompt recipes

The viral prompts converged on one format. Write every brief into it before coding, and hand it to the user when they ask for "the prompt".

## Anatomy

```
<inputs>     What to ask for (brand name, logo, palette, 8-12 states, song ~120 BPM, real UI/photos) + defaults if skipped.
<direction>  One paragraph of taste: format (WxH, fps, length, loop?), canvas/ink/accent hex, fonts by role,
             the ONE formal idea, motion rules in numbers, and a Banned: list.
<structure>  BPM, bars, beats. A timeline in beats or seconds: state -> state -> state. Last frame = first frame?
<build>      Numbered engineering rules: one HTML file, seek(t) pure, closed-form springs (sum per change),
             how each signature effect is built, audio analysis + SFX on measured peaks, render (Playwright,
             N sub-frames, ffmpeg tmix), loudness, stills-first pass.
<gotchas>    The specific traps for this piece (overlapping swaps, loop seam, counters on sub-frames...).
<start>      What to show before the full render (state list on the beat grid, N stills, storyboard table).
```

Rules that made prompts work:
- **Numbers, not adjectives.** Hex codes, seconds, damping ratios, pixel sizes, BPM, "fills 50 % of the frame", "cursor speed < 65 px/frame".
- **One formal idea** in one line ("one pencil line gets promoted three times and never leaves the screen").
- **Locked copy** in exact order when words matter; "no extra slogans".
- **A Banned list** and a **quality gate** ("reject your own result if it feels like a SaaS template").
- **Stills before render**, then "critique like a harsh motion director, fix the 3 worst".
- Effort split for big jobs: plan/judge at high effort, build each piece at medium; only egregious cues go back for a fix (no blanket redo loops).

## Recipe 1 - UI morph loop (the most-copied viral prompt)

```
<inputs>
Ask me for: 8-12 UI states the shape becomes (button, loader, player, slider, toggle, tabs, chart,
command palette, toast), pure black/white or one accent, and a royalty-free song ~120 BPM.
</inputs>
<direction>
Dribbble-level UI motion. One shape, never cut: every state is the same element morphing size, radius
and colour while its content swaps with a short blur. A cursor drives every change with real clicks and
drags. Warm-gray canvas, black/white components, one UI font (Geist). Springs everywhere, tiny overshoot
at most. The camera zooms so each state fills the frame. Last frame = first frame.
Banned: bouncy easing, particles, glows, gradients on UI chrome, mismatched icon strokes, dead time,
anything that looks like a template.
</direction>
<structure>
120 BPM, 7 bars (28 beats, 14 s), something on every beat.
button -> loader -> check -> dynamic island -> player (play/pause morph) -> scrub -> volume slider that
stretches past max -> toggle flips on the beat -> knob becomes liquid tab indicator -> tabs open a chart
that draws itself + hover tooltip -> collapses to Cmd-K -> type to filter -> enter -> toast -> button.
</structure>
<build>
1. One HTML file, 1440x1440. Every style computed inside seek(t). No CSS transitions, timers, carried state.
2. Closed-form spring step responses; a value with many targets is a sum of springs.
3. Tab indicator and toggle knob: the two edges ride different springs so the leading edge stretches ahead.
4. Drags are direct manipulation; on release, spring back from the release position and velocity.
5. numpy beat grid, start on a downbeat; every UI sound on its measured peak.
6. Playwright, 4 sub-frames per frame, ffmpeg tmix -> 60 fps.
7. One frame per beat first; fix anything off-grid, cramped or unreadable.
</build>
<gotchas>
No will-change on anything the camera scales. Swapped text needs its own enter/exit timing. Match the last
frame to the first, cursor position and speed included.
</gotchas>
<start>Ask for the inputs, then show the state list on the beat grid before writing code.</start>
```
Variants that also went viral: "analyze <site> and build the promo from our own UI, not generic components"; product story told as states (connect account -> research -> approve -> budget slider -> autopilot toggle -> ROAS chart -> Cmd-K "pause" -> toast "Paused 3 losing ads"); parameterised version with shape damping 0.72 / settle 0.35 s, camera damping 1.0 / settle 0.6 s, 12 px blur swaps over 0.15 s.

## Recipe 2 - Premium product launch film (15 s)

```
Role: senior motion designer, product designer and <host> engineer for <BRAND>.
Goal: a <=15 s brand/product film that makes <BRAND> look mature and expensive. NOT a feature walkthrough,
NOT a SaaS template. Desired reaction: "Wait, this is <unexpected category>?"
Source of truth: inspect <repo/site/tokens/DESIGN.md/screenshots> first. Use the real wordmark; do not redraw it.
Do not invent functionality or metrics; use demo-safe values.
Visual language: <bg hex>, <surface hexes>, <accent hex> as a precious accent not a flood, <text hexes>;
<UI font>, <mono for numbers>. Think: <4 material words>. NOT: <4 anti-words>.
Rules: one shot = one idea; room to breathe; product UI is the hero; object-driven transitions; premium easing
(cubic-bezier(0.16,1,0.3,1)), overlap, overshoot < 2 %; depth sparingly; no particle spam, fake glass,
excessive blur, spinning cards, constant zoom, bouncing UI, marketing paragraphs.
Format: 1920x1080, 60 fps, H.264, 14-15 s; works without sound; optional recomposed 9:16 (not a crop).
Arc: CHAOS -> CONTROL -> CLARITY -> BRAND. ~4 visual ideas. First meaningful product moment by 2 s.
Storyboard (starting point, not template):
 0.0-1.2  dark; a tiny accent glint reveals a fragment of the mark; UI begins to emerge from it.
 1.2-4.4  hero surface rebuilt in layers (not a screenshot): hero number resolves, chart draws, metrics settle late. <=4 words.
 4.4-7.5  an object from the previous shot becomes the next (chart point -> document corner); magnetic snap.
 7.5-10.7 one strong state change (status flips, payment resolves); tactile mono numbers.
10.7-12.8 calmer: noisy signals collapse into one structured overview; rhythm slows.
12.8-15.0 camera pulls out, UI folds into one object, darkness returns, wordmark + one short line; still final frame.
Sound: 115-120 BPM; low soft impact on reveal, restrained clicks, glass tick, resolved tone at logo. No trailer
booms, EDM risers, whoosh spam. No copyrighted music: if none is safe, deliver a cue sheet.
Implementation: new composition beside existing ones; reusable primitives (camera surface, product frame,
masked transition, text reveal, region reveal, ambient light, shared element). Deterministic, frame-driven.
Do not stop after the first implementation: render frames at 0, 1, 2.5, 4.5, 6.5, 8.5, 10.5, 12.5, 14, 14.8 s,
LOOK at them, fix, render the film, inspect decoded MP4 frames, iterate.
Deliver: storyboard, source, MP4, poster frame, contact sheet, runtime, assets used, motion-language note,
compromises, re-render command.
```

## Recipe 3 - Loud launch trailer (poster style, beat-driven)

Skeleton: square 1440, 60 fps, ~25 s, palette of 5 hex, condensed 900 display + mono labels, op-art/sunburst or wave patterns, film grain, real media playing inside the design, die-cut stickers. Motion rules: camera never stops (slow 1.03-1.07 push per scene), letters rise through a mask line one by one, nothing snaps to the beat (patterns rotate continuously), swaps are 0.55 s carousel glides, colour changes 0.35 s floods. Structure written in beats around the song's drop (song starts 8 beats before drop). Build: one canvas, beat map in beats (`B = 60/BPM`), 3D box via orthographic face canvases, video as JPEG sequences drawn by `floor(t*30)`, stickers die-cut by dilating alpha, SFX per event on measured peaks, -14 LUFS, 8 sub-frames for whips, scan for single-frame pops.

## Recipe 4 - Kinetic spoken-word / manifesto film

```
Create a <20.00> s kinetic film titled "<TITLE>". One self-contained HTML file, 1080x1080, 60 fps, SVG/Canvas, embedded assets.
Art direction: bg <hex>, letterforms <hex>, structural accent <hex>. High-contrast serif for the speech, heavy
grotesque for load-bearing words, restrained mono for small marks. No clichés (<list>).
LOCKED TEXT, exact words, exact order: "<line 1>" "<line 2>" ... Do not attribute to real people. No extra slogans.
CENTRAL RULE: words have roles (<WORD> is a lintel / a load / a support / an opening / a platform). Roles emerge
from the actual glyph paths, not illustrations behind the text.
Storyboard per line with seconds. One moment of perfect alignment, earned. Hold the full declaration 2 s.
Last 2 s: under full occlusion reset hidden elements; render(0) = render(20).
Choreography: follow phrases and pauses, not a dance beat; reveal in reading order; one >= 400 ms stillness;
critically damped settles; elastic deformation only where named.
Type: real glyph paths (opentype.js) for structural words; keep counters and legibility while deforming; between
unrelated words use occlusion or matched edges, never arbitrary path interpolation; a phrase is readable before it becomes architecture.
Engineering: window.seek(t) deterministic; fixed-step n/60 for 1200 frames. Audio optional, off by default.
Quality gate: 8 representative frames; reading order correct; no line destroyed before it can be read.
```
Variant: a mathematical proof as a mechanism ("every mechanical action corresponds to an operation in the proof"; locked copy; exact worked example; do not overclaim).

## Recipe 5 - Explainer (science / product / repo)

```
Make a <60> s explainer about <TOPIC>, 1920x1080, 60 fps, end to end, autonomously; tell me your decisions at the end.
Style: <storybook / paper + typewriter tape / halftone manga / colored pencil>. Professional studio, not "AI video".
Pure code-rendered frames: crisp, precise, one design system, one strong formal idea per scene.
Accuracy: simulate the real thing where possible (an actual random walk, not a drawing of one); real numbers with
honest uncertainty; cite primary sources; no invented facts.
Attention: hook with a curiosity gap in the first 2 s; visual gags, callbacks, one simple original character.
Deliver: VO script (best TTS available) + burned-in captions, original score that changes per scene, SFX synced to
every on-screen event, mix with music ducked under voice, mastered to streaming loudness, source code.
Verification: stills of every scene reviewed critically, transitions checked frame by frame, audio mix measured numerically.
```
Podcast/long-form insert variant: find 35-50 moments where a graphic fills talking-head time (>= 2 per chapter), write a style bible + component kit first so every insert looks like the same show, copy verbatim from what is said, sync beats to words, keep each graphic inside one uncut stretch of audio, PiP speaker bottom-right during full-screen graphics.

## Recipe 6 - Illustrated story / music video (papery, hand-drawn)

```
Make a music video for <song> using the entire recording (do not remix, speed up or shorten).
Measure duration, sections and beats locally; store them in one shared timeline that drives animation.
Lyrics: supplied lyrics are authoritative; never invent lyrics. Animate them where they strengthen the scene,
varying between subtitle-size and huge, with the background calmer where lyrics are big; big type for the hook.
Style: handmade, papery, illustrated; recurring motifs; characters designed for this song. Not a slideshow,
not a generic visualizer, not one loop repeated.
Write STORYBOARD.md (timed scenes for the whole song) and CLAUDE.md (brief + re-render instructions).
Test representative frames and a short section first; use cheap code-drawn textures if watercolor is too slow.
```
Paper-ink system that worked: grid on cream at 13 %/26 %, pencil lines resampled and wobbled by slow sines whose phase changes 8x/s, stroked twice (full width 90 %, half width 40 %), paper tooth knocked out, multiplied onto paper; fills as hatching drawn one line at a time.

## Recipe 7 - Interactive 3D model (explode view)

```
Build me a <OBJECT> in interactive 3D, one HTML file with Three.js. Make it look real: <outer parts>, and inside
it the parts you never get to see: <inner parts>. <Cutaway / live behaviour: blades open, valves beat, light bends>.
Drag to orbit, scroll to zoom. Explode button: every part slides apart along the axis with a name label; press
again to snap back. Hover a part: it lights up and shows one line on what it does. No images. Do not ask questions.
```
To make it a video: scripted camera path as a function of t, render offline per frame (not screen-recorded).

## Director notes that reliably improved second passes

"Less like a PowerPoint." "Use components, not a recording." "Some parts too fast, some too slow: only the key hits on the beat." "Make it readable." "Half the speed you'd default to: 1.5-3 s camera moves on gentle ease-in-out." "Arrive fast, land soft (cover 12-19 % of the remaining distance per frame)." "Nothing ever freezes: slow push on every hold." "Break screenshots into components so they can animate." "If <hero object> isn't the most memorable thing in the film, start over."
