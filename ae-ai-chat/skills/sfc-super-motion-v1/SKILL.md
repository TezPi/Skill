---
name: sfc-super-motion-v1
description: "SFC Super Motion V1 — core structural framework of SFT Super Motion Studio V2. Runs right after senior-editor (Layer 0) and before planning, editing, generating, scripting or reviewing ANY video or motion work: footage edit, talking-head, reel, explainer, launch or brand film, motion graphic, logo sting, data animation, kinetic type, titles or captions, in Premiere/AE, Remotion, HyperFrames, Motion Canvas, Lottie, Rive, GSAP or three.js. Three mandatory pillars applied in order: (1) Editorial structure: Walter Murch's Rule of Six (emotion, story, rhythm, eye-trace, 2D screen plane, 3D action space), beat maps, cut purposes, J/L sound, three-scale review; (2) Shape & Motion Graph: Rule of Zero, render stack, Trim/Repeater/Merge/Offset patterns, Influence % to cubic-bezier, named easing and spring tokens, arcs, enter/exit asymmetry, stagger, domain blueprints; (3) Motion Text: exact-content 2D/2.5D/3D text motion, 1,000,000-spec catalog, custom mixing. (Formerly edit-video-structure / video-editing-structure.)"
---

# SFC Super Motion V1

> **Runs under Layer 0.** [`senior-editor`](../senior-editor/SKILL.md) loads first: its pre-flight frames this plan (piece type, locked layer, viewer, voice anchor, pass strength), its soul layer shapes how Stages 1–3 are written, its plan audit and stills self-audit check them, and its human gate joins Stage 5. Nothing in this file changes; the senior editor decides what is worth building, these pillars decide how.
>
> **Followed by the Depth & Soul framework.** [`ae-automation-architect`](../ae-automation-architect/SKILL.md) loads after this file: its motion laws DS-1..3 tighten Stage 2, its engine rules AE-1..5 govern every After Effects script and expression in Stage 4, and its gate joins Stage 5.
>
> **On top of the Motion Foundation Core.** [`motion-foundation-core`](../motion-foundation-core/SKILL.md) audits the real source before Stage 1 (G0–G1), fixes geometry between Stage 1 and Stage 2 (G3: grid, layout, bbox per layer), and gates Stage 4 and the final export (G5, G7) on one `motion_plan.json`.

The framework every video job runs through. Three pillars answer three different questions, always in this order:

| Pillar | Answers | Governs | Entry file |
|---|---|---|---|
| **1. Editorial structure** | *Why and when* does something change on screen? | Intent, beats, cut/scene order, holds, picture–sound relations, continuity, review | [`pillars/1-editorial/PILLAR.md`](pillars/1-editorial/PILLAR.md) |
| **2. Shape & Motion Graph** | *How* is each element built, and *how* does it move? | Vector hierarchy, modifier stacks, easing/spring tokens, arcs, durations, stagger, enter/exit, pacing, domain blueprints | [`pillars/2-shape-graph/PILLAR.md`](pillars/2-shape-graph/PILLAR.md) + [`theme.ts`](pillars/2-shape-graph/theme.ts) |
| **3. Motion Text** | *How* does text appear, read and leave? | Exact content, grouping, activation order, timing, composition, 2D/2.5D/3D rigs, readability, fallbacks | [`pillars/3-motion-text/PILLAR.md`](pillars/3-motion-text/PILLAR.md) |

A job that skips a pillar it needs is not ready to build. Pillar files are the canonical originals; this file decides order, scope and conflicts.

## Scope: which pass

| Job | Pass |
|---|---|
| Watched, time-based piece with 2+ shots/scenes | **Full**: all three pillars |
| Single-shot piece (logo sting, loop, lower third, one title, one transition) | **Lite**: Pillar 1 one line per criterion (emotion, story, rhythm, eye-trace); Pillars 2 and 3 in full for what is on screen |
| Revision of one cut, one scene or one text block | Only the joins/elements touched, all relevant pillars |
| Live UI micro-interaction (not a video) | Pillar 2 only (tokens, enter/exit, reduced motion) |
| Pure encode/convert, asset cleanup | Skip |

## Mandatory sequence

Each stage has a gate. Do not start the next stage until the gate holds.

**Stage 1 — Editorial pass (Pillar 1).** Brief and assumptions → evidence labels (`observed` / `user_provided` / `inferred` / `proposed` / `unknown`) → beat map (viewer state before → change → after) → cut/scene list with a purpose per join, picture and sound transitions recorded separately (J/L), hold/no-cut considered. Read [`sft-pipeline-bridge.md`](pillars/1-editorial/references/sft-pipeline-bridge.md) for motion-graphics mapping and per-host rules.
*Gate:* a beat map exists and every join has a stated purpose. With a source: the `motion-foundation-core` G1 audit is recorded (real metadata, frames looked at, audio, protected regions) and each beat is a scene of `motion_plan.json`.

**Stage 1.5 — Geometry (`motion-foundation-core` G3).** Grid profile or custom grid, layout (`Lxx` or custom), safe bbox, then bbox, z-order and type metrics for every layer, with protected source regions mapped into output space. Reflow when the format changes; never stretch text to fit.
*Gate:* every layer has a bbox; essential content sits inside the content region; no text box overlaps another or a protected region without a stated intent.

**Stage 2 — Motion architecture (Pillar 2).** For every beat and element: shape construction (parametric first; Rule of Zero; Fill/Stroke at stack bottom; Patterns A–D as needed), then motion: a **named** easing token or spring preset per channel, durations derived from `fps` (`Math.round(seconds * fps)`), spatial arcs via separate X/Y curves for diagonal travel, multi-property entrances (scale floor ≥ 0.90), exits 30–50% shorter with fewer properties and no overshoot/stagger, bounded stagger, and the domain blueprint that fits (social 9:16, SaaS/UI, data/FinTech, kinetic type, logo/brand: report Part 3). Use [`theme.ts`](pillars/2-shape-graph/theme.ts) values verbatim in code hosts; read [`ERRATA.md`](pillars/2-shape-graph/ERRATA.md) once.
*Gate:* no unnamed curve, no `linear`/F9 33% on primary motion, no overshoot on opacity, color or data values. Plus `ae-automation-architect` DS-1..3: arrivals on a spring or a sharp-attack long-decel curve, layers offset 2–4 frames in lead order, one coupled secondary system per moving shot.

**Stage 3 — Text blueprint (Pillar 3).** For every piece of on-screen text: exact text and its semantic role → 2–3 meaningfully different mechanisms with reasons → one selected blueprint (`describe` / `resolve` an `MT-` ID, or a `CUST-` mix with parent IDs) with grouping, activation, entrance/read/exit timing, pivots, camera/material/light for spatial text → reduced/static alternative. Bind the blueprint's curves to Pillar 2 tokens. CLI (optional): `python3 pillars/3-motion-text/scripts/motion_catalog.py resolve <ID> --text "<exact text>" --engine <engine> --fps <fps>`.
*Gate:* text, diacritics, numbers, units and qualifiers preserved; stable reading time is long enough for the content.

**Stage 4 — Build.** `motion-director` picks the host and engines; implement the Stage 1–3 plan, not a new one. In After Effects every script, expression and rig follows `ae-automation-architect` AE-1..5 and passes `es3_lint.py` before it runs. Nothing is built until the `motion-foundation-core` edit gate passes (`foundation_mix_lint.py --phase edit`).

**Stage 5 — Verify, all three lenses.** Pillar 1: three-scale review (join / scene / whole) at playback speed with sound, key decisions tagged `appropriate` / `review_needed` / `insufficient_evidence` / `not_applicable`. Pillar 2: Pre-Delivery Audit Checklist + stills at key beats, t_peak and settle. Pillar 3: first visible, max displacement, midpoint, start/end of read hold, exit, diacritics, bounds, occlusion, contrast. Then the `senior-editor` human gate (one uninterrupted viewer watch; no Tier 1 `ME-` tell left). Before the final render, the `motion-foundation-core` export gate (`--phase export`) must pass on real evidence. Report the real state: proposed, applied to timeline, rendered, or visually reviewed (`plan`, `preview_rendered`, `final_exported`, `final_verified` in the plan).

## Precedence when pillars disagree

1. **Truth and required content** (all pillars): never alter meaning, fabricate reactions or causality, change numbers, or drop required steps.
2. **Pillar 1 editorial intent**: what the viewer must feel and understand at this beat (sharpened by the senior editor's one idea and feeling beats).
3. **Pillar 3 readability**: text must be readable for long enough, in full.
4. **Senior Editor de-mechanization**: may change Pillar 2 default values (durations, stagger intervals, curve per role, pacing heuristics) when a beat motivates it; never Pillar 2 guardrails.
5. **Pillar 2 parameters**: the tokens and limits that execute the above. The `ae-automation-architect` motion laws sit here and replace Pillar 2 defaults where they differ (stagger interval between layers, default arrival curve); Pillar 2 guardrails stay. Its engine rules AE-1..3 are correctness rules and are not subject to precedence.
6. Style and decoration.

Brand motion tokens from a DESIGN.md (`brand-animation-graphics`) replace Pillar 2 default curves and durations, but Pillar 2 guardrails still apply (no data/opacity overshoot, faster exits, scale floor).

| Conflict | Resolution |
|---|---|
| P2 pacing heuristics (motion in first 15 f, new element every ≤ 90 f, pattern interrupt every 1–5 s, HIT → Hold → Build → HIT) vs P1 "no cut every N seconds, holds are real options" | Use the P2 numbers as defaults to test against the beat map. A hold that serves a beat wins; a gap with no purpose gets a new beat, not filler. |
| P2 retention figures (65% leave in 3 s, +32% retention) | Context for why hooks matter. Never present them as promised outcomes for this video (P1 rule). |
| P2 idle breathing on anything on screen > 2 s vs P3 stable reading | Breathing (±3 px / ±1°) only on decorative, background and media layers. Text in its read hold stays still; drop P3's T09 accent for dense or critical text. Data values never breathe. |
| P2 stagger cap 300–400 ms vs P3 nominal 55 ms per unit | Group long strings by phrase or line first (P3), then stagger groups; units beyond the 6th–8th share the cap delay. Never per-letter animate a long sentence. |
| P2 "nothing enters simultaneously" vs a single unit or whole block (P3 degeneracy) | Stagger applies only with 2+ units. |
| P2 multi-property entrance vs P3 numeric content | Text may use opacity + translate + scale; never scramble/odometer real prices, dates or data. Counters and chart values use the critically damped preset or a monotonic curve. |
| P2 spatial arcs vs P1 2D screen plane | An arc must not reverse the screen direction the edit established; pick the arc pair whose bow keeps flow direction. |
| P2 75% safe zone vs P1 "no invented safe-area specs" | Use 75% as the default when the brief gives no platform spec; a verified platform spec from the brief replaces it. |
| `motion-foundation-core` references (180-frame scenes, 6-frame layout delays, 18-frame staggered exits, ease-out cubic, linear wipe) vs P1 holds, P2 exits and tokens, DS-1..2 | Its numbers are references and yield: durations from the beat map, entry order kept but gaps 2–4 f, exits per P2, named tokens. Its source, evidence and readiness rules never yield. Details: its rulings table and `MIX.md`. |
| Murch 51/23/10/7/5/4, P2 Golden Laws, P3 catalog counts | None is a quality score. Do not total them or report them as measured quality. |

## Output contract

Deliver one plan that the three pillars fill together, scaled to the request:

- **Brief and assumptions** (P1)
- **Beat map and cut/scene list** with purpose and J/L per join (P1)
- **Per-beat motion spec**: element, shape build, channel → token name (e.g. `PUNCHY_ENTER_15_85`, `SPRING_SAAS_CARD`), duration in frames at the project fps, stagger, enter/exit (P2)
- **Text blueprints**: exact text, chosen `MT-`/`CUST-` ID, grouping, timing, fallback (P3)
- **Seeded variance**: `VAR-` entries (role, channel, amplitude, seed) from the senior editor's soul layer
- **`motion_plan.json`** (`motion-foundation-core`): source audit, geometry per layer, keyframes, tokens, gate results
- **Checks** still to run, and the actual delivery state
- **Editor's notes** (`senior-editor`): tells caught and kept, flags, self-audit, runbook entry

For structured handoff, extend [`edit-plan-template.json`](pillars/1-editorial/assets/edit-plan-template.json): add a `motion_tokens` field per decision and the text blueprint ID per text element.

## Pillar index

| Need | Read |
|---|---|
| Six criteria in depth, conflicts | `pillars/1-editorial/references/six-criteria.md` |
| Full editing workflow, JSON conventions | `pillars/1-editorial/references/editing-workflow.md` |
| Worked dialogue / chase / vertical tutorial cases | `pillars/1-editorial/references/worked-examples.md` |
| Rule of Six for motion graphics, Forge integration, per host | `pillars/1-editorial/references/sft-pipeline-bridge.md` |
| Golden Laws, modifier patterns, easing matrix, springs, AE expressions, audit checklist | `pillars/2-shape-graph/PILLAR.md` |
| Token constants and helpers for code hosts | `pillars/2-shape-graph/theme.ts` |
| Full research (17 modifiers table, 19-curve table, arcs, M3 tokens, bounce math, domain matrix, 67 sources), Vietnamese | `pillars/2-shape-graph/research-report.vi.md` |
| Text grammar, IDs, timing contract | `pillars/3-motion-text/references/grammar.md`, `schema-timing.md` |
| Engine limits for text (AE, GSAP, Remotion, three.js, Blender, C4D) | `pillars/3-motion-text/references/engines.md`, `3d.md` |
| Content invariants, grapheme segmentation, reduced motion | `pillars/3-motion-text/references/semantics-accessibility.md` |
| 100 operator families in detail | `pillars/3-motion-text/references/operator-manual.md` |
| Mixing beyond the catalog | `pillars/3-motion-text/references/custom-extension.md` |
| Domain profiles, worked blueprints | `pillars/3-motion-text/data/domains.json`, `examples/` |

Load only the sections a job needs. The text catalog ships compact: any of the 1,000,000 `MT-` IDs is rebuilt on demand by `describe`/`resolve`; `generate` rematerializes all shards if a full scan is required. Never load the catalog into context.
