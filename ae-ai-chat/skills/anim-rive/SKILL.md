---
name: anim-rive
description: "Rive runtime for the web (@rive-app/canvas, -lite, -advanced, @rive-app/react-canvas): load .riv files, artboards, linear animations vs state machines, inputs (boolean/number/trigger), Rive events, data binding with view models, text runs, layout Fit/Alignment and Fit.Layout responsive artboards, DPR-correct sizing, cleanup, plus Rive inside Remotion (@remotion/rive) and frame-exact rendering. Use when the user has a .riv file, wants an interactive state-machine animation, a Rive character or button, data-bound Rive UI, or a Rive layer in a rendered video."
---

# Rive (web runtime)

Source: `rive-app/rive-wasm` (`js/src/rive.ts`, runtime 2.44 at import). Official docs: rive.app/docs/runtimes/web. Rive is authored in the Rive editor; code only loads, drives and binds it. Never try to recreate a `.riv` in code.

## Pick the package

| Package | When |
|---|---|
| `@rive-app/canvas` | Default. High-level API, Canvas2D renderer, many instances per page, small. |
| `@rive-app/canvas-lite` | Smallest; no Rive Text or Audio rendering. |
| `@rive-app/canvas-advanced(-single)` | Low-level: own render loop, several artboards on one canvas, frame-exact stepping. `-single` inlines the WASM (no extra request). |
| `@rive-app/webgl2` | GPU renderer for heavy scenes (not in this repo snapshot; confirm features on rive.app docs before promising them). |
| `@rive-app/react-canvas` | React wrapper (`useRive`, `useStateMachineInput`, `useViewModel*`). |

## High-level API

```ts
import { Rive, Layout, Fit, Alignment, EventType } from "@rive-app/canvas";

const r = new Rive({
  src: "/hero.riv",              // or buffer / riveFile (share one RiveFile across instances)
  canvas,
  artboard: "Hero",               // omit = default artboard
  stateMachines: "Main",          // interactive; or animations: "idle" for linear timelines
  autoplay: true,
  autoBind: true,                 // bind the default view model instance
  layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  onLoad: () => r.resizeDrawingSurfaceToCanvas(),   // DPR-correct backing store
});

// State machine inputs (only after onLoad; before that this returns undefined)
const [hover, progress, fire] = r.stateMachineInputs("Main") ?? [];
progress.value = 0.6; fire.fire();
// Nested artboard inputs: r.setNumberStateAtPath("progress", 0.6, "Card/Badge")

// Data binding (preferred over inputs in new files)
const vm = r.viewModelInstance;           // null until loaded / if the file has no view model
if (vm) {
  vm.number("price")!.value = 129;
  vm.string("title")!.value = "Nếp Nhà";
  vm.color("accent")!.rgb(255, 107, 0);
  vm.trigger("celebrate")!.trigger();
}

// Events authored in Rive
r.on(EventType.RiveEvent, (e) => console.log(e.data));

window.addEventListener("resize", () => r.resizeDrawingSurfaceToCanvas());
// Unmount: r.cleanup();
```

- Text: `r.setTextRunValue("Title", "...")`, nested `setTextRunValueAtPath(name, value, path)`. Vietnamese copy needs a font embedded in the .riv with full Vietnamese glyphs; otherwise ship it via `assetLoader`.
- Responsive artboards: `Fit.Layout` + Rive Layouts in the editor; call `resizeDrawingSurfaceToCanvas()` on resize, `resetArtboardSize()` to restore.
- Many instances on one page: load one `RiveFile` and pass `riveFile`, not `src`, to each `Rive`. Offscreen canvases: `r.stopRendering()` / `startRendering()` (IntersectionObserver).
- Accessibility: semantics (`semanticsMode`, `tabIndex`, `focusOptions`) are experimental and off by default. Until verified for the file, give the canvas `role="img"` + `aria-label` and keep real DOM buttons for any Rive "button".
- Reduced motion: pick a still state or `r.pause()` when `prefers-reduced-motion: reduce`.

## React

```tsx
import { useRive, useStateMachineInput, Layout, Fit } from "@rive-app/react-canvas";
const { rive, RiveComponent } = useRive({ src: "/btn.riv", stateMachines: "Button", autoplay: true,
  layout: new Layout({ fit: Fit.Contain }) });
const pressed = useStateMachineInput(rive, "Button", "pressed");
return <RiveComponent onPointerDown={() => (pressed!.value = true)} aria-label="Gửi" role="img" />;
```

## Rive in rendered video (frame-exact)

State machines react to input and wall-clock time; a render visits frames out of order. For video:

- **Remotion**: `<RemotionRiveCanvas src="..." artboard="..." animation="..." fit="contain" />` from `@remotion/rive` drives a **linear animation** from `useCurrentFrame()`. Accepts `effects` and timing/crop props. Docs: `code-remotion/remotion-docs/offline/rive/`.
- **Raw seek(t) / HyperFrames**: use the `canvas-advanced` low-level API. In `seek(t)`: `inst.time = 0; inst.advance(t); inst.apply(1); artboard.advance(0);` then clear and `artboard.draw(renderer)`. Setting from 0 each call keeps frames order-independent; never accumulate deltas across calls.
- If the motion only exists in a state machine, ask the designer for a linear timeline export of that path, or record it as alpha (ProRes 4444 / WebM VP9) and composite (`media-ffmpeg`).

Pair with `brand-animation-graphics` for timing/easing tokens when the Rive file is being designed, and `anim-motion` / `anim-gsap` for the surrounding DOM motion.
