# MIX: Motion Foundation Core × SFT Super Motion Studio V2

The foundation chooses **where, when and on what evidence**. The V2 layers choose **which curve, which physics, which mechanism**. A code from the 84-item library is a name for a decision; the row below says who executes it.

## 1. Code → who executes it

| Code | Names | Executed by |
|---|---|---|
| A01–A20 look | Visual language | Art direction. With a DESIGN.md, `brand-animation-graphics` tokens win. Senior editor checks `ME-17` (generic stock) and `ME-20` (preset grade). |
| B01–B10, L01–L20 layout | Where content sits, reading order | **This skill** (grid, bbox, reflow). Nothing else in V2 owns geometry. |
| T01–T12 treatment | How type looks | `type-kinetic-fx` legibility rules; Vietnamese diacritics measured with the real font. |
| C01–C12 text motion | Behaviour family | Pillar 3 blueprint (`MT-` / `CUST-`), built with `type-kinetic-fx`. Record `codes` and `mt_id` together. |
| D01–D12 shape motion | Behaviour family | Pillar 2 construction patterns: D04 → Pattern A (Trim Paths), D05 / D07 → Pattern B (Repeater), D03 / D11 → morph with matched vertices, D08 → Pattern D (Merge + Offset). |
| E01–E12 transition | Device at a join | Pillar 1 decides whether the join needs a device at all (a cut is the default; a device on every join is `ME-05`). |
| F01–F10 scene type | Specialised scene | F01 / F02 data: Pillar 2 guardrail, no overshoot. F06 map, F09 overlay: `type-spatial-hud-sfx`. F07 / F08 depth and camera: `ae-automation-architect` DS-3, or `three-3d-stack` in code. F10 ident: `brand-animation-graphics`. F03 / F04 UI: `code-motion-graphics` playbooks. |
| G01–G08 rhythm | Character of the motion | Tokens below. |
| M01–M10 preset | Keyframe reference | Re-timed below. |

### G-code → token

| G | Character | V2 execution |
|---|---|---|
| G01 Stagger / Cascade | Lead, then followers | DS-2: seeded 2–4 frame gaps, order by meaning, group cap 0.4 s |
| G02 Snappy / Stomp | Short move, hard stop | `EXPLOSIVE_ENTER_10_90`, `PUNCHY_ENTER_15_85`; `SNAPPY_UI` spring |
| G03 Elastic / Spring | Overshoot, decay | `PLAYFUL_POP`, `ELASTIC_CARTOON` through `dho`; short text and objects only |
| G04 Smooth / Fluid | Soft, led by the previous action | `EXPO_OUT_PREMIUM`, `IOS_SHEET`, `HEAVY_CINEMATIC` |
| G05 Precise / Mechanical | On axis, locks, holds | `SNAPPY_ENTER_20_80`; `PRO_STANDARD_75_75` for rest-to-rest moves, with the reason |
| G06 Stepped | Hold, jump | Hold keyframes or Posterize Time, written as token `HOLD`. Not linear, not a default ease. |
| G07 Ambient / Loop | Small periodic change | M10 loop, seeded `VAR-` drift, DS-3 camera drift. Decorative layers only. |
| G08 Beat-synced | Follows voice or sound | Pillar 1 beat map; a BPM grid quantises beats, it does not replace them |

## 2. M presets, re-timed (30 fps reference)

Geometry and frame logic stay the foundation's. Curves, exits and gaps follow V2.

| Preset | Foundation reference | In V2 |
|---|---|---|
| M01 Rise And Fade | ΔP (0, +60) → 0 and O 0 → 100 in 18 f | Position on `PUNCHY_ENTER_15_85` or `EXPO_OUT_PREMIUM`; opacity monotone and done before the position settles. Support layers travel less than the hero. |
| M02 Card Pop | S 92 → 103 → 100 over 18 f | Keep the three keys with a named curve per segment, or S 92 → 100 on `SPRING_APPROACH` + a spring preset. Not for data. |
| M03 Line Draw | End 0 → 100 in 24 f | `EXPO_OUT_PREMIUM`; path start decides direction; no overshoot on `path_end`. |
| M04 Morph | A → mid → B at F000 / F018 / F036 | Keep the keyed intermediate; one named curve per segment. |
| M05 Data Dot | Phase 0 → 1 in 60 f along the path | Constant rate is `MECHANICAL`: an expression (`rate * time`) with `mechanical_reason`, never two linear keys. Not evidence of real speed. |
| M06 Master Wipe | C−12, C, C+12, linear in the example | `M3_EMPHASIZED_ACCEL` into C, `EXPO_OUT_PREMIUM` out of it. One overlay on the master. Still at C proves full cover. |
| M07 Bar Grow | Size and centre from the baseline formula | Formula unchanged. Monotone curve only (`EXPO_OUT_PREMIUM`, critically damped). |
| M08 Number Counter | F018 → F060 | Monotone; hold with label, unit, period and source. |
| M09 Reflow | bbox A → B in 18 f, new text box | `PRO_STANDARD_75_75` (rest to rest, say so) or `EXPO_OUT_PREMIUM`. Never unequal Scale X/Y on text. |
| M10 Poster Loop | S(f) = 100 + 4·sin(2πf / 120 + phase) | Unchanged: periodic, value and velocity match at the seam. Text holds still. |
| Default exit | e0 = 150 + stagger, 18 f, ΔP (−48, 0), O → 0 | 9–12 f at 30 fps (30–50 % shorter than the entrance), opacity plus at most one more property, `M3_EMPHASIZED_ACCEL`, every layer leaves on the same frame. |
| Layout delays | 0, 6, 18, 24, 30 f | Same order. Gaps inside a group 2–4 f (seeded). A layer tied to a voice cue: its own `group`, start on the cue. |
| Scene length | 180 f | From the beat map. |

The four filmstrip marks F006 / F024 / F090 / F168 belong to the 180-frame sample; pick real marks for a real scene.

## 3. Plan fields added by V2

All optional for `validate_plan.py`, read by `foundation_mix_lint.py`.

| Field | Where | Meaning |
|---|---|---|
| `sfc` | plan | `piece_type`, `one_idea`, `pass` from the senior-editor pre-flight |
| `beat` | scene | Viewer state before → change → after (Pillar 1) |
| `secondary` | scene | `{ system, coupled_to, budget }`: the DS-3 system of a moving shot |
| `secondary_none_reason` | scene | Why a shot carries none (stillness is the beat, locked footage) |
| `motion.token` | layer | Curve or spring for the entrance's spatial channels. Opacity always runs a monotone curve. |
| `motion.exit_token` | layer | `M3_EMPHASIZED_ACCEL`, `FAST_EXIT_80_20`, `WHIP_EXIT_85_15`, `EASE_IN_QUAD` or `HOLD` |
| `motion.group` | layer | Stagger group; default `main`. New group = new cue. |
| `motion.codes` | layer | Library codes behind the choice, e.g. `["C01", "T02", "G02"]` |
| `motion.mt_id` | text layer | Pillar 3 blueprint ID (`MT-…` / `CUST-…`), added in SFC Stage 3 |
| `motion.mechanical_reason` | layer | Required when a constant-rate (linear) motion is intended |
| `role` | layer | `data`, `counter`, `particle` change the guardrails; `cta` keeps the foundation's end-hold rule |

Token names come from Pillar 2 `theme.ts` (curves and spring presets, springs with or without the `SPRING_` prefix), plus `EXPO_OUT_PREMIUM`, `SPRING_APPROACH` and `HOLD`.

## 4. Lint codes

| Code | Rule | Source |
|---|---|---|
| `E-TOKEN` | Animated entrance without a known token | Pillar 2 law 3, DS-1 |
| `E-LINEAR` | "linear" without `mechanical_reason` | DS-1 |
| `E-GUARD` | Overshoot token on opacity-only, `numeric_value`, `path_end`, or a data role | Pillar 2 law 6 |
| `E-FLOOR` | Entrance scale under 90 % (not a particle or data mark) | Pillar 2 law 4 |
| `E-EXIT-TOKEN` | Exit without an accelerating token | Pillar 2 law 7 |
| `E-DS2-SIMULTANEOUS` | Two entrances start on one frame | DS-2 |
| `W-DS2-WINDOW` | Gap inside a group outside 2–4 f (4–8 f above 40 fps) | DS-2 |
| `W-DS2-CAP` | A group's stagger spans more than 0.4 s | Pillar 2 law 8 |
| `W-EXIT-LONG` | Exit longer than 70 % of the entrance | Pillar 2 law 7 |
| `W-EXIT-STAGGER` | Exits start on different frames | Pillar 2 law 7 |
| `W-ME01` | Three or more scenes, all the same length | senior-editor `ME-01` |
| `W-ME03` | Three or more text layers with one mechanism and one curve | senior-editor `ME-03` |
| `W-DS3` | Moving shot with no `secondary` and no reason | DS-3 |

Errors block G5 and G7. A warning stays only with a sentence in the editor's notes saying why it serves the beat.

## 5. States and evidence, one vocabulary

| Foundation | SFC / Forge |
|---|---|
| `plan` | proposed |
| (AE timeline edited, nothing rendered) | applied to timeline |
| `preview_rendered` | stills or preview rendered |
| `final_exported` | exported |
| `final_verified` | visually reviewed: the four QA lenses passed on the final file |

Pillar 1 labels (`observed`, `user_provided`, `inferred`, `proposed`, `unknown`) tag editorial decisions. Foundation statuses tag what is on screen: claims (`verified`, `example`, `placeholder`) and text fit (`estimated`, `verified`). A senior-editor locked item that occupies screen area gets a `protected_regions` bbox so the contract can test overlays against it.

## 6. What was left out of the plugin copy

`evals/review.html` (238 KB eval viewer that loads scripts and fonts from external CDNs) is not carried into V2. Everything else from Motion Foundation Core 1.0.0 is here unchanged; the original `SKILL.md` body is `FOUNDATION.md`.
