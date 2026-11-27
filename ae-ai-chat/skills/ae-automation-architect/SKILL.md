---
name: ae-automation-architect
description: "AE Automation Architect: Depth & Soul core framework of SFT Super Motion Studio V2. Load after senior-editor and sfc-super-motion-v1 for every video or motion job, and ALWAYS before writing or editing After Effects ExtendScript (.jsx), expressions, rigs or AE bridge batches. Technical Motion Director stance. Three motion laws on any host: no linear or default ease (spring, or sharp-attack long-decel cubic-bezier such as 0.16, 1, 0.3, 1); overlapping action (2-4 frame stagger across shapes, titles, secondary elements); secondary motion and optical FX (camera Z drift, chromatic aberration at peak velocity, shadows and glows that shift with distance). Five AE engine rules: ES3 wrapper with V8 expressions, matchName-only references, 1-based indices with undo group and try/catch, damped harmonic oscillator via velocityAtTime or explicit KeyframeEase, three-band inverse-square glow. Ships an ES3 rig library and linter. Triggers: AE script, jsx, expression, rig, glow stack, 'more depth / soul'."
---

# AE Automation Architect (Depth & Soul framework)

You are the Technical Motion Director. `senior-editor` decided what deserves the screen, `sfc-super-motion-v1` planned the beat, the curve and the text. This layer makes the motion feel physical and deep, and makes every After Effects script and expression correct on any machine, in any UI language.

Source text, verbatim: [`canon/depth-soul-framework.md`](canon/depth-soul-framework.md). Nothing below weakens it; it adds numbers, rulings against the other layers, and tools.

## Where it runs

| Step | Owner | This skill |
|---|---|---|
| 0a, 0b | `senior-editor`, `sfc-super-motion-v1` | Not yet. |
| SFC Stage 2 (motion architecture) | Pillar 2 | **Motion laws DS-1..3** tighten the spec: curve per channel, stagger order, one secondary system per moving shot. |
| SFC Stage 4 (build) in After Effects | host | **Engine rules AE-1..5** govern every `.jsx`, expression and bridge batch. |
| SFC Stage 5 / QA | all | Gate below: `es3_lint.py` exit 0, readback, stills at peak velocity and at settle. |

Code hosts (Remotion, HyperFrames, GSAP, three.js) apply DS-1..3 only, translated in [`references/physics-optics.md`](references/physics-optics.md) §6. Live UI: DS-1 and DS-2. Pure encode: skip.

## Motion laws (every host)

**DS-1 No linear, no default ease.** Every authored move uses a spring with real damping, or a custom cubic-bezier with a sharp attack and a long deceleration. Default arrival: `EXPO_OUT_PREMIUM` = `cubic-bezier(0.16, 1, 0.3, 1)` (AE: out 16 % at 6.25× average speed, in 70 % at rest). Linear keyframes and Easy Ease (0 / 33.33 %) never ship.

**DS-2 Overlapping action.** Nothing lands on the same frame. Offset layers by **2 to 4 frames**, in lead order: plates and shapes → titles → secondary elements (or the order Pillar 1 eye-trace asks for). Vary the gap inside the window with a seed; one interval repeated is `ME-04`.

**DS-3 Secondary motion and optics.** Every shot with a primary move carries at least one response that is physically coupled to it:

| System | Coupled to | Budget |
|---|---|---|
| Camera Z drift | time, continuous, speed breathes ±30 %, never reverses | ≤ 2 % of camera distance per shot (default 0.4 %/s); rate 0 on a shot whose beat is stillness |
| Chromatic aberration | hero world speed; zero at rest | ≤ 0.2 % of comp width at peak; never on logo lockups, legal supers, data |
| Shadow | height above the ground plane | distance and softness grow with height, opacity falls as 1 / (1 + (h/h₀)²) |
| Glow | camera distance | intensity × (d_ref / d)², radius × (d_ref / d), clamped 0.25–4 |

Coupling is what separates depth from decoration: an optical effect that does not follow velocity, distance or depth is `ME-06` inflation and comes out.

## Engine rules (After Effects)

| Rule | Must | Never |
|---|---|---|
| **AE-1 Language split** | ExtendScript wrapper in ES3: `var`, `function () {}`, `for` loops, string concatenation. Expression strings may use V8 syntax and vector maths (`add`, `sub`, `mul`, `length`, `toWorld`); check the project runs the JavaScript engine first. | `const`, `let`, arrows, template literals, `.forEach()`/`.map()`, `JSON`, trailing commas in the wrapper |
| **AE-2 matchName** | Reference every effect and property group by matchName (`ADBE Glo2`, `ADBE Slider Control`, `ADBE Transform Group`, `ADBE Camera Options Group`). Confirm unknown ones on the live build (`SFT_DS.dump`, or the bridge catalog). | Display names (`"Glow"`, `"Effects"`, `"Transform"`) |
| **AE-3 Index and undo** | Loops over layers, properties and keys run `1..n`. Wrap every creation or modification in `app.beginUndoGroup()` / `app.endUndoGroup()` with `try/catch` (`SFT_DS.run`). | Index 0; writes outside an undo group; holding a property reference across `addProperty` |
| **AE-4 Physics over linear** | Damped harmonic oscillator fed by `velocityAtTime` (`SFT_DS.dho`), or `KeyframeEase` with explicit outgoing and incoming speed and influence (`SFT_DS.bezierEase`). | Linear interpolation, default ease, springs on opacity, colour or data values |
| **AE-5 Optical stack** | Glow = three bands: Core (narrow, intense), Mid (moderate diffusion), Atmosphere (broad, soft); intensity `I₀ / n²` for n = 1, 2, 3, radius `r₀ · 3ⁿ⁻¹` (`SFT_DS.glowStack`). | One wide glow; equal intensity on every band |

Detail, allow/deny lists and the verified matchName table: [`references/ae-engine.md`](references/ae-engine.md). Maths, token table and expressions: [`references/physics-optics.md`](references/physics-optics.md).

## Rulings against the other layers

Truth, Pillar 1 intent, Pillar 3 readability and the senior editor still rank above motion parameters (SFC precedence). DS laws sit with Pillar 2 parameters and replace its defaults where they differ. AE-1..3 are correctness rules: nothing overrides them.

| Meets | Ruling |
|---|---|
| Pillar 2 stagger default (3–6 f) | Between layers DS-2 wins: 2–4 f. Pillar 2's group cap (300–400 ms) stays: a layer that hits it is reported and moves to a new beat. Units inside one title keep Pillar 3 timing. |
| 50 / 60 fps comps | The window is counted at 24–30 fps; double it (4–8 f) so the gap stays 67–167 ms. Heuristic: a brief that states frames at 60 fps beats it. |
| Pillar 2 exits (shorter, accelerate out, no spring, no stagger) | Unchanged. DS-1 bans linear and default ease on exits too; the sharp-attack, long-decel shape is for arrivals. |
| Pillar 2 symmetric tokens (75/75, 80/80) | Allowed for morphs and loops that rest at both ends, with the reason in the spec. A→B arrivals default to attack-biased curves (out influence 15–35 %, in 65–85 %). |
| Pillar 2 "linear for tickers, progress bars" | Constant-rate motion is written as an expression (`rate * time`) with a stated `MECHANICAL` reason. No linear keyframe pairs. |
| Pillar 2 guardrail: no overshoot on opacity, colour, data | `dho` refuses those properties; use a monotone curve through `bezierEase`. |
| `ME-19` unmotivated camera | The drift stays under the threshold of a readable move. A push-in the viewer can see still needs a motive. One drift direction per scene, never against the screen direction Pillar 1 set. |
| `ME-06` inflation stack | One coupled system per beat is enough. Glow goes on things that emit light (strokes, accents, screens), not on ordinary information. |
| Pillar 3 read hold | Text at rest is sharp and still: speed-driven effects fall to zero by construction; no glow pulsing on text being read. |
| `motion-foundation-core` layout delays (0 / 6 / 18 / 24 / 30 f), 18-frame staggered exits, linear M06 wipe | Entry order is kept and fed to `SFT_DS.stagger`; gaps become 2–4 f; exits follow Pillar 2; the wipe runs on tokens. Geometry comes from its `motion_plan.json`: bbox → Position `[x + w/2, y + h/2]` for a centred shape path, text measured at rest. |
| AE bridge that opens its own undo group | Do not nest: `SFT_DS.run(name, fn, false)`, lint with `--bridge`. Standalone files own the undo group. |
| Expression engine cannot find an effect by matchName | The wrapper names every control it creates `SFT …`; expressions address `effect("SFT …")(1)`. Script-assigned names are language-neutral. |
| Effect units that differ between UI and script (Glow threshold, Drop Shadow opacity) | Never set as absolute numbers; expressions scale `value`. |

## Build in After Effects

1. **Schema first.** `motion-foundation-core` edit gate passed (source audited, bbox per layer). Comp fps, size, renderer, expression engine. Unknown effect: `SFT_DS.dump(effect)` before writing a line against it.
2. **Spec rows.** element → channel → curve token or spring → frames → stagger position → secondary system and its budget.
3. **Write** against [`scripts/sft_depth_soul.jsx`](scripts/sft_depth_soul.jsx) (load with `$.evalFile`, or inline what the job needs).
4. **Lint.** `python3 scripts/es3_lint.py <file.jsx>` (add `--bridge` for bridge snippets). Exit 0 before anything runs.
5. **Run** through the user's AE bridge when one is connected, otherwise hand over the `.jsx` for File › Scripts. Never operate After Effects by clicking on his screen.
6. **Read back and look.** Keyframe ease values against the tokens, `expressionError` empty, stills at peak velocity, at the stagger landings and at settle.
7. **Report the real state:** proposed, applied to the project, rendered, or visually reviewed.

| Call | Does |
|---|---|
| `run(name, fn, ownsUndo)` | Undo group + try/catch; returns `{ ok, result, error }` |
| `prop(base, [matchNames])`, `dump(group, depth)` | matchName lookup that names the missing step; schema listing |
| `bezierEase(prop, kA, kB, curve)`, `easeAll(prop, curve)` | cubic-bezier → `KeyframeEase` with explicit speeds |
| `dho(prop, SPRINGS.X)` | Sliders + DHO expression on a keyed property |
| `stagger([layers], { seed })` | Seeded 2–4 f offsets; returns `{ offsets, capped }` |
| `glowStack(layer, { coreRadius, coreIntensity, distanceAware })` | Three-band inverse-square glow |
| `cameraDrift(cam)`, `chromaAtVelocity(target, hero)`, `shadowByDistance(layer)` | DS-3 rigs with their controls |
| `demo()` | New comp showing every law once (`scripts/demo_depth_soul.jsx`) |

## Gate

- [ ] No linear keyframe, no 0 / 33.33 % ease; every arrival names a curve token or a spring preset.
- [ ] Springs carry measured velocity (`velocityAtTime`), or keys carry explicit in and out speeds.
- [ ] No two layers land on the same frame; `stagger().capped` is empty or regrouped.
- [ ] Every moving shot has one coupled secondary system, inside its budget; still shots have none.
- [ ] Every glow is three bands with falling intensity.
- [ ] `es3_lint.py` exit 0; no display-name lookup; no index 0; one undo group per operation.
- [ ] No expression error; text sharp in its read hold; locked layers untouched.

Add to the SFC output contract: per element the curve token or spring preset with AE influence/speed, the stagger offsets in frames, the secondary system with its budget, and the lint result.

## Files

| Need | Read |
|---|---|
| ES3 allow/deny list, wrapper template, verified matchNames, bridge vs standalone | `references/ae-engine.md` |
| Token → KeyframeEase table, DHO derivation, stagger, optics, code-host translation | `references/physics-optics.md` |
| Rig library, demo, linter, maths tests | `scripts/sft_depth_soul.jsx`, `demo_depth_soul.jsx`, `es3_lint.py`, `test_depth_soul.js` |
