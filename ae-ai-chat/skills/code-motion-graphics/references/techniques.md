# Techniques

Snippets assume the ENGINE helpers from `assets/template.html` (`spring`, `chain`, `seg`, `expoOut`, `bezier`, `hash`, `clamp`, `lerp`) and a 2D `ctx`. All are pure functions of `t`.

## Motion primitives

```js
// Masked line rise: text rises through a clip line. Stagger lines/letters by 2-4 frames.
function maskRise(text, x, y, size, t0, t) {
  const p = spring(t - t0, 22, 1);
  ctx.save(); ctx.beginPath(); ctx.rect(x - 2000, y - size * 1.1, 4000, size * 1.35); ctx.clip();
  ctx.fillText(text, x, y + (1 - p) * size * 1.2); ctx.restore();
}

// Liquid tab indicator / stretchy toggle: each edge on its own spring, leading edge faster.
function indicator(t, keys /* [[time, left, right], ...] */) {
  const L = chain(t, keys.map(k => [k[0], k[1]]), 26, 0.9);
  const R = chain(t, keys.map(k => [k[0] + 0.04, k[2]]), 18, 0.9); // trailing edge lags 40 ms
  return [Math.min(L, R), Math.max(L, R)];
}

// Drag release: critically damped spring that starts from the release position AND velocity.
function release(t, tr, x0, v0, target, w = 20) {          // tr = release time
  if (t <= tr) return x0;
  const s = t - tr, e = x0 - target;
  return target + (e + (v0 + w * e) * s) * Math.exp(-w * s);
}

// Iris open/close eased by AREA, not radius (radius easing jumps on the first frames).
const iris = (p, R) => R * Math.sqrt(expoOut(p));

// Typing from time with a human rhythm (seeded per-key delays).
function typed(str, t0, t, cps = 14) {
  let acc = t0, n = 0;
  for (let i = 0; i < str.length; i++) { acc += (0.6 + 0.8 * hash(i, 7)) / cps; if (t >= acc) n = i + 1; }
  const idle = n === str.length || t < t0;
  return str.slice(0, n) + ((idle ? Math.floor(t * 2) % 2 === 0 : true) ? '|' : ' ');
}

// Counters read the FRAME time, not the sub-frame time, or digits smear under motion blur.
const frameTime = t => Math.floor(t * FPS + 0.5) / FPS;

// Arrive fast, land soft, as an explicit per-frame fraction (12-19 % of the remaining distance per frame):
const approach = (from, to, frames, k = 0.15) => to + (from - to) * Math.pow(1 - k, frames);
```

## Signature effects

**Hard-edged colour flood** (instead of crossfades): clip to the shape, draw a circle from the click point growing with `expoOut`; once it covers the frame, swap to a full-frame rect (a huge flood circle still covers the screen after sliding).

**Goo split / merge** (pills splitting into results, orb merging): draw the blobs on an offscreen canvas with `ctx.filter = 'blur(14px)'`, then threshold alpha. DOM/SVG version:
```html
<filter id="goo"><feGaussianBlur stdDeviation="12"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 22 -10"/></filter>
```

**Glass panel** (iOS-style): pre-blur the background once into an offscreen canvas; per frame clip to the panel shape, draw the blurred copy, then a tint fill (white 8-14 %), then a 1 px gradient rim (top-left light -> bottom-right transparent), then a shadow that grows with the panel's height.

**Real glyph paths** (type as architecture): load the embedded font with opentype.js, `font.getPaths(text, x, y, size)` -> `new Path2D(path.toPathData())` per glyph. Rotate/translate whole glyphs analytically; keep counters (use `evenodd` fill). Never morph unrelated glyph outlines point-to-point; cover the swap with occlusion or matched edges.

**Mask reveal through the outgoing word:** draw the outgoing word's glyph paths as a clip, scale the clip up past the frame with `expoIn`, draw the incoming scene inside it.

**Print misregistration** (accent frames only): redraw the type layer twice at +-2-4 px in the two accent inks at 40 % opacity for 2-3 frames.

**Pencil / ink on paper:** resample each polyline every ~6 px, offset points along the normal by `sin(i*0.7 + phase)*amp` with `phase = Math.floor(t*8)` (the line "boils" 8x/s), stroke twice (full width 90 % alpha, half width 40 % with more wobble), knock out paper tooth with a seeded noise texture, composite with `multiply`. Fills = hatching: clip to the shape, draw parallel lines at 45 deg, reveal them one by one over time.

**Halftone / manga:** sample luminance on a grid (rotated 15-45 deg), draw dots with radius proportional to darkness; posterise to 2-3 inks.

**Hand-drawn hold "on twos":** animate pose parameters smoothly, then quantise time `tq = Math.floor(t*12)/12` for the drawing only, keep camera on full time.

**Orthographic 3D box in 2D:** render each face to its own offscreen canvas, draw it with `ctx.setTransform(a,b,c,d,e,f)` from the projected corners, shade by the face normal's dot with a light vector.

**2.5D parallax from a still:** estimate depth (Depth Anything), split into 3-6 depth layers with feathered masks, move a pinhole camera; layer offset = camera shift x focal / depth.

**Morphing a persistent element through states:** keep a single state table `[[beat, w, h, r, colour, content]]`; derive every property with `chain()`; content swaps on their own windows (enter after container starts moving, exit before next move).

## Render-side finishing (numpy, per frame)

```python
import numpy as np
def finish(img, f, seed=7):                       # img float32 HxWx3 in 0..1, f = frame index
    h, w, _ = img.shape
    rng = np.random.default_rng(seed * 100003 + f)          # fresh but reproducible grain per frame
    img = img + rng.normal(0, 0.018, (h, w, 1)).astype(np.float32)
    yy, xx = np.mgrid[0:h, 0:w]; r = np.hypot((xx - w/2)/(w/2), (yy - h/2)/(h/2))
    img *= (1 - 0.35 * np.clip(r - 0.4, 0, 1)**1.5)[..., None]   # ~0.65x at the corners
    lum = img.mean(2, keepdims=True); glow = np.clip(lum - 0.8, 0, 1) * np.array([1, .45, .25], np.float32)
    img += 0.15 * glow                                               # cheap halation tint on bright edges
    img[..., 0] = np.roll(img[..., 0], 1, axis=1); img[:, 0, 0] = img[:, 1, 0]   # 1 px chroma fringe, edge-clamped
    return np.clip(img, 0, 1)
```

## Audio

Beat grid:
```python
import librosa, numpy as np            # pip install librosa (fallback: onset envelope + autocorrelation in numpy)
y, sr = librosa.load('song.wav', sr=None, mono=True)
tempo, beats = librosa.beat.beat_track(y=y, sr=sr, units='time')
onset = librosa.onset.onset_strength(y=y, sr=sr)                # find the drop: biggest sustained energy rise
# verify the downbeat by ear/eye; place the song so its drop lands on the planned beat
```

Synthesised SFX placed on exact frames:
```python
import numpy as np, wave
SR = 48000; D = 14.0; mix = np.zeros(int(SR * D))
def put(sig, t, gain=1.0):
    i = int(t * SR); n = min(len(sig), len(mix) - i); mix[i:i+n] += gain * sig[:n]
env = lambda n, k: np.exp(-np.arange(n) / (SR * k))
def kick():  n = int(.35*SR); f = 50 + 120*env(n, .03); return np.sin(2*np.pi*np.cumsum(f)/SR) * env(n, .12)
def click(): n = int(.02*SR); return np.random.default_rng(1).normal(0, 1, n) * env(n, .003)
def tick(hz=2400): n = int(.12*SR); return np.sin(2*np.pi*hz*np.arange(n)/SR) * env(n, .03)
for t in [0.5, 1.0, 2.5]: put(click(), t - 0.002, 0.4)          # transient peak ON the action frame
put(kick(), 7.0, 0.9)
pcm = (np.clip(mix / max(1e-9, np.abs(mix).max()) * 0.8, -1, 1) * 32767).astype(np.int16)
with wave.open('sfx.wav', 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
```
Master: `ffmpeg -i mix.wav -af loudnorm=I=-14:TP=-2:LRA=11 master.wav`, mux with `render.mjs --audio master.wav`, then re-measure the AAC output with `ffmpeg -i out.mp4 -af ebur128 -f null -`.
