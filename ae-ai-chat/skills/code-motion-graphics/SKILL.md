---
name: code-motion-graphics
description: "Code-native motion graphics: launch films, UI morph reels, kinetic type, explainers, music videos and 3D scenes where every frame is code (HTML/Canvas/SVG/GSAP/Three.js to Playwright to ffmpeg). Use when the user asks for a motion graphics video, product launch / promo film, showreel, animated explainer, 'video made in code', a viral Opus-style motion video, or wants a brief turned into a production prompt. Distilled from 703 viral code-rendered videos. Load senior-editor (Layer 0) then sfc-super-motion-v1 first (Rule of Six editorial, Shape & Motion Graph tokens, Motion Text blueprints)."
---

# Code Motion Graphics

The method behind the viral code-rendered videos: **every frame is a pure function of time.** One HTML file draws frame `t` inside `seek(t)`; a headless browser shoots it frame by frame with sub-frame motion blur; ffmpeg encodes. Because any frame renders identically in any order, a fix is a small edit plus a re-render, loops close perfectly, and the agent can inspect its own output.

Use this skill for craft, direction and the raw pipeline. If the user names a host, also load it: HyperFrames -> `code-hyperframes`, Remotion -> `code-remotion`, Motion Canvas -> `code-motion-canvas`. Their engines change; the laws below do not. Inside the scene, drive libraries seek-safely: GSAP -> `anim-gsap`, anime.js -> `anim-animejs`, Lottie -> `anim-lottie`, Rive -> `anim-rive`, Three.js/R3F -> `three-3d-stack`; finish and deliver with `media-ffmpeg` (alpha handoff, platform encodes, loudness). Pull brand motion tokens from `brand-animation-graphics` when a brand or DESIGN.md is involved, and type rules from `type-kinetic-fx` when type leads.

## Bundled files

| File | Use |
|---|---|
| `assets/template.html` | Working seek(t) starter: closed-form springs, spring chains, beat grid, bezier, seeded hash, flood transitions, cursor that loops seamlessly. Copy, then replace SCENE. |
| `assets/render.mjs` | `node render.mjs comp.html out.mp4 --sub 4 [--audio a.wav]` and `node render.mjs comp.html stills/` (one still per beat). |
| `assets/check.py` | QA gate: single-frame pops, dead holds, loop seam, contact sheet. `python3 check.py out.mp4 --loop --sheet sheet.png` |
| `references/prompt-recipes.md` | The viral spec format + 7 fill-in recipes. Read when writing the spec or when the user wants a prompt. |
| `references/genre-playbooks.md` | Structure, timing and signature moves per genre. Read the matching section before storyboarding. |
| `references/techniques.md` | Implementation snippets for signature effects (liquid tab, goo, iris, glass, glyph paths, pencil ink, halftone, film finish, synth audio). |

Setup in the project: `npm i playwright` (or reuse a global install; `PW_CHROMIUM` env overrides the browser path), ffmpeg on PATH, `pip install numpy` for analysis.

## Workflow (gated; do not skip gates)

1. **Spec.** Rewrite the request in the spec format (`<inputs> <direction> <structure> <build> <gotchas> <start>`, see recipes). Fill defaults instead of asking when the user is away; ask only for assets you cannot invent (logo, product UI, licensed song).
2. **Source of truth.** Read the real product, site, repo, brand tokens or DESIGN.md before designing. Never invent screens, features, metrics, customers or quotes. Demo data must be clearly synthetic.
3. **Beat map + state table.** Pick BPM (120 default: beat 0.5 s, bar 2 s). Write a table of states in beats: time, what changes, transition device, copy, SFX. All timing lives in this table so retiming is one edit.
4. **Stills first.** Render one still per beat (or 5-8 key stills). Critique them like a harsh motion director: cramped, unreadable, template-looking, disconnected, off-grid. Fix the 3 worst. Show the user the stills when they are present.
5. **Full render** with 4 sub-frames (8 for fast whips), 60 fps unless the brief says otherwise.
6. **QA gate.** Run `check.py` and open the contact sheet. Inspect decoded frames from the final MP4, not browser screenshots. Fix and re-render the affected range (`--from/--to`).
7. **Deliver:** MP4, editable source, storyboard table, poster/final frame, contact sheet, exact runtime, re-render command, list of real assets used, remaining compromises.

## Engine laws

- `window.seek(t)` computes every transform, opacity, mask, colour and UI state from `t`. No CSS transitions/animations, `setTimeout`, `setInterval`, rAF-accumulated state, live physics, or `Math.random` (use a seeded hash of id + time).
- Springs are closed-form step responses. A value that changes target many times = sum of one spring per change (`chain()` in the template). Critically damped `1-(1+wt)e^(-wt)`, w 12-40, for settles that never pass the target.
- Expose `window.W/H/FPS/DURATION/BPM`; support `?t=` to freeze any moment.
- Loops: `render(0) == render(D)`, cursor position **and velocity** included. Define looping motions on a wrapped clock; export `[0, D)` without the endpoint frame.
- Embed fonts (base64 `@font-face`) and assets; await `document.fonts.ready`. Vietnamese copy needs a font with full Vietnamese glyphs (Be Vietnam Pro, Inter, Montserrat, Noto Sans) and display line-height >= 1.15 so stacked diacritics do not clip.
- Counters read the frame's time, not the sub-frame's, or digits smear. Use tabular numerals.
- A helper that sets `globalAlpha`/`filter` must restore it. Never put `will-change` on anything the camera scales (text blurs).
- WebGL headless: Chromium with `--use-angle=swiftshader` (already in render.mjs).
- Canvas-only comps set `window.CAPTURE='canvas'` for faster capture (~1.5x); DOM/SVG comps use page screenshots.

## Direction laws (the taste that made these go viral)

**Story**
- One shot = one idea. 3 extraordinary moments beat 10 mediocre features. ~1 visual idea per 1.5-2 s.
- First 1.5 s already premium; first product moment by ~2 s; no 5-second logo intro. Sell one feeling, not a feature list (arc example: chaos -> control -> clarity -> brand).
- Final frame holds still long enough to read; end confident, no bouncing CTA.

**Continuity**
- Prefer one persistent element that morphs (size, radius, colour, material) over cuts. Object-driven transitions: chart line -> document edge, number -> invoice amount, toast check -> button. Target reaction: "of course the next scene came from that."
- Colour changes are floods or moving accent elements, never crossfades (orange into ink goes muddy).
- Content enters after its container starts morphing and leaves before the next morph; swaps use a short blur (8-12 px, 0.15 s). Outgoing titles clear before incoming ones occupy the space.
- Camera: one camera; it settles slower than the shape (shape spring ~0.35 s, camera ~0.6 s); slow push 1.03-1.07 on holds so nothing freezes. Never zoom the camera into an off-centre dot: open the dot like an iris instead.

**Timing**
- Something lands on every beat for the first 16 beats; moves start ~0.05 s early so they land on the beat. Stagger 2-4 frames or a 1/16 note (125 ms at 120 BPM).
- Arrive fast, land soft. Eases: critically damped spring for settles; tiny overshoot (zeta 0.72-0.85, < 2 %) for UI; expo in/out for wipes, presses, exits; `cubic-bezier(0.16,1,0.3,1)` premium out; `cubic-bezier(0.45,0,0.15,1)` 0.8 s glides. Never linear (except tickers and continuous rotations).
- Holds <= 1 s unless deliberate. Put 0.3-0.5 s of anticipation before the big moment; allow one 400 ms absolute stillness for emotion.
- Rotating patterns rotate continuously; snapping them one notch per beat reads as stutter.

**Type**
- Very little copy: <= 7 words per caption, one idea per shot, one text layer at a time, hand-placed line breaks. Readable things stay >= 8 clean frames.
- Type moves as designed objects (masked line rise, scale into a transition device), not every word bouncing independently.

**Banned by default** (lift only when the brief asks): crossfades between scenes, particle bursts, lens flares, glows, camera shake, RGB split/glitch spam, bouncy/elastic easing, gradients on UI chrome, glassmorphism everywhere, pointless 3D card spins, constant zoom, generic SaaS slide-left, stock "futuristic HUD", corner timecodes/fps counters, animator jargon on screen, purple AI gradients, robots/brains/sparkles.

**Self-rejection test** before delivery: does any frame look like a SaaS template, a PowerPoint, a screen recording, five screenshots sliding around, or an AI promo? Would every important frame work as a still ad? If not, fix it.

## Audio

- Beat grid from the song (numpy/librosa onset + tempo; verify the downbeat). If the song is not 120 BPM, retime the table, never the music.
- Sound is code (numpy / Web Audio synthesis) or CC0/licensed and logged; never pull copyrighted tracks. If none is available, deliver the visual master plus a cue sheet.
- Place each SFX by its measured transient peak on the action frame. Duck music 12-18 dB under voice. Master -14 LUFS, -2 dBTP, measured again after AAC encode. The film must still work muted (burned-in captions for VO).

## Genres (details in `references/genre-playbooks.md`)

| Request sounds like | Playbook |
|---|---|
| "UI motion", Dribbble shot, one shape morphing through states | UI morph loop |
| Launch video, product film, SaaS promo, Apple-style | Product launch film |
| Showreel, "show what a motion designer you are" | Showreel |
| Kinetic type, manifesto, spoken word, lyric video | Kinetic type film |
| Explain X, science, history, data story, podcast inserts | Explainer |
| Music video, papery/hand-drawn story, character short | Illustrated story / music video |
| 3D object, world, fly-through, interactive explode model | 3D scene |

## Deliverable checklist

- [ ] Spec + beat-mapped storyboard written before code
- [ ] Stills reviewed, worst 3 issues fixed
- [ ] `check.py` PASS (pops, dead holds, loop seam) and contact sheet reviewed
- [ ] Real assets only; no invented claims; fonts and media embedded
- [ ] Audio peaks on action frames, -14 LUFS (or cue sheet)
- [ ] Re-render command and source handed over
