---
name: universal-shape-and-motion-graph-architecture
description: >
  Master architectural skill for procedural vector shape construction (After Effects Shape Layers,
  Lottie JSON, Rive, Cavalry, SVG/CSS) and mathematically grounded motion graphs (Speed Graph,
  Value Graph, Influence % to Cubic-Bezier conversion, Spring Physics, Inertial Bounce, and
  Cross-Domain Choreography). ALWAYS load and enforce this skill BEFORE planning, writing,
  scripting, or reviewing any motion graphics, video edit, Remotion composition, Lottie animation,
  UI transition, kinetic typography, or After Effects expression.
---

# Universal Shape & Motion Graph Architecture Skill

Code syntax or drawing capability is never the bottleneck in AI-generated video and motion graphics — **structural vector hierarchy and mathematical motion craft are**. Untrained generation produces the unmistakable "generic AI-slop" look: off-axis rotations from broken anchor points, linear interpolation (`linear`), weak default easing (`Easy Ease 33.3%`), lonely single-property opacity fades, simultaneous entrances, unmasked boolean glitches, and hallucinated timing. This skill enforces deterministic, numerically grounded rules across **Architecture 1 (Shape Construction)** and **Architecture 2 (Motion Graph & Physics)**.

---

## 10 Non-Negotiable Golden Laws (Apply to EVERY Prompt & Composition)

1. **The Professional Rule of Zero (Dual-Transform Alignment):** Every vector shape lives inside a Dual-Transform hierarchy (`Layer Transform` for macro movement vs. `Group Transform` for micro movement and localized `Skew`/`Skew Axis`). ALWAYS initialize `Group Transform Position` and parametric shape `Position` to `[0, 0]` before animating or applying `Repeater`/`Duplicator`.
2. **Bottom-to-Top Render Stack Discipline:** Inside any Shape Layer `Contents` or Lottie `gr.it` array, evaluation flows from bottom to top. Path modifiers (`Trim`, `Repeater`, `Merge`, `Offset`, `Round Corners`) affect ONLY elements stacked ABOVE them. ALWAYS keep `Fill` (`'fl'`) and `Stroke` (`'st'`) at the very bottom of the group stack (directly above `Group Transform` `'tr'`).
3. **NEVER Use Linear Interpolation or Default 33% Ease for Primary Motion:** Every `interpolate()`, CSS transition, Lottie keyframe, or AE keyframe MUST use a named high-contrast `cubic-bezier(x1, y1, x2, y2)` token (75/75, 80/80, 15/85, M3 Emphasized) or a physics-based `spring()`. Reserve `linear` strictly for constant-speed tickers, progress bars, or pre-impact ball drops. Always set `extrapolateLeft: "clamp"` and `extrapolateRight: "clamp"`.
4. **Multi-Property Entrances & The Scale Floor Rule:** A lone opacity fade is forbidden. Every entrance MUST combine 2–4 properties simultaneously: `opacity (0 -> 1)` + `translateY (12px..32px -> 0)` + `scale (0.92..0.95 -> 1.00)` (+ optional `blur(8px -> 0px)`). NEVER scale UI or graphic cards up from `scale(0)` — always start from `scale >= 0.90` (unless creating a geometric particle pop from nothing).
5. **Separate Dimensions for Spatial Arcs:** Never move an element diagonally with identical X and Y easing (which creates a robotic straight line with 0% arc bow). Split `Position` into independent `X` and `Y` channels and pair an `Ease-In` curve on one axis with an `Ease-Out` curve on the other to generate a 31%–44% natural spatial arc.
6. **Spring Regime Separation (Spatial vs. Effects & Data Guardrail):**
   - **Spatial properties** (`x`, `y`, `scale`, `rotation`, `borderRadius`) may use underdamped springs (`0.60 <= zeta <= 0.85`, Overshoot `1.1%–10%`).
   - **Effects properties** (`opacity`, `color`, `backgroundColor`) and **Data Visualization axes** (bar heights, line chart values, counters) MUST NEVER overshoot (`zeta = 1.00` Critically Damped or monotonic `cubic-bezier` with `y1 <= 1, y2 <= 1`).
7. **Enter/Exit Asymmetry (1.5:1 Ratio & Property Reduction):** Exits must be 30%–50% faster than entrances (e.g., Enter `300ms / 18f`, Exit `200ms / 12f` at 60fps; or Enter `20f`, Exit `10f` at 30fps). Exits must use acceleration easing (`80/20` or `cubic-bezier(0.3, 0, 0.8, 0.15)`), animate fewer properties, and NEVER use spring overshoot or stagger.
8. **Bounded Stagger Choreography:** Nothing enters simultaneously. Offset lists, words, cards, and rays by `3–6 frames` (`30ms–60ms`), or use decelerating stagger `delay(i) = Math.min(Math.pow(i, 1.5) * 15, 350)` (in ms). Cap total stagger delay across the entire group at `300ms–400ms` (`10–12 frames` at 30fps).
9. **Five-Layer Atmospheric Stack & Idle Breathing:** Never render over a flat, dead solid background. Build scenes from bottom to top: `(1) Drifting Background Mesh/Gradient` -> `(2) Media Assets (Ken Burns 1->1.08 on stills, OffthreadVideo on clips)` -> `(3) Procedural Vector Shapes & Typography` -> `(4) Color Grade` -> `(5) Film Grain + Vignette`. Any element on screen for `>2 seconds (60f @ 30fps)` must receive sine-wave micro-motion (`±3px` Y or `±1deg` rotation).
10. **FPS-Derived Math & Mandatory Frame Verification:** Derive all frame timings dynamically from `fps` (`Math.round(seconds * fps)`). Before final delivery in code-driven engines, extract still frames at key beats (e.g., frames `15, 45, 90, 150`) and verify layout, contrast, safe zones, and clamping.

---

## Architecture 1: Procedural Shape Construction & Modifier Blueprint

### 1.1. Parametric vs. Bezier Selection Protocol
- **Use Parametric Shapes first** for lightweight data and clean procedural animation:
  - `Rectangle` (AE: `ADBE Vector Shape - Rect`, Lottie `ty: 'rc'`): Properties `s` `[width, height]`, `p` `[0,0]`, `r` (Roundness). For pill shapes, set `r = height / 2`. Note: In Lottie Web, `rc` defaults to reversed direction if `d` is omitted; explicitly set `d: 1` (clockwise from top-right) or `d: 3` (reversed).
  - `Ellipse` (AE: `ADBE Vector Shape - Ellipse`, Lottie `ty: 'el'`): Properties `s` `[width, height]`, `p` `[0,0]`. Draws from top quadrant (12 o'clock) clockwise using `ELLIPSE_CONSTANT = 0.5519` (`tangent = radius * 0.5519`).
  - `Polystar` (AE: `ADBE Vector Shape - Star`, Lottie `ty: 'sr'`): Properties `sy` (`1` = Star, `2` = Polygon), `pt` (Points), `p` `[0,0]`, `r` (Rotation), `or` (Outer Radius), `ir` (Inner Radius), `os` (Outer Roundness %), `is` (Inner Roundness %).
- **Use Bezier Paths (`ADBE Vector Shape - Group`, Lottie `ty: 'sh'`)** only for custom organic silhouettes or shape morphing:
  - Defined by `ks`: `{ v: [[x,y],...], i: [[dx,dy],...], o: [[dx,dy],...], c: true|false }`. Arrays `v`, `i`, and `o` MUST have identical lengths.
  - **The Two Laws of Morphing:** (1) Synchronize the **First Vertex (`index 0`)** to the same spatial quadrant on both source and target paths; (2) Enforce **Equal Vertex Count** (`v_source.length === v_target.length`) before interpolating.

### 1.2. Canonical Modifier Stack Patterns
Always assemble modifiers in these exact top-to-bottom hierarchies inside a `Group` (`'gr'`):

#### Pattern A: Multi-Layered Write-On Accent / Line Chart (`Trim Paths` `'tm'`)
- **Stack Order (Top to Bottom):**
  1. `Path` (`'sh'`) or `Ellipse` (`'el'`) or `Rectangle` (`'rc'`) with `d: 1`.
  2. `Trim Paths` (`'tm'`):
     - `s` (Start %): Animate `0 -> 100` (lagging by `4–8 frames`) for a traveling laser/comet pulse, or keep at `0` for a persistent chart line.
     - `e` (End %): Animate `0 -> 100` (leading) using `punchy-enter-15-85` `cubic-bezier(0.15, 0, 0.15, 1)`.
     - `o` (Offset degrees): Animate `0deg -> 180deg` simultaneously to inject rotational momentum into circular loaders.
     - `m` (Trim Multiple Shapes): `1` (Simultaneous / Synced) or `2` (Individually / Sequential).
  3. `Stroke` (`'st'`): `lc: 2` (Round Cap), `lj: 2` (Round Join), `w` (Width).
  4. `Group Transform` (`'tr'`): `p: [0,0]`.

#### Pattern B: Generative Radial Burst & 2D Matrix (`Repeater` `'rp'` + `Wiggle Transform`)
- **Prerequisite:** Group Transform `Position` MUST be `[0,0]`. Offset the child shape's local `Position` (e.g., `[0, -120]`) or `Group Anchor Point` `[0, 120]` to define the radius of a radial burst.
- **Radial Burst Config:** `Copies (c) = N` (e.g., `8` or `12`), `Repeater Transform Position = [0, 0]`, `Repeater Transform Rotation = 360 / N` (e.g., `45deg` or `30deg`).
- **2D Grid Matrix Config (Chained Repeaters):**
  - `Repeater 1` (Horizontal Row): `Copies = Cols`, `Transform.Position = [colSpacing, 0]`.
  - `Repeater 2` (Vertical Grid, placed BELOW Repeater 1): `Copies = Rows`, `Transform.Position = [0, rowSpacing]`.
- **Localized Particle Chaos:** Place `Wiggle Transform` (`ADBE Vector Filter - Wiggler`) immediately BELOW `Repeater` with `Correlation = 0%` and `Wiggles/Second = 1.5–3.0` so every clone jitters and rotates independently.
- **Paint Order Rule:** Place `Repeater` ABOVE `Gradient Fill` to span a single gradient across all clones; place `Repeater` BELOW `Fill` to repeat the individual fill per clone.

#### Pattern C: Single-Layer Boolean Masking (The School of Motion Nested `Merge Paths` `'mm'` Pattern)
To mask a child graphic (or a `Repeater` stripe array) inside a parent silhouette WITHOUT using multiple layers, Alpha Mattes, or Pre-comps:
- **Parent Group (`"Masked_Element"`):**
  1. `Base Mask Path` (Copy of the parent container path, e.g., Eye or Vase silhouette — NO Fill/Stroke above it).
  2. `Child Design Subgroup` (`'gr'`):
     - `Design Path` (e.g., Stripe or Pupil).
     - `Repeater` (`'rp'`) *(if repeating stripes)*.
     - `Merge Paths` (`'mm'` with `mm: 2` = **Add**) *(MANDATORY if a Repeater is used: collapses all repeated clones into a single compound path so the outer Intersect does not vanish)*.
     - `Subgroup Transform` (`'tr'` — animate `Position` here to move the masked design freely inside the mask!).
  3. `Merge Paths` (`'mm'` with `mm: 4` = **Intersect**).
  4. `Fill` (`'fl'` — color of the masked design).
  5. `Parent Group Transform` (`'tr'`).
- *Constraint:* Do NOT use `Merge Paths (Intersect)` on un-filled `Stroke` paths, as Boolean intersection automatically closes the stroke loop along the mask boundary.

#### Pattern D: Liquid / Metaball Geometry (`Merge Paths` + `Offset Paths` `'op'` + `Round Corners` `'rd'`)
- **Stack Order (Top to Bottom):**
  1. `Shape Path A` + `Shape Path B` (moving toward or separating from each other).
  2. `Merge Paths` (`mm: 2` = **Add**).
  3. `Offset Paths 1` (`'op'`): `Amount (a) = +18`, `Line Join (lj) = 2` (Round Join).
  4. `Offset Paths 2` (`'op'`): `Amount (a) = -18`, `Line Join (lj) = 2` (Round Join) *(or `Round Corners` `'rd'` with `Radius (r) = 36`)*.
  5. `Fill` (`'fl'`).

---

## Architecture 2: Motion Graph, Velocity & Physics Blueprint

### 2.1. Speed Graph Influence % to `cubic-bezier(x1, y1, x2, y2)` Conversion Formula
Given keyframe interval `dt = t2 - t1`, value change `dV = |V2 - V1|`, and average speed `v_avg = dV / dt`:
- `x1 = out_influence / 100`
- `y1 = x1 * (out_speed / v_avg)`
- `x2 = 1 - (in_influence / 100)`
- `y2 = 1 - (in_influence / 100) * (in_speed / v_avg)`
For standard zero-velocity resting endpoints (`out_speed = 0`, `in_speed = 0`):
- **`cubic-bezier(Out_Inf / 100, 0, 1 - In_Inf / 100, 1)`**

### 2.2. Required Easing Decision Matrix
Select the exact curve based on motion intent:
- **Entering Viewport / User-Triggered Reveal (Fast Launch, Long Soft Landing):**
  - Default Snappy Reveal (`AE 15/85`): `cubic-bezier(0.15, 0.00, 0.15, 1.00)` (`V_peak = 2.80x` at `t=0.12`).
  - Explosive Impact Reveal (`AE 10/90`): `cubic-bezier(0.10, 0.00, 0.10, 1.00)` (`V_peak = 3.33x` at `t=0.07`).
  - Apple iOS Sheet / Drawer (`AE 32/100`): `cubic-bezier(0.32, 0.72, 0.00, 1.00)` (`V_peak = 4.22x` at `t=0.16`).
  - Material 3 Emphasized Decelerate: `cubic-bezier(0.05, 0.70, 0.10, 1.00)` (`V_peak = 14.00x` at `t=0.00`).
- **Moving / Morphing On-Screen (Accelerate then Decelerate S-Curve):**
  - Pro Standard Motion (`AE 75/75`): `cubic-bezier(0.75, 0.00, 0.25, 1.00)` (`V_peak = 4.00x` at `t=0.50`).
  - High-Contrast Mograph (`AE 80/80`): `cubic-bezier(0.80, 0.00, 0.20, 1.00)` (`V_peak = 5.00x` at `t=0.50`).
  - Extreme Whip / Kinetic Snap (`AE 90/90`): `cubic-bezier(0.90, 0.00, 0.10, 1.00)` (`V_peak = 10.00x` at `t=0.50`).
- **Exiting Viewport Permanently (Build Momentum to Peak Cut):**
  - Fast Exit (`AE 80/20`): `cubic-bezier(0.80, 0.00, 0.80, 1.00)` (`V_peak = 2.50x` at `t=0.83`).
  - Material 3 Emphasized Accelerate: `cubic-bezier(0.30, 0.00, 0.80, 0.15)` (`V_peak = 4.25x` at `t=1.00`).
- **Value Graph Single-Curve Overshoot & Anticipation (1D or Separated X/Y only):**
  - Spring Overshoot (`EaseOutBack`, `+9.8%` overshoot): `cubic-bezier(0.34, 1.56, 0.64, 1.00)`.
  - Anticipation Pull-Back (`EaseInBack`, `-9.8%` wind-up): `cubic-bezier(0.36, 0.00, 0.66, -0.56)`.
  - Full Cartoon Arc (`EaseInOutBack`, `±10.5%`): `cubic-bezier(0.68, -0.60, 0.32, 1.60)`.

### 2.3. 2D Spatial Arc Pairing Rules (Separate Dimensions)
When moving an object diagonally from `(x0, y0)` to `(x1, y1)`, interpolate `x` and `y` with distinct curves:
- **Natural Quarter-Circle Arc (31.4% Bow):** `X = cubic-bezier(0.47, 0, 0.745, 0.715)` (`easeInSine`), `Y = cubic-bezier(0.39, 0.575, 0.565, 1)` (`easeOutSine`).
- **Pronounced Parabolic Arc (36.5% Bow):** `X = cubic-bezier(0.55, 0.085, 0.68, 0.53)` (`easeInQuad`), `Y = cubic-bezier(0.25, 0.46, 0.45, 0.94)` (`easeOutQuad`).
- **Deep Pendulum Swoop (44.4% Bow):** `X = cubic-bezier(0.20, 0, 0.20, 1)` (`20/80`), `Y = cubic-bezier(0.80, 0, 0.80, 1)` (`80/20`).
- **J-Curve Hook Trajectory (66.6% Bow):** `X = cubic-bezier(0.85, 0, 0.85, 1)` (`85/15`), `Y = cubic-bezier(0.34, 1.56, 0.64, 1)` (`easeOutBack`).

### 2.4. Spring Physics Presets & Conversion Formulas
To convert Apple/Emil `(duration, bounce)` to physical `(mass = 1, stiffness, damping)`:
- `stiffness = Math.pow((2 * Math.PI) / duration, 2)`
- `dampingRatio = 1 - bounce`
- `damping = 2 * dampingRatio * Math.sqrt(stiffness * mass)`

Use ONLY these verified Spring Presets (never use raw default `k=100, c=10` unless a 16.3% bouncy 950ms wobble is explicitly desired):
1. `SPRING_SNAPPY_UI`: `{ mass: 1.0, stiffness: 400, damping: 28.0 }` (`zeta = 0.70`, Overshoot `4.6%`, Settle `353ms` / `11f @ 30fps`) — Micro-interactions, captions, buttons.
2. `SPRING_IOS_SHEET`: `{ mass: 1.0, stiffness: 280, damping: 27.4 }` (`zeta = 0.82`, Overshoot `1.1%`, Settle `377ms` / `12f @ 30fps`) — Modals, drawers, panels.
3. `SPRING_SAAS_CARD`: `{ mass: 1.0, stiffness: 300, damping: 24.0 }` (`zeta = 0.69`, Overshoot `4.9%`, Settle `411ms` / `13f @ 30fps`) — Hero UI cards, feature blocks.
4. `SPRING_CRITICALLY_DAMPED`: `{ mass: 1.0, stiffness: 200, damping: 28.3 }` (`zeta = 1.00`, Overshoot `0.0%`, Settle `612ms` / `19f @ 30fps`) — Data visualization bars, opacity/color effects, finance charts.
5. `SPRING_PLAYFUL_POP`: `{ mass: 1.0, stiffness: 250, damping: 14.0 }` (`zeta = 0.44`, Overshoot `21.2%`, Settle `673ms` / `21f @ 30fps`) — Stickers, badges, kids/social hooks.
6. `SPRING_LUXURY_HEAVY`: `{ mass: 2.0, stiffness: 90, damping: 24.0 }` (`zeta = 0.89`, Overshoot `0.2%`, Settle `902ms` / `28f @ 30fps`) — Cinematic titles, luxury brand reveals.

### 2.5. After Effects Expressions Library (Copy-Paste Ready)

#### A. Inertial Bounce / Harmonic Overshoot (Swings past target & settles; requires Incoming Velocity > 0)
```javascript
var springiness = 1.0; // 1.0 = match arrival speed, 0.5 = half amplitude
var wobbles = 2.5;     // oscillations per second (Hz)
var settle = 6.0;      // exponential decay damping (5 to 8)
var k = numKeys > 0 ? nearestKey(time).index : 0;
if (k > 0 && key(k).time > time) k -= 1;
var result = value;
if (k > 0) {
  var elapsed = time - key(k).time;
  var arrival = velocityAtTime(key(k).time - thisComp.frameDuration / 4);
  var w = Math.max(wobbles, 0.1) * 2 * Math.PI;
  var fade = Math.exp(-settle * elapsed);
  result = value + arrival * springiness * Math.sin(w * elapsed) * fade / w;
}
result;
```

#### B. Parabolic Floor Bounce (Stops at target & rebounds away; never crosses target)
```javascript
var elasticity = 0.65; // 0.3 = heavy thud, 0.75 = rubber ball
var gravity = 3500;    // px/s^2 for Position (scale down to 150-300 for Scale/Rotation)
var maxBounces = 4;
var k = numKeys > 0 ? nearestKey(time).index : 0;
if (k > 0 && key(k).time > time) k -= 1;
var result = value;
if (k > 0) {
  var elapsed = time - key(k).time;
  var v = velocityAtTime(key(k).time - thisComp.frameDuration / 4);
  var isArray = v instanceof Array;
  var arrivalSpeed = isArray ? length(v) : Math.abs(v);
  var e = Math.min(Math.max(elasticity, 0.01), 0.99);
  var g = Math.max(gravity, 1);
  var bounces = Math.max(Math.round(maxBounces), 0);
  var s0 = arrivalSpeed * e;
  var d0 = (2 * s0) / g;
  var total = d0 * (1 - Math.pow(e, bounces)) / (1 - e);
  if (arrivalSpeed > 0 && elapsed < total) {
    var n = Math.floor(Math.log(1 - (elapsed * (1 - e)) / d0) / Math.log(e));
    var start = d0 * (1 - Math.pow(e, n)) / (1 - e);
    var s = s0 * Math.pow(e, n);
    var dt = elapsed - start;
    var lift = s * dt - 0.5 * g * dt * dt;
    var away = isArray ? mul(normalize(v), -1) : (v > 0 ? -1 : 1);
    result = value + mul(away, lift);
  }
}
result;
```

#### C. Squash & Stretch with Exact Area/Volume Conservation (`x * y = 10000`)
```javascript
var maxDev = 12;   // max scale deviation % (use 2-4 for UI, 12-20 for cartoon)
var spd = 28;      // oscillation speed (radians/sec)
var decay = 5.0;   // damping rate
var t = Math.max(time - inPoint, 0);
var x = scale[0] + maxDev * Math.sin(spd * t) / Math.exp(decay * t);
var y = (scale[0] * scale[1]) / Math.max(x, 1);
[x, y];
```

---

## Pre-Delivery Audit Checklist (Mandatory Self-Check)

Before outputting any code, script, or motion specification, verify:
- [ ] Are all `Group Transform` and parametric shape `Position` coordinates initialized to `[0, 0]` before applying `Repeater` or `Rotation`?
- [ ] Are `Fill` and `Stroke` placed at the bottom of their respective shape groups?
- [ ] If a `Repeater` is masked inside a `Merge Paths (Intersect)` group, is there an inner `Merge Paths (Add)` immediately below the `Repeater`?
- [ ] Has every `linear` or `33.3% Easy Ease` on primary motion been replaced with an explicit `cubic-bezier` token or verified `spring()` preset with clamping?
- [ ] Do all entrances combine at least 2–3 properties (`opacity` + `translate` + `scale >= 0.90`) and are exits 30%–50% faster with zero overshoot?
- [ ] Are diagonal movements separated into independent `X` and `Y` easing curves to form a spatial arc?
- [ ] Are data visualization bars/lines strictly constrained to non-overshooting curves (`zeta = 1.0` or monotonic bezier)?
- [ ] Is the scene rhythm aligned with `HIT -> Hold (15-20f) -> Build -> HIT`, with motion in the first 15 frames and `<= 3` simultaneous animations on screen?
