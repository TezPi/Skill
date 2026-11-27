---
name: code-motion-canvas
description: "Motion Canvas 3.17 (TypeScript, generator-based, Canvas2D): scenes with makeScene2D, yield* tweens, flow (all, any, chain, sequence, loop, delay, waitFor), signals and computed values, references, flexbox layouts, camera, scene transitions, animated Code blocks with selection/edit, LaTeX, splines/bezier paths, time events with waitUntil for voiceover sync, seeded useRandom, shaders/filters, image-sequence and FFmpeg export, presentation mode. Use when the user names Motion Canvas, wants a code-explainer or math/diagram animation timed to voiceover, an animated code walkthrough, or a TypeScript (non-React) programmatic video. Load senior-editor (Layer 0) then sfc-super-motion-v1 first (Rule of Six editorial, Shape & Motion Graph tokens, Motion Text blueprints)."
---

# Motion Canvas

Source: `motion-canvas/motion-canvas` 3.17.2 (`packages/docs/docs`, MIT). Full docs bundled in `references/` (open the page you need; `getting-started/` covers 90 % of work). Best fit: technical explainers, code walkthroughs, math/diagrams, VO-timed teaching videos. For brand/launch films prefer `code-motion-graphics` (raw engine) or `code-remotion`; for HTML/GSAP prefer `code-hyperframes`.

## Setup

```bash
npm init @motion-canvas@latest   # pick TypeScript + exporters (Image sequence, Video (FFmpeg))
npm install && npm start         # editor at http://localhost:9000
```

Project: `src/project.ts` → `makeProject({ scenes: [intro, demo] })`; scenes import with `?scene`.

## Mental model

- A scene is a generator. `yield` = one frame; `yield*` delegates to a tween/flow generator. Time is driven by the editor/renderer, so output is deterministic by construction.
- Properties are **signals**: `node().x()` reads, `node().x(300)` sets, `node().x(300, 0.6)` tweens over 0.6 s, `.to(-300, 0.6)` chains. Computed: `createSignal(() => a() * 2)`.
- Refs: `const box = createRef<Rect>()` → `<Rect ref={box} />` → `box()`. Many: `makeRefs` / `createRefArray`.

```tsx
import {makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {all, chain, createRef, easeOutCubic, sequence, waitFor, waitUntil, useRandom} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const card = createRef<Rect>();
  const title = createRef<Txt>();
  view.add(
    <Rect ref={card} layout direction="column" gap={24} padding={64} radius={32} fill="#111" scale={0.9} opacity={0}>
      <Txt ref={title} fontFamily="Be Vietnam Pro" fontSize={88} lineHeight={1.2} fill="#fff" text="" />
    </Rect>,
  );
  yield* all(card().opacity(1, 0.5), card().scale(1, 0.6, easeOutCubic));
  yield* title().text('Nếp Nhà', 0.8);          // typewriter tween on text
  yield* waitUntil('cta');                       // draggable time event in the editor (VO sync)
  yield* chain(card().fill('#ff6b00', 0.4), waitFor(0.3), card().fill('#111', 0.4));
});
```

## Flow and timing

| Need | Use |
|---|---|
| Parallel | `all(a, b)` / first-done `any(a, b)` |
| Serial | `chain(a, b)` |
| Stagger | `sequence(0.08, ...items.map(i => i().y(0, 0.5)))` |
| Repeat | `loop(n, i => ...)` (infinite: `loop(() => ...)`) |
| Hold | `waitFor(s)`; VO-synced hold: `waitUntil('event')` + `useDuration('event')` |
| Easing | `easeOutCubic`, `easeInOutCubic`, `easeOutExpo`, `linear`...; custom `(t) => number`. SFT premium out = cubic-bezier(0.16,1,0.3,1): implement as a function or approximate with `easeOutExpo`. |
| Scene transitions | `yield* slideTransition(Direction.Left)` at scene start; also `zoomIn/zoomOut/fade/waitTransition`; custom via `useTransition` (`references/getting-started/transitions.mdx`). |

## Signature features

- **Code**: `<Code code={...} />` with `code().code.replace(range, text, 0.6)`, `code().selection(range, 0.6)`, `findFirstRange('token')`; syntax colours via `LezerHighlighter` (`references/components/code/`).
- **LaTeX**: `<Latex tex="..." />`. **Paths**: `<Spline>`, `<CubicBezier>`, `<Path>` with `end()` for draw-on.
- **Layout**: set `layout` on a root `Rect` for flexbox (`direction`, `gap`, `alignItems`, `padding`); animate `size`/`gap` and children reflow.
- **Camera**: `<Camera>` node; zoom/centre on a node (`references/getting-started/camera.mdx`).
- **Media**: `<Video src={mp4} />` + `ref().play()`, `<Img>`, scene audio offset in Video Settings.
- **Random**: `useRandom(seed)` only; never `Math.random()`.
- **Fonts**: `@font-face` in `global.css` (`references/advanced/custom-font.mdx`). Vietnamese: Be Vietnam Pro / Inter, line-height ≥ 1.15.
- **Effects/shaders**: `references/advanced/filters-and-effects.mdx`, `shaders.mdx`.

## Render

- Image sequence (default) → assemble with ffmpeg, or the `@motion-canvas/ffmpeg` exporter (add `ffmpeg()` to `vite.config.ts` plugins) for MP4 + audio.
- Alpha: export PNG sequence with transparent background, then encode ProRes 4444 / VP9 alpha (`media-ffmpeg`).
- QA with `code-motion-graphics/assets/check.py` on the MP4 (pops, dead holds, loop seam, contact sheet).

Direction laws (beats, copy limits, banned clichés) come from `code-motion-graphics`; type rules from `type-kinetic-fx`.
