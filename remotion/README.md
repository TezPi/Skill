# remotion/ — Remotion host

Host for shots motion-forge §4 routes to Remotion: GPU effects, true motion blur, R3F / maps /
Skia / Rive, zod-typed data-driven batch, `<Player>` embeds.

| Path | What |
| --- | --- |
| `src/motion/tokens.generated.ts` | Generated from `../motion/tokens.json` (`npm run tokens` at the root). Never edit. |
| `src/motion/eases.ts` | GSAP-name → Remotion easing (motion-forge §6 Rosetta). `npm run eases:verify` checks it against GSAP. |
| `src/motion/seam.tsx` | `<SeamScene>` — doctrine seams inside a `<Series>` (cut-the-curve, zoom-through, inverse-zoom), curves mirror `seam-stamp`. |
| `src/motion/primitives.ts` | `waterfallSchedule` + `arrival`, `nudge`, `tipTo` / `pressScale` / `cursorPx`, `tween`. |
| `src/films/tezpi-sting/` | Port of `films/tezpi-sting` — frame-parity reference. |

```bash
npm run dev            # Remotion Studio
npm run typecheck      # tsc --strict
npm run eases:verify   # Rosetta vs GSAP
npx remotion still src/index.ts TezpiSting out/f177.png --frame=177 --browser-executable="$(npx hyperframes browser path)"
npx remotion render src/index.ts TezpiSting out/tezpi-sting.mp4 --browser-executable="$(npx hyperframes browser path)" --gl=swangle
```

Seams: scenes in `<Series>` (hard cuts, zero overlap), each wrapped in `<SeamScene>` with an
inline `durationInFrames` equal to its sequence. `<TransitionSeries>` presentations overlap
scenes (crossfade-class) — chapter breaks only.

Bridges to HyperFrames (motion-forge §7): B1 `npx remotion add @remotion/gsap` to run GSAP
choreography here; B2/B3 alpha WebM handoff in either direction.
