---
name: brand-animation-graphics
description: "Brand-accurate animation graphics and motion systems derived from a DESIGN.md or design tokens: motion tokens (durations, easings, springs), logo stings, UI micro-interactions, loaders, hero and product-UI animations, social loops that move the way the brand looks. Use when the user gives a DESIGN.md, brand guide, Figma variables or a site and wants it animated, asks for motion tokens / a motion system / 'how should our brand move', wants animation 'in the style of' a known product (Stripe, Linear, Apple, Vercel, Nike...), or needs on-brand micro-interactions. Covers 84 analysed brands."
---

# Brand Animation Graphics

A DESIGN.md (the Google Stitch format: YAML tokens for colors, typography, rounded, spacing, components + prose on Overview, Elevation, Shapes, Do's and Don'ts) tells an agent how a brand **looks**. It almost never says how it **moves**: the 84 files in the reference collection explicitly leave hover states and animation timings out. This skill fills that gap: read the static system, derive a motion system that feels inevitable for it, then build animation graphics with it.

## Bundled references

| File | Read when |
|---|---|
| `references/motion-derivation.md` | Always. Signal -> motion map, 8 archetypes with seed tokens, the `motion:` block format, CSS/GSAP/Framer/Remotion exports, spring conversion. |
| `references/brand-catalog.md` | The user names a known product/style, or wants a reference look. 84 brands with accent, display face, radius, archetype and the few documented motion facts. |

Pair with: `code-motion-graphics` to render films/loops in code (seek(t) engine, QA gate), `type-kinetic-fx` for text animation craft, `edit-ae-pr-master` when the deliverable is After Effects/Premiere, the Figma skills when motion must live in Figma prototypes or variables.

## Rules of use

- **Own brand first.** The user's DESIGN.md, tokens, Figma variables, CSS or live site are the source of truth. Read all of it, including Do's/Don'ts.
- **Catalog brands are style references, not identities.** Learn a language from Stripe or Nike; apply it to the user's product. Never reproduce another company's logo, wordmark, mascot or a page built to pass as theirs. "Inspired by" is fine; impersonation is not.
- **Documented motion beats derived motion.** If the source states a timing (Tesla's 0.33 s, Starbucks' springy check), use it verbatim and mark `source: documented`.
- **Restraint is the brand.** A motion system that adds an effect the static brand would never allow is wrong, however impressive.

## Workflow

1. **Collect** the brand source. If only a URL is given, extract colors, type, radius, elevation, imagery role and copy tone into DESIGN.md form first (same headings as the reference files). For a catalog style, fetch the file from the raw URL in `brand-catalog.md`.
2. **Read the signals** (table in `motion-derivation.md`): display weight + tracking, radius scale, accent count, elevation philosophy, canvas colour, photography role, numerals, Do's/Don'ts, documented motion. Write each signal and its motion consequence in one line.
3. **Pick an archetype** as the seed (A editorial-precision, B devtool-snap, C friendly-spring, D poster-slam, E cinematic-luxury, F systematic-enterprise, G market-pulse, H retro-chrome). When two fit, the visual signals decide, category only breaks ties.
4. **Write the `motion:` block**: durations (micro/ui/scene/camera), easings (out/in-out/exit), springs (w, z), stagger, carrier element, signature transitions, banned list, reduced-motion fallback. Append it to the DESIGN.md (or MOTION.md) and generate the exports (CSS variables, GSAP CustomEase, Framer Motion spring, Remotion config).
5. **Motion specimen** (3 s): button press, card enter, headline reveal, scene transition, number resolve, on the brand canvas. Render stills or a short loop with `code-motion-graphics`. Check it against the brand's static stills and Do's/Don'ts; tune tokens, never the brand.
6. **Build the deliverable** (table below) using only the tokens.
7. **QA** (checklist below), then deliver tokens + asset + a one-paragraph "how this brand moves" note.

## Deliverables

| Ask | Build | Notes |
|---|---|---|
| Motion tokens / motion system | `motion:` block + exports + specimen | Add Figma number variables (`motion/duration/ui = 320`) and easing as text variables when the design system lives in Figma. |
| UI micro-interactions | React + Tailwind/TS components with Framer Motion or CSS (default stack), states: hover, focus-visible, active/pressed, loading, success, error, disabled | Only transform/opacity/filter animate (60 fps). Every state has a reduced-motion path. Pressed state follows the brand (Nike collapses, Stripe darkens, Linear barely moves). |
| Loader / empty state / success | Small looping or one-shot SVG/CSS/Lottie-free animation | Loaders loop seamlessly; success resolves once and holds. |
| Logo sting / brand reveal (2-5 s) | seek(t) composition via `code-motion-graphics` | Built from the brand's own geometry (radius, stroke, accent glint). Only the user's own logo, supplied as SVG. |
| Hero / landing animation | GSAP timeline or Framer Motion sequence | One carrier element, one idea; scroll-linked moves scrub, never autoplay loops behind text. |
| Product UI demo / promo loop | UI morph loop or launch-film playbook from `code-motion-graphics` | Real product UI rebuilt in components, brand tokens for every value. |
| Social motion post | 1080x1350 / 1080x1920 loop, 6-15 s | Big type in the brand display face, safe zones for platform UI. |
| AE / Premiere handoff | Token sheet as expressions + MOGRT parameters | Hand to `edit-ae-pr-master`; easing as speed/influence values derived from the bezier. |

## Mapping cheatsheet (fast path)

- Thin display weight + negative tracking + one accent -> **A**: long expo-out, masked line rises, zero overshoot, accent glint as carrier.
- Dark canvas + mono/Geist + 4-8 px radius -> **B**: 160-200 ms, cursor/keyboard-driven, command-palette morphs.
- Pills everywhere + warm/bright palette + illustrations -> **C**: springs z 0.72, liquid indicators, sticker sway.
- 800-900 uppercase + colour bands + zero radius -> **D**: cuts on the beat, colour-band wipes, scale punches.
- Black canvas + photography carries emotion + wide-tracked caps -> **E**: 330 ms UI, 2-4 s camera, light sweeps.
- Grid systems + productive/expressive split + blue enterprise -> **F**: Carbon-style 70-700 ms ladder, diagrams build.
- Dense data + green/red semantics -> **G**: tick flashes, rolling tabular counters, never frozen.
- Bevels, Arial Black, page frames -> **H**: steps(), 8-12 fps, bevel presses.

## QA checklist

- [ ] Every duration/easing/spring in the asset comes from the `motion:` block (grep for stray values).
- [ ] No motion contradicts a Do/Don't, the weight/radius character, or the "one accent" rule.
- [ ] UI motion animates only transform/opacity/filter; durations <= 500 ms for component state changes.
- [ ] `prefers-reduced-motion` path exists (cross-fade <= 120 ms, no parallax/camera moves); nothing flashes more than 3 times per second; focus-visible states are never animated away.
- [ ] Brand canvas, display face and accent are exact (hex from tokens, real font or the documented substitute with its tracking).
- [ ] No third-party logo, wordmark or look-alike page; catalog brands used only as style references.
- [ ] Specimen and final asset reviewed as stills (contact sheet) and in motion.
