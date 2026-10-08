# tezpi-sting — motion spec

Reference film for this workspace: every tezpi-motion technique a short sting can carry,
passing the Seam Gate. Copy its patterns; don't copy its copy.

## Intent

| | |
| --- | --- |
| Deliverable | 8.1s unnarrated brand sting, MP4 |
| Canvas | 1920×1080 @ 30fps |
| Host | HyperFrames (motion-forge §4: short kinetic type, no GPU effects needed) |
| Audience | Teams adopting the motion doctrine — the film demonstrates it |
| Lives | Repo README, onboarding |

## Behavioral insight — one focal point per beat

| Beat | Eye must… | Motion's job |
| --- | --- | --- |
| Hook | lock onto the headline in < 1s | waterfall entry pulls the eye left→right, final word fragments extend the climax |
| Claim | follow cause → effect | oversized cursor walks the eye to the trigger; its click ignites progress |
| Payoff | register arrival | the one reserved vector (Z backward) lands the line |

## Beats (master clock, seconds)

| Scene | In | Out | Sustained-motion route | Content |
| --- | --- | --- | --- | --- |
| `hook` | 0.00 | 2.60 | staged reveals | "Motion that moves." → nudge up → label reveals in the burst |
| `claim` | 2.60 | 5.90 | cursor-led action + sequenced UI life | gate card; cursor clicks **Run gate** → progress → 3 checks → stillness 0.45s → **PASSED** |
| `payoff` | 5.90 | 8.10 | staged reveals → held end card | "Cut the curve." arrives oversized and retracts; label; accent rule draws |

## The current

**LEFT.** One reserved vector spent: Z backward (inverse zoom) = arrival, on the payoff only.

## Seam ledger (mirrors `ledger.json`)

| Cut | Seam | Exit vector | Entry vector | Carrier | Technique |
| --- | --- | --- | --- | --- | --- |
| 2.60 | hook → claim | `#el-hook` x− | `#el-claim` x− | scene heroes (partial travel + early fade) | cut-the-curve LEFT |
| 5.90 | claim → payoff | `#el-claim` z− (shrink) | `#el-payoff` z− (shrink) | scene heroes | inverse zoom-through, 10px text-scale blur |

Transition budget: 2 types (cut-the-curve, inverse zoom). No crossfades.

## Tokens

All numbers from `motion/tokens.json` via `window.TEZPI`; primitives via `window.TZM`
(`vendor/tezpi-motion.js`). Cursor: `7cqw`, tip origin `21% 14%`, white body / black stroke.

## Gate

`npm run film:qa -- tezpi-sting` → `hyperframes check` 0 errors + `seam:gate` PASSED + seam contact sheet.
