# Physics and optics (DS-1 to DS-3, AE-4, AE-5)

## 1. Curves as KeyframeEase (DS-1, AE-4)

A cubic-bezier `(x1, y1, x2, y2)` on the segment between two keys is two `KeyframeEase` objects. With `v_avg = Δvalue / Δt` (signed per dimension; path length for spatial properties):

```
out of key A:  influence = 100 · x1          speed = v_avg · y1 / x1
into key B:    influence = 100 · (1 − x2)    speed = v_avg · (1 − y2) / (1 − x2)
```

This is Pillar 2 §2.1 read in the other direction. `bezierEase` applies it, keeps the other side of each key, and sets one `KeyframeEase` per dimension (1 for spatial Position, 3 for Scale, 1 for Opacity). Influence is clamped to 0.1–100.

| Token | cubic-bezier | Out (influence @ speed) | In (influence @ speed) | Use |
|---|---|---|---|---|
| `EXPO_OUT_PREMIUM` | 0.16, 1, 0.3, 1 | 16 % @ 6.25× avg | 70 % @ 0 | Default arrival. Monotone: safe on opacity. |
| `PUNCHY_ENTER_15_85` | 0.15, 0, 0.15, 1 | 15 % @ 0 | 85 % @ 0 | Hero reveal (Pillar 2) |
| `M3_EMPHASIZED_DECEL` | 0.05, 0.7, 0.1, 1 | 5 % @ 14× avg | 90 % @ 0 | Hardest attack; short moves only |
| `SPRING_APPROACH` | 0.2, 0.75, 0.6, 0.7 | 20 % @ 3.75× avg | 40 % @ 0.75× avg | Arrives with velocity: always paired with `dho` |
| `M3_EMPHASIZED_ACCEL` | 0.3, 0, 0.8, 0.15 | 30 % @ 0 | 20 % @ 4.25× avg | Exits only |

All other Pillar 2 tokens convert the same way. A curve with `y` outside 0–1 overshoots; `bezierEase` refuses it on opacity and colour.

Limits: speed uses the straight distance between two spatial keys. On a curved motion path pass keys that are close together, or separate dimensions (Pillar 2 arcs).

## 2. Damped harmonic oscillator (AE-4)

After a key at time `t_k` with value `x_k`, the property continues the velocity it arrived with and settles:

```
x(t) = x_k + e^(−ζ·ω0·t) · (v0 / ωd) · sin(ωd·t)      t = time − t_k
ω0 = 2π·f        ωd = ω0·√(1 − ζ²)        v0 = velocityAtTime(t_k − frameDuration / 10)
```

`x(0) = x_k` and `x'(0) = v0`, so there is no pop at the key and the overshoot scales with how fast the element really arrived. If the key arrives at rest (`EXPO_OUT_PREMIUM`), `v0 = 0` and the spring does nothing: pair `dho` with `SPRING_APPROACH`, or with any key whose incoming speed is not zero.

Two sliders drive it: `SFT DHO Frequency` (Hz) and `SFT DHO Damping` (ζ, clamped 0.05–0.99). Pillar 2 spring presets converted with `f = √(k/m) / 2π`, `ζ = c / (2√(k·m))`:

| Preset | f (Hz) | ζ | Character |
|---|---|---|---|
| `SNAPPY_UI` | 3.18 | 0.70 | UI, quick |
| `IOS_SHEET` | 2.66 | 0.82 | Sheets, barely overshoots |
| `SAAS_CARD` | 2.76 | 0.69 | Cards, default |
| `PLAYFUL_POP` | 2.52 | 0.44 | Stickers, social hooks |
| `ELASTIC_CARTOON` | 2.14 | 0.30 | Cartoon |
| `HEAVY_CINEMATIC` | 1.07 | 0.89 | Luxury, heavy objects |

Rules: spatial properties only (position, scale, rotation). Opacity, colour, counters and chart values never get a spring (Pillar 2 guardrail); `CRITICALLY_DAMPED` is a monotone `bezierEase`. A spring settle adds time after the key: shorten the keyed approach by a third. The expression stops evaluating the spring 4 s after the key.

## 3. Overlapping action (DS-2)

- Gap between consecutive layers: 2, 3 or 4 frames, picked by a seeded hash so the pattern is repeatable and not one number. At 50/60 fps the window doubles.
- Lead order: plates and shapes, then titles, then secondary elements; Pillar 1 eye-trace can reorder (the thing the viewer must read first leads, or lands last as the payoff).
- `stagger()` shifts each layer's `startTime`, so its keys travel with it. Offsets accumulate; the Pillar 2 cap (0.4 s) clamps the total. Layers past the cap are returned in `capped`: they would land together, so give them their own beat.
- One layer alone needs no stagger. Exits are not staggered (Pillar 2).
- Characters or words inside one text layer are Pillar 3's business, not this law's.

## 4. Glow as three bands (AE-5)

| Band | n | Radius | Intensity | At 1920 px, defaults |
|---|---|---|---|---|
| Core | 1 | r₀ | I₀ | 12 px, 1.00 |
| Mid | 2 | 3·r₀ | I₀ / 4 | 36 px, 0.25 |
| Atmosphere | 3 | 9·r₀ | I₀ / 9 | 108 px, 0.11 |

Intensity samples the inverse-square curve `I₀ / n²` at three steps away from the source while the radius widens geometrically, so the bands overlap into one continuous falloff: a tight hot core, a visible body, a faint wide air. Knobs: `coreRadius` (default 0.6 % of comp width), `coreIntensity`, `spread` (3), `exponent` (2; lower only for hairline sources, where the blur already thins the energy).

The three Glow effects sit on one layer and render in series, so each band also glows the result of the one before it. For bands that are independent, put each Glow on its own duplicate of the source set to Add.

`distanceAware: true` ties the stack to the camera: intensity × (d_ref / d)², radius × (d_ref / d), both clamped to 0.25–4. `SFT Glow Ref Distance` = 0 means "the distance at the layer's in point". No camera in the comp: the values stay as set.

Glow threshold is left at the effect default. Set it by hand in the panel; its script units differ from the UI.

## 5. Secondary motion (DS-3)

**Camera drift on Z.** `d(t) = r·t + (b·r / ω)·(sin(ω·t + φ) − sin φ)`, `ω = 2π·hz`. Speed is `r·(1 + b·cos(…))`: always positive for `b < 1`, never constant. Controls on the `SFT CTRL` null: `SFT Drift Rate` (px/s toward the subject, default 0.4 % of the camera distance per second), `SFT Drift Hz` (0.12), `SFT Drift Breath` (0.3). Keep the whole shot under 2 % of the camera distance. Depth only shows if layers sit at different Z: spread plate, title and accents over at least 10 % of the camera distance.

**Chromatic aberration at peak velocity.** The rig models axial aberration: red and blue defocus (Channel Blur) while green stays sharp. Amount = `max · u²`, `u = clamp((speed − floor) / (ref − floor), 0, 1)`, speed measured in world space over one frame with `toWorld`, blue at 0.6 of red. Zero at rest, so text is sharp when it is read. Put it on an adjustment layer above the scene (a lens property) or on the hero alone. Lateral aberration (channels displaced along the motion vector) needs three copies of the hero, one channel each through Shift Channels, set to Add inside a precomp: build it only when the beat is about speed.

**Shadow by distance.** `h` = height above the ground plane (3D layers: `Ground Z − world Z`; 2D layers: scale above 100 % × `SFT Shadow 2D Lift`). Distance × (1 + h/h₀), softness × (1 + 2h/h₀), opacity ÷ (1 + (h/h₀)²). A layer that lands on the surface gets a tight dark shadow; one that floats gets a wide faint one.

## 6. Code hosts

| Law | Remotion | GSAP / HyperFrames | CSS / Motion |
|---|---|---|---|
| DS-1 curve | `Easing.bezier(0.16, 1, 0.3, 1)` | `CustomEase.create("sftExpo", "0.16,1,0.3,1")` (`expo.out` is close) | `cubic-bezier(0.16, 1, 0.3, 1)` |
| DS-1 spring | `spring({ frame, fps, config })` with a Pillar 2 preset | closed-form spring in a seek-safe tween | `spring` transition with stiffness, damping, mass |
| DS-2 | `delay = offsetFrames[i]`, seeded 2–4 f | `stagger` as a function returning `offsetFrames[i] / fps` | `transition-delay` per element |
| DS-3 drift | camera or scene `translateZ` from `d(t)` above | same, on the timeline clock | perspective parent + `translateZ` |
| DS-3 aberration | per-channel offset or blur driven by the element's speed (`three-3d-stack` postprocessing in 3D) | same | usually skipped on live UI |
| DS-3 shadow, glow | shadow offset/blur and glow intensity from depth | same | `filter: drop-shadow()` from a depth variable |

Everything stays a pure function of the frame: no wall clock, no unseeded random (Forge bridge rules in `motion-director` §3).

## 7. Tests

`node scripts/test_depth_soul.js` checks the conversion in §1, the stagger window, and runs the expression strings against mocked expression globals: the spring starts on the key value, leaves with the measured velocity, overshoots and settles; the drift is monotonic and not constant; aberration is zero at rest and capped; shadow and glow follow the inverse-square forms above. It does not exercise the After Effects object model: the first run inside After Effects is `demo_depth_soul.jsx`.
