---
name: motion-director
description: "Entry point and router of SFT Super Motion Studio V2 for any motion graphics, video, animation or 3D request: video editing in Premiere/After Effects, kinetic/spatial typography, launch and real-estate films, code-rendered video (raw seek(t), HyperFrames, Remotion, Motion Canvas), web/UI animation (GSAP, Motion, anime.js, Lottie, Rive), 3D (three.js, R3F), and finishing (FFmpeg, Mediabunny, SVG, audio). Use first: it loads senior-editor (Layer 0: pre-flight, tell library, soul layer, human gate), then sfc-super-motion-v1 (three pillars: Rule of Six editorial, Shape & Motion Graph, Motion Text), then ae-automation-architect (Depth & Soul laws; AE script and expression rules) and motion-foundation-core (source audit, grid and layout geometry, edit and export gates) for any video job, classifies the brief, picks host + engine, applies the Forge pipeline (engine-neutral spec, bridges, alpha handoff, four-lens QA gate) and loads only the skills needed."
---

# Motion Director (SFT Super Motion Studio V2 router)

Take the senior editor's seat, run the three-pillar structure, classify, pick **one host** and the **engines** inside it, load only those skills, then run the Forge pipeline. Never load everything.

## 0a. Senior Editor — Layer 0 (mandatory, first)

Load `senior-editor` before anything else, for every video or motion deliverable, review or revision. It is the stance the rest of the pipeline runs under: pre-flight (piece type, locked layer, viewer, voice anchor, mechanical density → light/mixed/full pass), the one idea and feeling beats, the `ME-` tell library, the soul layer (rhythm variance, motivated holds, role asymmetry, seeded `VAR-` imperfection, silence), the copy pass on VO and on-screen text, self-audit on stills and final, the human gate, and the editor's notes plus `editor-runbook.md`. Announce its pre-flight line before §0b. Live UI micro-interactions: Tier 1 tells only. Pure encode/convert: skip.

## 0b. SFC Super Motion V1 — three pillars (mandatory, before any task)

Load `sfc-super-motion-v1` **before** choosing a host or touching code/timeline, for every video or motion deliverable. It runs three pillars in order: **(1) Editorial** — Murch's Rule of Six, emotion → story → rhythm → eye-trace → 2D screen plane → 3D action space; **(2) Shape & Motion Graph** — shape hierarchy, named easing/spring tokens, arcs, enter/exit, stagger, domain blueprints; **(3) Motion Text** — exact-content text grouping, activation, timing and 2D/2.5D/3D rigs.

Produce, scaled to the request: brief + beat map + cut/scene list (P1) → per-beat motion spec with token names and frame durations (P2) → text blueprints with `MT-`/`CUST-` IDs and fallbacks (P3) → checks. Pass sizes, gates and the precedence table for pillar conflicts live in that skill's SKILL.md.

Write that plan through the senior editor's soul layer, then run its plan audit (`senior-editor` step 3.5) before building. Everything below inherits the plan: the host builds it, the engines animate it with the P2 tokens and `VAR-` entries, QA reviews it against all three pillars and the human gate.

## 0c. AE Automation Architect — Depth & Soul framework (mandatory, after §0b)

Load `ae-automation-architect` once the three-pillar plan exists, for every video or motion deliverable. Its three motion laws tighten Stage 2 on any host: **DS-1** no linear or default ease (spring, or sharp-attack long-decel curve, default `cubic-bezier(0.16, 1, 0.3, 1)`); **DS-2** overlapping action (seeded 2–4 frame stagger: shapes → titles → secondary elements); **DS-3** one physically coupled secondary system per moving shot (camera Z drift, chromatic aberration at peak velocity, shadows and glows that shift with distance), each inside its budget.

When the host is After Effects, or any `.jsx`, expression, rig or AE bridge batch is written, its five engine rules are binding: **AE-1** ES3 wrapper, V8 only inside expression strings; **AE-2** matchName references; **AE-3** 1-based indices, undo group, try/catch; **AE-4** damped harmonic oscillator via `velocityAtTime` or explicit `KeyframeEase`; **AE-5** three-band inverse-square glow. `scripts/es3_lint.py` must exit 0 before a script runs. Its rulings table settles conflicts with Pillar 2 defaults and the `ME-` tells. Live UI: DS-1 and DS-2 only. Pure encode: skip.

## 0d. Motion Foundation Core — source audit, geometry, gates (mandatory, runs across the pipeline)

Load `motion-foundation-core` with the three layers above for every video or motion deliverable. It owns what they do not: the real source, the geometry and the readiness gates. Its gates interleave with the steps above rather than following them:

| When | Gate |
|---|---|
| Right after the §0a pre-flight line | **G0** task, deliverable, scope · **G1** real source audit (metadata, frames, audio, protected regions). No source opened → provisional plan only. |
| §0b Stage 1 | **G2** each beat becomes a scene of one `motion_plan.json` |
| Between Stage 1 and Stage 2 | **G3** grid profile, layout (`Lxx` or custom), bbox per layer, reflow |
| Stages 2–3 and §0c | **G4** codes A–G / T / M name the choice, V2 tokens execute it (`MIX.md`) |
| Before any build | **G5** `foundation_mix_lint.py --phase edit` exit 0 |
| Build and stills | **G6** non-destructive trial, real frames |
| Before the final render | **G7** evidence recorded, `--phase export` exit 0 |

Its numbers (6 s scenes, 6-frame delays, ease-out cubic, sample palette) are references; its process and evidence rules are not. Conflicts with Pillar 2, DS-1..3 and the `ME-` tells are settled in its rulings table. Live UI and pure encodes: skip.

## 1. What is being made?

| Deliverable | Host (pick one) | Load |
|---|---|---|
| Edit of real footage, talking-head, VFX comp, grade, MOGRT | Adobe PR/AE | `edit-ae-pr-master` (+ `ae-automation-architect` engine rules for every script, expression and rig) |
| Rendered film from code, no host named (launch film, UI reel, explainer, MV, loop) | Raw `seek(t)` engine | `code-motion-graphics` |
| HTML/GSAP video, HeyGen, captions on footage, slideshow | HyperFrames | `code-hyperframes` |
| React video, data-driven/templated video, Player/Lambda/SaaS | Remotion 4.0.535 | `code-remotion` |
| Code walkthrough, math/diagram explainer timed to VO | Motion Canvas | `code-motion-canvas` |
| Live UI motion on a site/app (micro-interactions, page transitions, scroll) | The product codebase | `anim-gsap` or `anim-motion` (+ `brand-animation-graphics`) |
| Interactive vector asset (icon, mascot, state machine) | Lottie or Rive runtime | `anim-lottie` / `anim-rive` |
| 3D scene, product turntable, shader look | three.js / R3F (inside any code host) | `three-3d-stack` |
| Encode, convert, transparent delivery, GIF, loudness, subtitles burn-in | FFmpeg / Mediabunny | `media-ffmpeg` / `media-mediabunny` |

No host named and the request is pure graphics → `code-motion-graphics`; footage-based → Adobe. Ask once only if the choice changes cost (e.g. "editable in Premiere" vs "rendered in code").

Web UI with React and no library chosen: `anim-motion` for component/layout/gesture motion, `anim-gsap` for timelines, scroll choreography, SVG/text effects. Both live in the TezPi stack (Next.js + TS + Tailwind).

## 2. Add layers by content

| Content | Load |
|---|---|
| Titles, lower thirds, kinetic type, captions styling | `type-kinetic-fx` (mechanism and timing from `sfc-super-motion-v1` Pillar 3) |
| Text in 3D space, maps, pins, routes, HUD, SFX sync | `type-spatial-hud-sfx` (+ `code-remotion` maps for code) |
| Real estate, architecture, hospitality, luxury product | `genre-luxury-launch` |
| SaaS/app launch, UI morph reel, showreel, explainer, MV, 3D object film | `code-motion-graphics` genre playbooks |
| Brand, DESIGN.md, tokens, "in the style of <product>", logo sting | `brand-animation-graphics` |
| SVG from Figma/Illustrator to animate, OG/thumbnail cards | `media-svg-satori` |
| UI sounds on a live page | `media-audio-howler` |
| Library-specific (inside a code host) | GSAP `anim-gsap` · anime.js `anim-animejs` · Lottie `anim-lottie` · Rive `anim-rive` · 3D `three-3d-stack` |

AE/PR typography and genre skills carry over as design rules (hierarchy, timing, easing, legibility, SFX hits) when the host is code; translate only the implementation.

## 3. The Forge pipeline (every code-rendered job)

1. **Engine-neutral spec.** Write the brief in `code-motion-graphics` spec format from the §0 beat map (the BPM grid quantizes dramatic beats when music leads; it never replaces them), state table in beats/seconds (time, change, transition device, copy, SFX), eases named by curve (`cubic-bezier(0.16,1,0.3,1)` premium out, critically damped spring for settles). Nothing in the spec mentions a library, so the same spec builds in any host.
2. **Host selection** by section 1. Then pick engines per layer (type, 3D, vector, UI) from the bridge matrix below.
3. **Bridge every engine to the host clock.** A frame is a pure function of time; nothing runs on the wall clock.

   | Engine | Raw `seek(t)` | HyperFrames | Remotion | Banned in renders |
   |---|---|---|---|---|
   | GSAP | `tl.seek(t)` on a paused timeline | native `window.__timelines[id]` | `@remotion/gsap` `useGsapTimeline` | callbacks for state, `random()` strings, ScrollTrigger/Draggable |
   | anime.js | `engine.useDefaultMainLoop=false`, `tl.seek(t*1000, true)` | same, paused | `useLayoutEffect` seek per frame | unseeded `utils.random`, onScroll |
   | Lottie | `setFrame(t*fps)` with `autoplay:false` | same | `@remotion/lottie` `<Lottie>` | autoplay/loop playback |
   | Rive | low-level `advance` from 0 each seek | same | `@remotion/rive` (linear animation) | live state machines |
   | three.js / R3F | set uniforms from `t`, `render()` | same | `@remotion/three` `<ThreeCanvas>` + `useCurrentFrame` | `useFrame` delta, `THREE.Clock` |
   | Physics (rapier) | bake per frame, play back | same | same | `timeStep="vary"`, live stepping |
   | Motion (framer) | not seekable → closed-form springs | GSAP instead | `spring()` / `interpolate()` | all wall-clock motion |

4. **Stills first** (one per beat; this is `motion-foundation-core` G6, after its G5 edit gate), critique in consecutive pairs for eye-trace handoff and screen direction, run the `senior-editor` self-audit ("what makes this look template-made?"), fix the 3 worst; then the full render (sub-frame motion blur 4-8).
5. **Alpha handoff** when the piece will be composited: ProRes 4444 master → WebM VP9 alpha (web) / HEVC alpha (Safari, macOS encoder) / master itself for editors (`media-ffmpeg/references/alpha-delivery.md`). Verify alpha with `alphaextract` before shipping.
6. **Finishing**: grade/LUT, grain, loudness -14 LUFS / -2 dBTP, platform cuts 9:16 · 16:9 · 4:5 (`media-ffmpeg`); in-browser export button → `media-mediabunny`.
7. **Four-lens QA gate.** (0) Human gate first (`senior-editor`): one uninterrupted watch from frame 0 at 1×, sound on, as the target viewer; the one idea and feeling beats land, no Tier 1 `ME-` tell remains, every kept tell is named; `scripts/editor_fingerprint.py scan` on the render for rhythm, stillness and silence. (a) Motion gate: `code-motion-graphics/assets/check.py` on decoded frames of the final file (pops, dead holds, loop seam, contact sheet) + the self-rejection test + the `ae-automation-architect` gate (no linear or default ease, no two layers landing on one frame, one coupled secondary system per moving shot, three-band glow; for AE scripts `es3_lint.py` exit 0 and no expression error). (b) Delivery gate: `motion-foundation-core` G7 (`foundation_mix_lint.py --phase export` exit 0 with real evidence in `reviews`; state reported as `preview_rendered`, `final_exported` or `final_verified`), `ffprobe` specs, LUFS re-measured after encode, Vietnamese diacritics unclipped at target size, safe areas, colour tags bt709. (c) Structure gate: `sfc-super-motion-v1` Stage 5 — Pillar 1 three-scale review (join / scene / whole) at playback speed with sound, key decisions tagged `appropriate` / `review_needed` / `insufficient_evidence` / `not_applicable`, Pillar 2 audit checklist, Pillar 3 text visual checks. Deliver only when all four pass, with the `senior-editor` editor's notes and runbook entry, and report the real state (proposed, applied, exported).

## 4. Live UI motion (not rendered)

Brief → `senior-editor` Tier 1 tells only (every motion has a job; no fade-up-everything, no one-curve default) → motion tokens (`brand-animation-graphics`) → implement (`anim-motion` / `anim-gsap` / `anim-animejs`) → performance (transforms/opacity only; `anim-gsap` performance reference, Motion `motion-reviewer` agent for MotionScore audits) → reduced-motion variant → sound if any (`media-audio-howler`).

## 5. Legacy names (Lineage Layer)

A request may name a former standalone skill. Route it here; the content is the same (see `LINEAGE.md`).

| Former skill | Load |
|---|---|
| `adobe-premiere-after-effects-master` | `edit-ae-pr-master` |
| `typography-fx-system-ae-pr` | `type-kinetic-fx` |
| `spatial-typography-map-hud-sfx` | `type-spatial-hud-sfx` |
| `premium-real-estate-product-launch-motion-graphics` | `genre-luxury-launch` |
| `hyperframes-bootstrap` | `code-hyperframes` |
| `gsap-plugins` | `anim-gsap` → `references/gsap-plugins.md` |
| `remotion-latest-rules` | `code-remotion` → `legacy/remotion-latest-rules.md` (status: `legacy/README.md`) |
| `video-editing-structure`, `edit-video-structure` | `sfc-super-motion-v1` → `pillars/1-editorial/` |
| `universal-shape-and-motion-graph-architecture` | `sfc-super-motion-v1` → `pillars/2-shape-graph/` |
| `motion-text-custom` | `sfc-super-motion-v1` → `pillars/3-motion-text/` |
| "AE Automation Architect", "Technical Motion Director", "Depth & Soul framework" | `ae-automation-architect` |
| `motion-foundation-core` (standalone plugin 1.0.0), "Motion Grid AE Handbook", "84 mã A–G", "20 layout" | `motion-foundation-core` → `FOUNDATION.md` (original body) + `MIX.md` |
| `humanizer` (only for VO, titles, captions or copy inside a motion job; prose elsewhere stays with the standalone humanizer) | `senior-editor` copy pass → `canon/humanizer-3.1.0.md` + `references/mechanical-tells.md` ME-09 |

## Common combos

Every combo below starts with `senior-editor` (§0a), `sfc-super-motion-v1` (§0b), then `ae-automation-architect` (§0c), with the `motion-foundation-core` gates (§0d) running across them, unless it is live UI (Tier 1 tells, DS-1 and DS-2 only) or a pure encode.

- Review "does this cut feel AI / robotic?" → `senior-editor` review mode (+ `editor_fingerprint.py` on the file)

- Storyboard with grid and keyframes, text and shape layout, 9:16 ↔ 16:9 reflow, overlay on existing footage ("bố cục text shape", "đổi ngang sang dọc, giữ logo") → `motion-foundation-core` leads (G1 source audit, G3 geometry) + the host
- After Effects rig, expression or automation script ("write a .jsx", "rig this in AE", "add depth to this comp") → `ae-automation-architect` + `edit-ae-pr-master` (+ `type-kinetic-fx` for text)
- Talking-head competition video → `edit-ae-pr-master` + `type-kinetic-fx` (+ `media-ffmpeg` whisper subtitles)
- Real-estate project film → `genre-luxury-launch` + `type-spatial-hud-sfx` + `edit-ae-pr-master` (3D massing in code: + `three-3d-stack`)
- SaaS launch film from the product UI → `code-motion-graphics` + `brand-animation-graphics` + `anim-gsap`
- Remotion data/explainer → `code-remotion` + `code-motion-graphics` + `type-kinetic-fx`
- Product 3D turntable over footage → `three-3d-stack` + `code-remotion` + `media-ffmpeg` (alpha)
- Animated logo for web + video → `brand-animation-graphics` + `media-svg-satori` (clean SVG) + `anim-gsap` (web) + `media-ffmpeg` (alpha master)
- Code tutorial video with VO → `code-motion-canvas` + `media-ffmpeg`
- Interactive mascot / button → `anim-rive` or `anim-lottie` + `media-audio-howler`
