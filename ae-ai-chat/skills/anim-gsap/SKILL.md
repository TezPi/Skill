---
name: anim-gsap
description: "Official GSAP skills (GSAP 3.15, every plugin free) in one hub: core tweens, easing, stagger, matchMedia/reduced motion, timelines and the position parameter, ScrollTrigger (pin, scrub, parallax), plugins (SplitText, MorphSVG, DrawSVG, MotionPath, Flip, Draggable, Observer, ScrollSmoother, CustomEase), gsap.utils, React (useGSAP), Vue/Svelte, performance - plus the seek-safe rules for driving GSAP inside HyperFrames, Remotion (@remotion/gsap) or a raw seek(t) video engine. Use for any GSAP tween, timeline, scroll animation, SVG morph/draw, split-text reveal, or when GSAP must render frame-accurately to video. Also covers ScrollToPlugin, Inertia, ScrambleText, physics plugins, EasePack, CustomWiggle/CustomBounce, GSDevTools and plugin registration (formerly the gsap-plugins skill)."
license: MIT
---

# GSAP hub

Upstream: `greensock/gsap-skills` (8 official skills, MIT), kept verbatim in `references/<skill-name>.md`. When a reference says "use **gsap-timeline**", open `references/gsap-timeline.md`. API source checked against `greensock/GSAP` 3.15.0 (`types/` in that repo is the ground truth for signatures).

## Route

| Need | Read |
|---|---|
| `to/from/fromTo/set`, eases, stagger, defaults, transforms, `autoAlpha`, `matchMedia`, reduced motion | `references/gsap-core.md` |
| Sequencing, position parameter (`"<"`, `">-0.2"`, labels), nesting, playback control | `references/gsap-timeline.md` |
| Scroll-linked, pin, scrub, parallax, `refresh()`, cleanup | `references/gsap-scrolltrigger.md` |
| SplitText, ScrambleText, MorphSVG, DrawSVG, MotionPath, Flip, Draggable, Inertia, Observer, ScrollSmoother, CustomEase/Wiggle/Bounce, GSDevTools, `registerPlugin` | `references/gsap-plugins.md` |
| `clamp`, `mapRange`, `interpolate`, `snap`, `wrap`, `toArray`, `pipe`, seeded `random` | `references/gsap-utils.md` |
| React / Next.js: `useGSAP`, refs, `contextSafe`, SSR | `references/gsap-react.md` |
| Vue / Nuxt / Svelte lifecycle and cleanup | `references/gsap-frameworks.md` |
| Jank, 60 fps, `will-change`, batching, layout thrash | `references/gsap-performance.md` |
| Which skill covers a term | `references/llms.txt` |

Licensing: all plugins ship in the public `gsap` npm package; no Club token or `.npmrc` (see `gsap-plugins.md`).

## Web UI defaults (TezPi stack: Next.js + TS + Tailwind)

- React: `useGSAP(() => {...}, { scope: ref })` from `@gsap/react`; never raw `useEffect` + `gsap.to` without revert.
- Animate `x/y/scale/rotation/autoAlpha` only. No `top/left/width/height` tweens.
- Premium out-ease for the SFT house style: `CustomEase.create("sft-out", "0.16,1,0.3,1")`; glides `"0.45,0,0.15,1"`. Wrap reduced motion in `gsap.matchMedia()` with `(prefers-reduced-motion: reduce)` → instant `set()`.

## Video render law (GSAP as a video engine)

A rendered frame must be a pure function of time. GSAP's own ticker runs on the wall clock, so for video:

1. Build every timeline `paused: true`. The host seeks it; nothing plays.
2. No callbacks for state (`onUpdate`, `onComplete`, `.call()`, `.then()`): frames render out of order and across processes. Derive state from time.
3. No unseeded randomness: no `"random(...)"` strings, `stagger: {from: "random"}`, `repeatRefresh`. Use `gsap.utils.random` with values precomputed from a seed, or the host's seeded random.
4. Tween DOM/SVG elements, not plain objects (stills freeze because nothing re-reads the object).
5. No ScrollTrigger, Draggable, Observer, Inertia in a render: there is no scroll or pointer. Convert scroll choreography to a time-based timeline (scrub progress = time / duration).
6. Fonts loaded (`document.fonts.ready`) and SplitText run before the first seek, or split lines shift between frames.

Host adapters:

| Host | How GSAP is driven |
|---|---|
| HyperFrames | Native runtime: `gsap.timeline({paused:true})` registered as `window.__timelines["<composition-id>"]`. See `code-hyperframes`. |
| Remotion ≥ 4.0.517 | `useGsapTimeline(({timeline, selector}) => {...})` from `@remotion/gsap`. It throws on playback calls, callbacks, random strings and stray `gsap.to()`. Plugins not supported yet. Offline docs: `code-remotion/remotion-docs/offline/gsap/`. |
| Raw seek(t) engine | In `window.seek(t)`: `tl.seek(t)` (events are suppressed by default; never pass `false`). See `code-motion-graphics`. |
| After Effects | No runtime. Rebuild the timeline as keyframes and match each ease's curve in the Graph Editor (or paste the cubic-bezier into an ease tool); see `edit-ae-pr-master`. |

For motion direction (what to animate, timing, beats) load `code-motion-graphics`; GSAP is the how, not the what.
