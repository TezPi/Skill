# Motion derivation

DESIGN.md files describe how a brand **looks**; almost all of them say nothing about how it **moves** (43 of 74 structured files list animation timings under "Known Gaps"; most ban hover documentation). This file turns static tokens into a motion system.

## 1. Read these signals from the DESIGN.md

| Signal (where) | Read as | Motion consequence |
|---|---|---|
| Display weight + tracking (`typography.display*`) | 200-340 + negative tracking = editorial air; 700-900 uppercase/condensed = force | Light: long durations, masked line reveals, no overshoot. Heavy: short slams, stacked words, hard cuts on beat. |
| Radius scale (`rounded`) | 0-4 px = engineered/brutal; 8-16 = product; pill 9999 + 24-40 cards = friendly | Sharp: linear-ish expo eases, wipes along straight edges. Pill-heavy: springs with small overshoot, liquid indicators, squash <= 4 %. |
| Accent count (`colors`) | one accent "used sparingly" | Accent = the moving carrier: one accent element travels between states and every transition rides it. Never flood the frame with it except at the payoff. |
| Multi-accent / colour blocks | Figma, Verge, Airtable | Transitions are colour-block wipes and floods; the block is the shot. |
| Elevation section | "flat / colour blocks substitute for shadow" vs layered shadows vs "gradient mesh IS the depth" | Flat: move in 2D, change by colour. Shadowed: lift on z (scale 1.0 -> 1.02 + shadow grows with height). Atmospheric: drift the backdrop slowly (parallax 2-6 %), keep UI crisp. |
| Canvas | black / near-black | Cinematic: light reveals (rim, specular sweep), fades through black allowed, slower camera. Cream/paper: warm, tactile, paper-ish easing, grain ok. White: precision, hairline draws. |
| Photography role | "photography carries all emotional weight" | Motion lives in the camera (slow push, parallax crop); UI chrome barely moves. |
| Numerals (`tnum`, mono) | finance / data DNA | Counters roll with tabular digits; values resolve crisply; no bouncing numbers. |
| Do's / Don'ts | explicit bans | Translate each into a motion ban (e.g. "never bump weight above 300" -> never animate weight up; "one filled button per band" -> one moving accent per shot). |
| Documented motion (rare) | Tesla 0.33 s, Starbucks springy check | Copy exactly; it overrides the archetype. |
| Category | fintech, dev tool, automotive, media, enterprise, retail | Tie-breaker only. Never let category override the visual signals. |

## 2. Archetypes (seed tokens)

Durations in ms. `micro` = press/hover feedback, `ui` = component state change, `scene` = shot transition, `camera` = camera move. Springs: `w` angular frequency, `z` damping ratio (1 = critically damped, never overshoots).

### A - editorial-precision
Stripe, Apple, Claude, Mercury, Oura, Mistral, Resend, Sanity, Cohere, Mastercard, ElevenLabs.
- micro 160 · ui 320 · scene 700 · camera 1600-2400
- ease-out `cubic-bezier(0.16,1,0.3,1)`; in-out `cubic-bezier(0.65,0,0.35,1)`; spring w 14, z 1.0; overshoot 0
- stagger 60-80 ms, by line not by letter
- moves: masked line rise, shared-element morphs, hairline draw-on, slow push 1.00 -> 1.04, specular pass across a surface, numbers resolve then hold
- never: bounce, per-letter confetti, weight animation, glow

### B - devtool-snap
Vercel, Linear, Cursor, Raycast, Warp, Supabase, Expo, Ollama, OpenCode, VoltAgent, Sentry, ClickHouse, Cal, Superhuman, Composio, Mintlify, Replicate, MiniMax.
- micro 90 · ui 160-200 · scene 450 · camera 900
- ease-out `cubic-bezier(0.2,0,0,1)`; spring w 30, z 0.9 (<= 1 % overshoot)
- stagger 30-40 ms; typing at 14-20 cps derived from time; caret blinks only when idle
- moves: command palette morph, keystroke-driven state changes, terminal lines, cursor-driven clicks, list filter, diff highlight, mono crumbs
- never: slow fades, decorative particles, soft gradients on chrome

### C - friendly-spring
Airbnb, Figma, Framer, Miro, Notion, Intercom, Zapier, Wise, Airtable, Lovable, Clay, Slack, Spotify, Starbucks, Pinterest, PostHog, Webflow, Jobright.
- micro 140 · ui 260-320 · scene 600 · camera 1200
- spring w 18, z 0.72 (overshoot 2-4 %); pop `cubic-bezier(0.34,1.56,0.64,1)` only for small elements
- stagger 50 ms; squash/stretch <= 4 %
- moves: pill morphs, liquid tab indicator (two-edge springs), stickers/illustrations easing in then swaying slowly, colour-block floods, cards stacking
- never: elastic wobble > 1 cycle, bounce on text blocks

### D - poster-slam
Nike, Vodafone, The Verge, WIRED, Al Jazeera, Revolut, Renault, Uber, NVIDIA.
- micro 80 · ui 140 · scene 0 (cut on beat) or 250 wipe · camera smash-pan 200
- ease-in `cubic-bezier(0.7,0,0.84,0)` for exits, out `cubic-bezier(0.16,1,0.3,1)` for arrivals; springs only critically damped and fast (w 40)
- stagger: 1/16 note (125 ms at 120 BPM)
- moves: stacked uppercase words, colour-band wipes, hard cuts on the beat, scale punch 1.0 -> 1.08, print misregistration on accent frames, ticker lines
- never: soft dissolves, floaty drifts, rounded bouncy UI

### E - cinematic-luxury
Tesla, Ferrari, Lamborghini, Bugatti, BMW, BMW M, SpaceX, PlayStation, Shopify, Runway, xAI, DJI.
- micro 250-330 (Tesla documents 330 for every state) · ui 400-600 · scene 1200-2000 · camera 2500-4000
- in-out `cubic-bezier(0.45,0,0.15,1)`; out `cubic-bezier(0.5,0,0,0.75)`; overshoot 0
- stagger 120-200 ms; wide-tracked caps may open tracking +0.02 em while revealing
- moves: light reveals (rim, sweep across metal), slow dolly/orbit, fade through black, single accent glint, photography crops that drift
- never: springs that wobble, fast UI chatter, more than one accent

### F - systematic-enterprise
IBM, SAP, HP, HashiCorp, Oracle, MongoDB, Coinbase, Meta, NerdWallet, Together AI.
- IBM Carbon-style scale: 70 / 110 / 150 / 240 / 400 / 700
- productive `cubic-bezier(0.2,0,0.38,0.9)` for UI; expressive `cubic-bezier(0.4,0.14,0.3,1)` for hero moments; entrance `cubic-bezier(0,0,0.38,0.9)`; exit `cubic-bezier(0.2,0,1,0.9)`
- stagger 40-60 ms, grid-ordered (left-to-right, top-to-bottom)
- moves: diagrams that build node by node, grid-aligned panels, chart draw-on, data tables filling, blueprint lines
- never: playful overshoot, rotation for decoration

### G - market-pulse
Binance, Kraken, 1win, mydealz.
- tick flash 120 up / 240 decay · ui 150 · scene 300 · tickers linear and continuous
- ease-out-quad `cubic-bezier(0.25,0.46,0.45,0.94)` for flashes
- moves: tabular counters rolling, up/down flashes in semantic colours only on data, continuously scrolling rails, sparkline draw-on
- never: semantic green/red on decoration; frozen numbers (a stopped ticker reads as a broken feed)

### H - retro-chrome
Dell 1996, Nintendo 2001.
- discrete time: `steps(n)` easing, 8-12 fps quantised motion, blink 500 ms
- moves: bevel press (1-2 px offset + inverted bevel), marquee scroll, GIF-style sprite loops, scanline wipes
- never: smooth springs, blur, modern glass

## 3. Output: the `motion:` block

Append to the brand's DESIGN.md (or a sibling `MOTION.md`) in the same token style so agents can reference `{motion.*}`:

```yaml
motion:
  archetype: editorial-precision            # seed; overridden by the lines below
  source: derived                           # derived | documented | mixed
  duration:
    micro: 160ms
    ui: 320ms
    scene: 700ms
    camera: 1800ms
  easing:
    out: "cubic-bezier(0.16, 1, 0.3, 1)"
    in-out: "cubic-bezier(0.65, 0, 0.35, 1)"
    exit: "cubic-bezier(0.7, 0, 0.84, 0)"
  spring:
    settle: { w: 14, z: 1.0 }               # closed-form, never passes target
    ui: { w: 22, z: 0.85 }
  stagger: 70ms
  carrier: "{colors.primary}"               # the one element that travels between states
  transitions: [masked-line-rise, shared-element, hairline-draw]
  signature: "gradient mesh drifts 3 % while UI stays crisp; money resolves in tnum"
  banned: [bounce, weight-animation, glow, per-letter-confetti]
  reduced-motion: "cross-fade 120ms, no camera moves, no parallax"
```

Exports (keep them generated from the block, never hand-edited twice):

```css
:root{
  --motion-micro:160ms; --motion-ui:320ms; --motion-scene:700ms;
  --ease-out:cubic-bezier(.16,1,.3,1); --ease-in-out:cubic-bezier(.65,0,.35,1); --ease-exit:cubic-bezier(.7,0,.84,0);
}
@media (prefers-reduced-motion: reduce){ :root{ --motion-ui:1ms; --motion-scene:120ms; } }
```
```js
// GSAP
gsap.registerPlugin(CustomEase);
CustomEase.create('brandOut', '0.16,1,0.3,1');
gsap.defaults({ duration: 0.32, ease: 'brandOut' });
// Framer Motion
export const brandSpring = { type: 'spring', stiffness: 14 ** 2, damping: 2 * 1.0 * 14, mass: 1 }; // k = w^2, c = 2 z w
// Remotion: spring({ frame, fps, config: { stiffness: 196, damping: 28, mass: 1 } }) ; interpolate(..., { easing: Easing.bezier(0.16,1,0.3,1) })
// seek(t) engines: spring(t, 14, 1.0) and bezier(0.16,1,0.3,1) from code-motion-graphics/assets/template.html
```
Spring conversion: stiffness `k = w^2`, damping `c = 2 * z * w` (mass 1). Settle time ~ `4.6 / (z * w)` s.

## 4. Validate the derived system

Build a 3-second **motion specimen** before any real piece: one button press, one card entering, one headline reveal, one scene transition, one number resolving, all with the derived tokens, on the brand canvas. Compare against the brand's static stills: if the motion contradicts a Do/Don't or the weight/radius character, adjust the tokens, not the brand.
