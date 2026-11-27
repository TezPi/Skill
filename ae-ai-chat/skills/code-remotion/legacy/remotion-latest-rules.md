---
name: "remotion-latest-rules"
description: "Use alongside the Remotion plugin skills whenever writing Remotion code: rules added in Remotion skills 4.0.533 (timing props, premount, interactive schema, motion blur, effects)."
---

# Remotion 4.0.533 rules (delta over plugin 4.0.528)

Source: github.com/remotion-dev/remotion `packages/skills/skills`, commit 152fb7e. Where this conflicts with an older Remotion skill, follow this file. Delete this skill once the installed `remotion` plugin is 4.0.533 or newer.

## 1. fps and premounting
- Inside a composition or scene component, get `const {fps} = useVideoConfig()` and use it for every seconds-to-frames expression. Never use a fixed FPS constant.
- Keep the expression on the JSX node (`trimBefore={4 * fps}`) so Studio can edit it and it stays correct if the frame rate changes.
- Give every timed item that supports it `premountFor={fps}`, including items starting at frame 0: media, interactive components, `<Sequence>`, `<Series.Sequence>`, `<TransitionSeries.Sequence>`, `<TransitionSeries.Overlay>`, and timed items nested inside scenes. Premount the parent too when a nested item must mount before the parent starts. `<TransitionSeries.Transition>` has no `premountFor` and needs no substitute.

## 2. Timing props (put them directly on the component)
Supported by `<AbsoluteFill>`, `<Interactive.*>`, `<Img>`, `<AnimatedImage>`, `<CanvasImage>`, `<HtmlInCanvas>`, `<Solid>`, `<Sequence>` (remotion), `<Video>`/`<Audio>` (@remotion/media), `<Gif>`, and custom components built with `Interactive.withSchema({wrapInSequence: true})`. Avoid redundant `<Sequence>` wrappers.

- `from`: where the item starts in its parent timeline; children start at frame 0.
- `trimBefore`: first frame of the item's own timeline.
- `durationInFrames`: how many frames of its own timeline are shown, starting at `trimBefore`. Use it to end media early.
- `playbackRate`: speed; the item occupies `durationInFrames / playbackRate` parent frames.
- `loop`: repeats the selected range until the parent ends. `<Video>`, `<Audio>`, `<Gif>`, `<AnimatedImage>` may omit `durationInFrames`; others need it. `<Img>`, `<CanvasImage>`, `<Solid>`, shapes do not support `loop`.

Order: from → trimBefore → durationInFrames → playbackRate → loop. Child frame = `trimBefore + (frame - from) * playbackRate`.

Fallback for components without these props: wrap in `<Sequence>` (`layout="absolute-fill"` or `layout="none"` for headless).

```tsx
<Video src={src} from={1 * fps} trimBefore={2 * fps} durationInFrames={3 * fps} premountFor={fps} />
<Audio src={staticFile('audio.mp3')} premountFor={fps} />
```

## 3. Interactive / editable structure
- Prefer `Interactive.withSchema({Component, componentName, schema, wrapInSequence: true})` for custom visual components with editable props; type the schema `as const satisfies InteractivitySchema` (field types include `text-content`, `color`).
- Register reusable scenes as connected compositions: the same exported component reference in a `<Composition>` with dimensions, fps, duration and `defaultProps`.
- Author every registration, clip, scene, layer and sequence that should be edited independently as its own JSX node with editable props inline. Use loops only when instances are intentionally controlled as one template.
- Pre-compose request from Studio (e.g. `Pre-compose X (src/File.tsx:134)`): extract the markup at that location into a named component, preferably interactive with `wrapInSequence: true`, register it with a unique `<Composition>` and equivalent defaultProps, and carry inherited styles and font loading into it. Extraction without registration does not complete the request.
- If the composition is mainly a timeline of video/audio clips, read the plugin's `video-editing.md` before choosing structure. Read `compositions.md` before registering `<Composition>` or `<Still>`.

## 4. Motion blur
Use `@remotion/motion-blur` (`npx remotion add @remotion/motion-blur`). `<HtmlInCanvasMotionBlur>` (Remotion 4.0.529+) is the preferred way to blur animated HTML.
- Pass `width`/`height` from `useVideoConfig()`. `shutterAngle` 0–360 (default 180, 0 disables). `samples` integer 1–64 (default 8); more is smoother but slower.
- Call `useCurrentFrame()` inside the child component so each sample gets its own frame.
- Live preview needs Chrome 149+ with `chrome://flags/#canvas-draw-element`; rendering needs no config.
- Nest `<HtmlInCanvas>`/`<HtmlInCanvasMotionBlur>` only when `HtmlInCanvas.isNestingSupported()` is true (Chrome 157+).
- If HTML-in-canvas is unavailable, see https://www.remotion.dev/docs/motion-blur.

## 5. Effects
First identify the element or group the effect should affect. If it supports `effects` and a built-in effect matches, prefer it over a CSS approximation (e.g. `vignette()` on a `<Video>`).

| Import from | Components accepting `effects` |
| --- | --- |
| `remotion` | `<Img>`, `<CanvasImage>`, `<AnimatedImage>`, `<Solid>`, `<HtmlInCanvas>` |
| `@remotion/media` | `<Video>` |
| `@remotion/gif` | `<Gif>` |
| `@remotion/rive` | `<RemotionRiveCanvas>` |
| `@remotion/shapes` | `<Arrow>`, `<Callout>`, `<Circle>`, `<Ellipse>`, `<Heart>`, `<Pie>`, `<Polygon>`, `<Rect>`, `<Spark>`, `<Star>`, `<Triangle>` |

Plain HTML, `<Interactive.*>`, `<AbsoluteFill>` and `<Sequence>` do not accept `effects`; wrap them in `<HtmlInCanvas>` and put `effects` on the wrapper.

Built-in effects (`@remotion/effects`):
- Color/tone: brightness, colorCorrection, colorKey, contrast, duotone, exposure, grayscale, hue, invert, levels, linearGradient, linearGradientTint, lut, saturation, shadowsHighlights, thermalVision, tint, vibrance, whiteBalance
- Blur/trails: blur, lightTrail, linearProgressiveBlur, radialProgressiveBlur, regionBlur, zoomBlur
- Lighting: dropShadow, glow, lightLeak, shine, starburst, vignette
- Distortion/transform: barrelDistortion, chromaticAberration, cornerPin, fisheye, mirror, noiseDisplacement, scale, skew, tile, uvTranslate, wave, xyTranslate
- Textures: burlap, checkerboard, contourLines, dotGrid, emboss, flannel, gridlines, halftone, halftoneLinearGradient, lines, liquidContours, noise, paper, pattern, rings, scanlines, speckle, tvSignalOff, waves, whiteNoise, zigzag
- Edges: outline, roughenEdges, shrinkwrap, tear
- Pixelation/transitions: evolve, linearProgressivePixelate, pixelate, pixelDissolve, radialProgressivePixelate, venetianBlinds

Read the plugin's `effects.md` for imports and parameters; use `createEffect()` only when no built-in matches.

### Effects must be inline
The effects array must not be computed. Hardcode all parameters inline, like `interpolate()` keyframes (input range, output range, easing, extrapolation). No conditional arrays, no parameters pulled from variables. Render separate elements if one version needs effects and another does not.

```tsx
// Good
<CanvasImage src={src} width={1280} height={720} effects={[
  radialProgressiveBlur({ center: [0.5, 0.5], width: 1.2, height: 0.8, start: 0.2, rotation: interpolate(frame, [0, 120], [0, 180]) }),
]} />
// Bad: effects={enabled ? [radialProgressiveBlur({ center, rotation })] : []}
```

## 6. Maps
New example components in the repo: Cesium `CesiumFlythrough.tsx`, MapTiler `RiverReveal.tsx` and `CountryLabel.tsx` (under `remotion-maps/techniques/*/assets`). Load the plugin's Remotion Maps skill for map work.