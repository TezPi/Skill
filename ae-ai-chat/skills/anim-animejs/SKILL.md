---
name: anim-animejs
description: "Anime.js v4 (ES modules, 4.5): animate(), createTimeline(), stagger() grids, springs and cubicBezier, SVG line drawing (createDrawable), morphTo, motion paths, splitText and scrambleText, createLayout auto-layout (FLIP), onScroll observers, createDraggable, createAnimatable, createScope for responsive/reduced-motion and React cleanup, seeded random, WAAPI mode - and seeking anime.js frame-exactly for video. Use when the user names anime.js / animejs, wants a lightweight JS animation library, grid stagger effects, SVG drawing/morphing without GSAP, or migrates anime.js v3 code to v4."
---

# Anime.js v4

Source: `juliangarnier/anime` 4.5.0 (`dist/modules/*.d.ts` is the API ground truth). v4 is ESM-only and **not** v3-compatible: no `anime({targets})` call, `easing` → `ease`, `translateX`-style props also as `x/y`, `direction:'alternate'` → `alternate:true`, `anime.timeline` → `createTimeline`.

```js
import { animate, createTimeline, stagger, utils, svg, text, createScope, engine, waapi,
         onScroll, createDraggable, createAnimatable, createLayout,
         createSpring, cubicBezier, createSeededRandom } from 'animejs';
```

## Core

```js
animate('.card', {
  y: { from: 40 },            // from/to object per property
  opacity: [0, 1],            // keyframe array
  scale: { to: 1, ease: createSpring({ stiffness: 220, damping: 18 }) },
  duration: 800,              // ms by default (engine.timeUnit = 's' to switch)
  delay: stagger(60, { from: 'center' }),
  ease: 'outExpo',            // names: in/out/inOut + Quad..Expo, Back, Elastic, Bounce; 'out(3)' power form
  onComplete: () => {},
});
```

- SFT house ease: `cubicBezier(0.16, 1, 0.3, 1)` (premium out), glides `cubicBezier(0.45, 0, 0.15, 1)`.
- Grid stagger: `stagger(50, { grid: [cols, rows], from: 'center', axis: 'x' })`; value ranges: `stagger([0, 1], { ease: 'inOutSine' })`.
- Timeline: `createTimeline({ defaults: { duration: 600, ease: 'outExpo' } }).add(target, params, position).set(...).label('hit').call(fn, '<')`. Positions accept absolute ms, `'+=200'`, `'-=100'`, labels, `'<'` = **end** of the previous child and `'<<'` = its **start** (`'<<+=100'`). Careful: GSAP's `'<'` means previous *start*, so ported timelines shift if copied literally. `.sync(otherAnimation)` nests animations or WAAPI.
- Performance: transforms + opacity; `animate` from `'animejs'` uses a JS engine, `waapi.animate` (WAAPI mode) offloads simple tweens to the compositor.

## SVG and text

```js
animate(svg.createDrawable('.path'), { draw: ['0 0', '0 1'], duration: 1200, ease: 'inOutQuad' }); // line draw
animate('#shape-a', { d: svg.morphTo('#shape-b'), duration: 900 });                           // morph
const { translateX, translateY, rotate } = svg.createMotionPath('#route');
animate('.pin', { translateX, translateY, rotate, duration: 3000, ease: 'linear' });           // follow path
const split = text.splitText('.headline', { lines: true, words: true, chars: true });
animate(split.chars, { y: ['100%', '0%'], delay: stagger(18) });                               // masked char rise
```

Split only after `document.fonts.ready`. Vietnamese: splitText segments with `Intl.Segmenter` (graphemes stay whole), but per-char masks still clip stacked diacritics: prefer **words** or **lines** reveals, give masks headroom, line-height ≥ 1.15.

## Scroll, drag, layout, scope

- Scroll: `animate(el, { x: 300, autoplay: onScroll({ target: '.section', enter: 'bottom top', leave: 'top bottom', sync: 0.5 }) })`. `sync: true` scrubs, a number smooths.
- Drag: `createDraggable('.knob', { container: '.track', releaseEase: createSpring({ stiffness: 120 }) })`.
- Pointer-follow / frequent retargeting: `createAnimatable('.cursor', { x: 400, y: 400, ease: 'out(3)' })` then `a.x(px)`.
- Layout (FLIP): `createLayout(root)` animates children between layout states when the DOM changes.
- Responsive + reduced motion + cleanup:

```js
const scope = createScope({ root: ref.current, mediaQueries: { reduce: '(prefers-reduced-motion: reduce)' } })
  .add((self) => {
    if (self.matches.reduce) { utils.set('.card', { opacity: 1 }); return; }
    animate('.card', { y: [24, 0], opacity: [0, 1], delay: stagger(60) });
  });
// React: useEffect(() => () => scope.revert(), [])
```

## Anime.js as a video engine (frame-exact)

1. Build with `autoplay: false` (timeline or animation).
2. Kill the wall clock: `engine.useDefaultMainLoop = false` so nothing advances on its own.
3. In `window.seek(t)`: `tl.seek(t * 1000, true)` (second arg mutes callbacks). Same call works for Playwright frame capture (`code-motion-graphics` `render.mjs`) and HyperFrames-style hosts.
4. No unseeded randomness: replace `utils.random` / function values that call it with `const rnd = createSeededRandom(42)`, and precompute values before building the timeline, so every render process gets identical frames.
5. No `onScroll`, draggable or animatable in a render. Convert scroll scenes to time.
6. Loops: `tl.seek(t % duration)`; check `render(0) == render(D)` with `check.py --loop`.

Remotion has no anime.js adapter: compute values with `interpolate()`/`spring()` or seek a paused anime timeline to `frame / fps * 1000` inside a `useLayoutEffect` keyed on `frame` (DOM targets only; plain objects freeze in stills). Verify with a few `npx remotion still` frames before a full render.

Direction (what moves, beats, copy limits) comes from `code-motion-graphics`; brand timing tokens from `brand-animation-graphics`.
