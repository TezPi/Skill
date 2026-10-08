# Tezpi Motion Studio — session contract

Code-first motion graphics. Every motion decision routes through the **tezpi-motion** plugin;
HyperFrames and Remotion are the engines it drives. This file decides *which skill when*, and
the rules that hold in this repo. The skills hold the depth — load them, don't paraphrase them.

## 1. Load order (every motion / video request)

1. **`tezpi-motion:motion-forge`** — plan once: intent → behavioral insight → engine-neutral
   spec → host engine per shot (§4) → bridges (§7) → gates (§10).
2. **`tezpi-motion:motion-doctrine`** — gateway before composing anything: vector law, the
   current, carriers, causal motion, Seam Gate, no idle wobble, stillness before climax.
3. Technique skills, on demand:

| Building… | Load |
| --- | --- |
| any seam, text handoff, kinetic entry, group slide | `tezpi-motion:cut-the-curve` |
| master timeline / white flash at a cut | `tezpi-motion:seam-craft` |
| cursor, click-ignited beat, a scene that reads static | `tezpi-motion:oversized-cursor` |
| captions / subtitles / layout that will carry them | `tezpi-motion:captions-overlay` |

4. Engine skills:
   - **HyperFrames host** → `hyperframes` (entry/routing), `hyperframes-core` (composition
     contract — read before writing HTML), `hyperframes-cli`, `hyperframes-registry` (search
     before hand-building: `npx hyperframes catalog --query "<beat in English>"`),
     `hyperframes-animation` / `-keyframes` / `-creative` / `-audio`, `media-use`.
     If not listed as skills, they are on disk at `~/.claude/skills/<name>/SKILL.md`.
   - **Remotion host** → `remotion:remotion-best-practices` (router) + `remotion/src/motion`.

**Precedence:** tezpi-motion doctrine > HyperFrames/Remotion motion advice. Engine skills own
their contracts (composition structure, CLI, registry, media, audio, rendering).
Workflow skills (`/product-launch-video`, `/embedded-captions`, …) install on demand:
`npx --yes hyperframes@0.8.141 skills update <workflow>`.

## 2. Workspace map

| Path | Role |
| --- | --- |
| `motion/tokens.json` | **Single source** for brand + motion numbers (doctrine values verbatim). |
| `motion/hf/tezpi-motion.js` | `window.TZM` — HF doctrine primitives: `waterfallEntry`, `waterfallCut`, `nudge`, `cursorEnter` / `click` / `cursorDrift` / `cursorExit`, `tipTo`, `rackFocus`. Each returns its end time. |
| `films/<slug>/` | One HyperFrames film: `motion-spec.md` → `ledger.json` → `index.html` (slots + stamped seams only) → `compositions/<scene>.html` → `index.motion.json` → `vendor/` (synced snapshot). |
| `films/tezpi-sting/` | **Reference film** — passes every gate. Copy its patterns. |
| `remotion/src/motion/` | Remotion side: generated tokens, Rosetta `ease()`, `<SeamScene>`, primitives. |
| `remotion/src/films/tezpi-sting/` | Frame-parity port of the reference film. |
| `tools/tezpi/` | Vendored `seam-stamp` / `seam-gate` (Apache-2.0, patches in `NOTICE.md`). |

## 3. Authoring order (doctrine — don't reorder)

```
npm run film:new -- <slug> --scenes a:3,b:4,c:3 [--arrival]   # scaffold (lint + Seam Gate clean)
  1. motion-spec.md     intent · one focal point per beat · ONE sustained-motion route per scene
  2. ledger.json        one row per seam → npm run seam:stamp -- <slug>
  3. compositions/      build each route with TZM + tokens (no magic numbers)
  4. npm run film:qa -- <slug>           tokens · vendor · check --strict · Seam Gate · contact sheet
  5. cd films/<slug> && npx hyperframes preview --background   → user approval
  6. npx hyperframes render --quality looks --output renders/<slug>.mp4  → ffprobe duration/fps
```

A fresh scaffold fails `film:qa` with `motion_frozen` until every scene keeps performing —
that is the doctrine's "add story, not wobble", not a bug.

**Editing an existing film:** read `motion-spec.md` + `ledger.json`, run
`npx hyperframes timeline --json` in the film dir instead of reading every file, preserve the
user's edits, then re-run `film:qa`. Any change to a scene's first/last ~1s (incl. VO retime)
re-opens that seam — the gate must pass again.

## 4. Non-negotiables

- **Seams come from the ledger.** Never hand-edit `// <seams:auto>`; edit `ledger.json`, restamp.
  Only match-cuts / morphs are hand-authored (Tier A). The master timeline owns *only* seams;
  scene motion lives in the sub-composition mounted at `#el-<scene>`.
- **Vector law + one current** (default LEFT). Reserved vectors (up, Z±, scale-burst) carry
  meaning — spend, don't decorate. No crossfades, no ping-pong, 2–3 transition types per film.
- **Every scene performs**: name its route in the spec. No breathe/float/glow-pulse filler.
  0.3–0.75s stillness between a major action and its result.
- **Transforms + opacity only** (filter blur on wrappers). No `bounce`/`elastic`. Arrivals use
  binary opacity; seams fade. Z seams: no grow-from-small inside the entry window.
- **Tokens only** — colors, type, eases, durations, distances from `motion/tokens.json`
  (`TEZPI` in HF, `tokens` in Remotion). Edit tokens → `npm run tokens` → `npm run film:sync`
  (films snapshot `vendor/`; sync deliberately, then re-run QA).
- **Never load from a CDN** — the egress proxy blocks jsDelivr and HF blocks a render whose
  timeline script fails. Films load `vendor/` only.
- **Contrast**: filled buttons use `accentStrong` + `ink` (seam fades toward the dark canvas only
  raise contrast). `check` must report WCAG AA on every text sample.
- **Render only after approval.** Preview first; verify output with `ffprobe`.
- Remotion seams: scenes in `<Series>` wrapped in `<SeamScene>` (inline `durationInFrames`).
  `<TransitionSeries>` presentations overlap scenes — chapter breaks only.

## 5. Commands

| Command | Does |
| --- | --- |
| `npm run doctor` | Readiness: node, ffmpeg, pinned Chrome, deps, HF skills, plugin, token/vendor drift |
| `npm run film:new -- <slug> …` | Scaffold a doctrine-compliant film (see §3) |
| `npm run seam:stamp -- <slug>` | `ledger.json` → `<seams:auto>` block |
| `npm run seam:gate -- <slug>` | Numeric Seam Gate (exit 0 = pass) |
| `npm run seam:probe -- <slug> --t <sec>` | List movers around a cut (to author ledger rows) |
| `npm run film:qa -- <slug>` | All gates + `films/<slug>/.qa/contact-sheet.jpg` — read the sheet |
| `npm run tokens` · `npm run film:sync` | Regenerate token outputs · resnapshot film `vendor/` |
| `npm run remotion:studio` · `npm run remotion:check` | Remotion Studio · tsc + Rosetta-vs-GSAP |

## 6. Environment facts (cloud container)

- `.claude/hooks/session-start.sh` installs deps, the pinned HF Chrome and the HF skills, then
  runs `doctor`. HyperFrames is pinned at **0.8.141** (`package.json` → `config.hyperframes`).
- Software GPU only. HF renders take the fast `beginframe` path. Remotion renders:
  `--browser-executable="$(npx hyperframes browser path)" --gl=swangle`.
- Renders, `.qa/`, `snapshots/`, `remotion/out/` are gitignored — never commit media output.
