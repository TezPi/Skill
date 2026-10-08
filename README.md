# Tezpi Motion Studio

Code-first motion graphics on the **tezpi-motion** plugin: HyperFrames films and a Remotion host
driven by one token source, with every scene-to-scene seam numerically verified.

```
motion/tokens.json ──build──▶ tokens.css · tokens.js (HyperFrames) · tokens.generated.ts (Remotion)
        │
films/<slug>/ motion-spec.md → ledger.json → seam:stamp → compositions/ → film:qa → preview → render
```

## Quickstart

```bash
npm install && npm --prefix remotion install   # cloud sessions: the SessionStart hook does this
npm run doctor                                  # every row "ok"
npm run film:new -- launch-teaser --scenes hook:3,demo:5,cta:3 --arrival
npm run film:qa -- launch-teaser                # fails motion_frozen until each scene has a route
```

Then ask Claude for the edit — e.g. *"In launch-teaser, make the demo scene cursor-led: the click
on Export ignites a progress run, stillness, then the result."* `CLAUDE.md` routes it through
motion-forge → motion-doctrine → the technique skills.

## Reference film — `films/tezpi-sting`

8.1s · 1920×1080 · 30fps. Waterfall entry with fragment climax → nudge curve with burst reveal →
cut-the-curve LEFT → oversized cursor whose click ignites a progress run → 0.45s stillness →
result → inverse-zoom arrival → end card.

| Gate | Result |
| --- | --- |
| `hyperframes check --strict` | 0 lint · 0 runtime · 0 layout (9 samples) · 0 motion · 25/25 WCAG AA |
| Seam Gate | 2/2 seams PASS · speed-match 0.82 / 1.12 · zero overlap · Z sign clean |
| Remotion port | 243 frames, frame-parity with the HyperFrames render at every seam |
| Ease Rosetta | 15/15 GSAP eases reproduced in Remotion (exact; `expo.out` within 0.8%) |

## Layout

| Path | |
| --- | --- |
| `CLAUDE.md` | Session contract: skill load order, authoring order, non-negotiables |
| `motion/` | Tokens (source + dist) and `hf/tezpi-motion.js` primitives (`window.TZM`) |
| `films/` | HyperFrames films, one folder each, self-contained (`vendor/` snapshot) |
| `remotion/` | Remotion host: `src/motion` (eases, `<SeamScene>`, primitives) + film ports |
| `tools/` | `new-film`, `film-qa`, `seam` (stamp/gate/probe), `build-tokens`, `sync-film`, `doctor` |
| `tools/tezpi/` | Vendored Seam Gate scripts (Apache-2.0, see `NOTICE.md`) |

Brand values in `motion/tokens.json` are placeholders — swap in a real palette/typeface and
re-run `npm run tokens && npm run film:sync && npm run film:qa -- <slug>`.
