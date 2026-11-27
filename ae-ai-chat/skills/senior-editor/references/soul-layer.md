# Soul layer

Removing tells is half the job. A cut with no tells can still be lifeless: correct, even, and about nothing in particular. This file is the other half: what a senior editor adds. Every number below is a starting point to test against the beat map, never a target or a quality score.

## Signs of a lifeless cut (even when technically clean)

- Every beat gets about the same time and the same energy.
- Nothing is ever still, or everything is.
- No point of view: the piece lists features or events instead of arguing one idea.
- Every feeling is upbeat; there is no tension to release.
- Nothing specific: it could be about any product, any city, any person.
- The sound is a bed under the picture rather than half of the edit.

## 1. Point of view

Write the idea as one sentence a viewer could repeat afterwards ("Nova answers your customers before you can", not "Nova is an AI sales platform"). Put it above the beat map. For each beat, ask whether it moves the viewer toward that sentence. If not, cut it, however good it looks.

## 2. Feeling beats

Mark the one or two beats that carry the emotion. Around them:

- Give them the longest durations in the piece.
- Quiet everything else on screen: fewer moving layers, locked camera, no idle breathing.
- Thin the sound: drop music or effects for a few frames so the moment lands. 6–12 frames of air before the hit is a common start.
- Hold after the important line or image so it can register. 0.5–1.5 s beyond reading time is a common start; the beat decides.

## 3. Rhythm with variance

Edited film is not evenly cut. Shot-length statistics (Barry Salt's work; Cutting, DeLong & Nothelfer, *Psychological Science*, 2010) show long-tailed distributions and sequences that are far from uniform. Use this as a diagnostic: if every duration in your plan is within about 10% of the median, the rhythm was assigned, not edited (ME-01).

Practical moves:

- Short beats lead into long ones; a run of quick cuts earns a hold.
- Change pace at story turns (problem → mechanism → proof), not at fixed intervals.
- When music leads, place cuts by purpose first, then move each to the nearest accent. Some accents get no cut; that restraint is audible.
- Check a finished cut with `scripts/editor_fingerprint.py scan` and compare it with a reference you admire using `diff`.

## 4. Asymmetry of role

Disney's principles already describe what makes motion feel alive: overlapping action, follow-through, secondary action, timing that differs by weight. Apply them as roles:

| Role | Duration | Curve family | Stagger slot | Exit |
|---|---|---|---|---|
| Hero | Longest; lands, then settles | Premium out-curve or a damped spring that settles | First, or last as the payoff | Last to leave, or stays |
| Support | 60–80% of hero | Plainer out-curve | Grouped, shorter interval | Early, fewer properties |
| Context (bg, frame, UI chrome) | Shortest, or none | Simple, low amplitude | Before the hero (stage is set first) | With the scene cut |

Followers lag the leader by a few frames (overlapping action), and settle after it (follow-through). Exits are quieter than entrances and never play the entrance in reverse.

## 5. Specificity

- Real product screens in real states, with plausible real data from the brief.
- Numbers, names, times and places from the source, never invented.
- One striking detail per piece: the 23:47 timestamp, the customer's actual phrasing, the cracked phone screen. Specific details are what viewers remember, and they are the hardest thing for a default to produce.
- If the specific is missing, ask for it. If you can't ask, simplify the shot rather than fill it with realistic-looking fake data.

## 6. Seeded imperfection (`VAR-`)

Perfect alignment, identical intervals and frozen cameras read as machine-made. Small, deterministic variation reads as made by hand. Record each one in the motion spec:

```
VAR-01  role: list rows        channel: stagger delay   amp: ±1 f   seed: 7
VAR-02  role: hero product     channel: position drift  amp: 2 px @ 0.4 Hz   seed: 3
VAR-03  role: background plate channel: rotation        amp: ±0.5°  seed: 11
```

Starting amplitudes (at 30 fps): stagger jitter ±1–2 f; position drift 1–3 px at 0.3–0.8 Hz; rotation ±0.3–1°; simulated handheld 2–6 px at 0.3–0.8 Hz on the camera only; film grain on the whole frame, not per layer.

Never apply variance to: text in its read hold, data values, logos in their resolve frame, UI micro-interactions, anything in the locked layer.

**Code hosts (seek-safe, a pure function of seed, index and t):**

```ts
// Deterministic hash in [0, 1): same (seed, i) gives the same value on every render.
export const hash01 = (seed: number, i: number) => {
  let t = (Math.imul(seed, 0x9e3779b1) + Math.imul(i, 0x85ebca6b)) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
// VAR stagger offset in whole frames, within ±amp.
export const varFrames = (seed: number, i: number, amp: number) =>
  Math.round((hash01(seed, i) * 2 - 1) * amp);
// Smooth low-frequency drift in px, |value| <= ampPx, deterministic in t (seconds).
export const drift = (seed: number, t: number, ampPx: number, hz: number) =>
  ampPx * (0.6 * Math.sin(2 * Math.PI * hz * t + hash01(seed, 0) * 6.2832) +
           0.4 * Math.sin(2 * Math.PI * hz * 1.73 * t + hash01(seed, 1) * 6.2832));
```

Use it as `delayFrames = baseFrames * i + varFrames(7, i, 1)` and `x = x0 + drift(3, frame / fps, 2, 0.4)`. Never `Math.random()` or wall-clock time in a render.

**After Effects:**

```js
// VAR stagger: shifts this property's keyframes by a seeded ±1 frame (timeless seed = constant).
seedRandom(7, true);
var varF = Math.round(random(-1, 1));
valueAtTime(time - framesToTime(varF));

// VAR drift on Position: 2 px at 0.4 Hz, deterministic per layer and seed.
seedRandom(3, false);
wiggle(0.4, 2);
```

## 7. Sound and silence

- Sound is half the edit. Lead picture with sound (J-cut) to pull the viewer into the next beat; let sound linger (L-cut) to let a feeling finish. A 4–12 frame lead is a common start.
- Silence is a tool. One clean drop before the hero hit does more than any riser.
- Room tone under talking-head and real footage; a hard digital silence sounds like a mistake.
- Sound effects only for things with weight or meaning (ME-14).

## 8. Tension and release

Not every beat should feel good. Show the problem honestly (the 23:47 message nobody answered) before the relief. A piece that is upbeat from start to end has no release, so the end lands flat.

## 9. Performance (footage)

- Cut on a change of thought, a glance, a breath, not on a sentence's last word.
- Keep a pause that carries meaning; remove only filler that adds nothing.
- Reaction shots belong where the listener would actually look.
- Never let B-roll or a jump cut change what someone meant.

## Before / after (one beat)

**Before:** "Feature cards fade up with 80 ms stagger, `ease-in-out`, 0.6 s each, whoosh on each."

**After:** "Two cards, not three: the content has two. The card the viewer needs first (Zalo inbox) cuts in on `SPRING_SAAS_CARD`; the second follows 5 f later on `SNAPPY_ENTER_20_80` with `VAR-01` ±1 f, lagging and settling after the first. No whoosh; one soft tick on the first card only. Both hold still for 1.4 s of read time. Exit: both leave together on `FAST_EXIT_80_20` in 8 f as the camera cuts to the dashboard."
