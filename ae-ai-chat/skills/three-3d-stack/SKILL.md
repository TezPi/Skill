---
name: three-3d-stack
description: "3D motion stack in one hub: three.js r186 (WebGLRenderer vs WebGPURenderer, TSL node materials, import maps), React Three Fiber v9 (Canvas, useFrame, useThree, events, frameloop, pitfalls, performance), drei (Environment, Float, Text/Text3D, useGLTF, MeshTransmissionMaterial, ContactShadows, AccumulativeShadows, ScrollControls, CameraControls, Html, RenderTexture, Instances...), @react-three/postprocessing (Bloom, DepthOfField, ChromaticAberration, LUT, ToneMapping, SMAA...), @react-three/rapier physics - plus deterministic 3D for video (@remotion/three ThreeCanvas, seek(t), baked physics). Use for any 3D scene, product turntable, 3D hero, WebGL/WebGPU shader, GLTF model, R3F component, post-processing look, physics animation, or 3D shot in a rendered video."
---

# 3D stack (three.js · R3F · drei · postprocessing · rapier)

Sources bundled in `references/` (verbatim upstream docs at import): three.js 0.186 `llms.txt` + `llms-full.txt` (complete examples + full TSL reference), `pmndrs/react-three-fiber` 9.8 docs, `pmndrs/drei` docs (one page per helper), `pmndrs/react-postprocessing` 3.2 docs (one page per effect), `pmndrs/react-three-rapier` 2.2 readme + addons. Grep before writing API you are unsure of: `grep -rl "MeshTransmissionMaterial" references/drei`.

## Pick the layer

| Situation | Use | Read |
|---|---|---|
| Vanilla page, HTML artifact, raw `seek(t)` film | three.js directly | `references/three/llms.txt` (import maps, renderer choice), `llms-full.txt` for examples/TSL |
| React / Next.js app or Remotion | R3F (`@react-three/fiber@9` ↔ `react@19`; v8 ↔ React 18) | `references/r3f/` (start `getting-started/`, `API/hooks.mdx`, `advanced/pitfalls.mdx`) |
| Ready helpers (env maps, text, loaders, controls, materials, staging) | drei | `references/drei/<category>/<helper>.mdx` |
| Cinematic finish (bloom, DOF, grain, LUT, AA) | `@react-three/postprocessing` | `references/postprocessing/effects/*.mdx`, `effect-composer.mdx` |
| Falling/colliding objects, joints | `@react-three/rapier` | `references/rapier/react-three-rapier.md` |

Renderer: `WebGLRenderer` by default (max compatibility, headless-friendly). `WebGPURenderer` (`three/webgpu`, `await renderer.init()`) only when the brief needs TSL node materials or compute; in Remotion use `<ThreeWebGPUCanvas>`.

## Premium product-shot recipe (R3F + drei + postprocessing)

```tsx
<Canvas dpr={[1, 2]} camera={{ position: [0, 0.6, 4], fov: 30 }} gl={{ antialias: false }}>
  <color attach="background" args={["#0b0b0c"]} />
  <Environment preset="studio" environmentIntensity={0.8} />      {/* or <Lightformer> rig for brand reflections */}
  <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
    <Model />                                                      {/* useGLTF('/model.glb'); useGLTF.preload */}
  </Float>
  <ContactShadows position={[0, -1, 0]} opacity={0.5} blur={2.4} far={2} />
  <EffectComposer multisampling={0}>
    <SMAA />
    <Bloom mipmapBlur luminanceThreshold={0.9} intensity={0.6} />
    <ToneMapping />
    <Vignette offset={0.3} darkness={0.6} />
  </EffectComposer>
</Canvas>
```

Taste rules (from `code-motion-graphics` banned list): no default `OrbitControls` spin as "animation", no lens flares/glow spam, no pointless 3D card spins. One camera move per shot; camera settles slower than the object; slow push 1.03-1.07 on holds. Text in 3D: drei `<Text>` (SDF, fast) with a Vietnamese-capable font file (Be Vietnam Pro TTF/WOFF), `<Text3D>` needs a typeface JSON generated from that font.

## Performance (live web)

- `frameloop="demand"` + `invalidate()` for mostly-static scenes; `<PerformanceMonitor>` + `<AdaptiveDpr>` for mobile.
- Instancing (`<Instances>`, `<Merged>`), `<Detailed>` LOD, `<Bvh>` for raycast-heavy scenes, KTX2/Draco/Meshopt for assets (`useKTX2`, `useGLTF` with draco path).
- Never `setState` inside `useFrame`; mutate refs. Dispose loaders' results you create manually. See `references/r3f/advanced/scaling-performance.mdx` and `pitfalls.mdx`.

## Deterministic 3D for video (render law)

A rendered frame is a function of time only. `useFrame(delta)`, `THREE.Clock`, physics stepping and time-based shader uniforms all break when frames render out of order or in parallel.

| Host | Pattern |
|---|---|
| Remotion | `@remotion/three` `<ThreeCanvas width height>` (both required). Animate from `useCurrentFrame()` + `interpolate/spring`, never `useFrame`. During render the canvas runs `frameloop="never"`; after async texture updates call `advance(performance.now())`, not `invalidate()`. Set `Config.setChromiumOpenGlRenderer('angle')` (headless default can't render three). Video textures: `useOffthreadVideoTexture`. Docs: `code-remotion/remotion-docs/offline/three*.mdx`. |
| Raw `seek(t)` / HyperFrames | Own the loop: `renderer.setAnimationLoop(null)`; in `seek(t)` set every transform/uniform from `t` (`uTime.value = t`), then `renderer.render(scene, camera)`. Headless Chromium: `--use-angle=swiftshader` (already in `code-motion-graphics/assets/render.mjs`) or GPU ANGLE when available. Use `preserveDrawingBuffer: true` if capturing via `toDataURL`. |
| Physics (rapier) | Not seekable. **Bake**: step a fixed `timeStep` (1/fps) from t=0 for the whole duration offline, record each body's position/quaternion per frame into JSON, then play the bake back by frame index. Never `timeStep="vary"`. `useRapier().step(1/60)` gives manual stepping; `world.takeSnapshot()` can checkpoint long sims. |
| Postprocessing | Time-driven effects (Noise, Glitch, film grain, Water, Shockwave) read the renderer clock: drive their params from frame/time explicitly or keep them static for renders. Random seeds must be fixed. |

Alpha output (3D element over footage): transparent clear colour (`gl={{ alpha: true }}`, no `<color attach="background">`), PNG sequence or ProRes 4444 via `media-ffmpeg`. Check edges for premultiplied-alpha fringing in the comp.

Pair with: `code-motion-graphics` (direction, spec, QA gate), `code-remotion` (host), `genre-luxury-launch` (product/real-estate 3D looks), `brand-animation-graphics` (brand timing).
