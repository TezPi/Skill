---
name: type-kinetic-fx
description: "Kinetic typography and text FX systems for After Effects & Premiere — text animators, reveals, lower thirds, titles, captions styling, glow/light/metal text, legibility and reading-speed timing, responsive MOGRT text templates. Use when the user asks for text motion, kinetic type, animated titles, lower thirds, subtitle styling, or a reusable typography template. Reasons from message hierarchy, reading speed, cognitive load, motion physics and optical lighting (formerly typography-fx-system-ae-pr). Any AE script, expression or rig: follow ae-automation-architect (ES3, matchNames, undo, physics, optical stack)."
title: Typography FX System for After Effects & Premiere Pro
version: '1.0.0'
language: en
tags:
- typography
- motion-typography
- after-effects
- premiere-pro
- mogrt
- kinetic-typography
- text-animators
- graph-editor
- glow
- light-sweep
- visual-hierarchy
- cognitive-load
- responsive-design
---

# Typography FX System for After Effects & Premiere Pro

## Purpose

Use this skill when the AI is asked to:

- Design animated typography
- Build title systems
- Create intros and hero text
- Build lower thirds
- Design subtitles and captions
- Create kinetic typography
- Create lyric videos
- Build HUD / UI callouts
- Create glowing, metallic, cyber, luxury, or cinematic text effects
- Package After Effects text systems as MOGRTs
- Optimize typography for Premiere Pro editors
- Diagnose poor text motion
- Improve readability, pacing, and contrast
- Automate text backgrounds and layout
- Build reusable text animation systems

The central principle is:

> **Text is not decoration. Text carries information. Every animation, lighting effect, and compositing decision must help the viewer understand the message faster and with less cognitive effort.**

The AI should behave like a:

**Senior Motion Typography Designer + After Effects Animator + Premiere Graphics Systems Designer + MOGRT Architect**

---

# 1. Core Operating Model

Before animating typography, reason through:

**Message → Role → Reading Time → Hierarchy → Motion → Contrast → Lighting → Responsiveness → Delivery**

Do not begin by choosing effects.

Determine first:

1. What does the text need to communicate?
2. How important is the text?
3. How quickly must it be read?
4. What visual environment surrounds it?
5. How much motion complexity is appropriate?
6. Does the text need to be reusable?
7. Will the editor change the copy later?
8. Does the animation preserve legibility?

The default priority is:

1. Message clarity
2. Reading time
3. Contrast
4. Hierarchy
5. Motion
6. Lighting
7. Style
8. Reusability
9. Technical polish

If style damages readability, reduce style.

---

# 2. Brief Deconstruction Framework

Before touching the timeline, decode the brief through three logical filters:

```text
[THE BRIEF]
│
├── 1. Role & Hierarchy Classification
│      └── Determines allowable effect complexity
│
├── 2. Reading Pace Equation
│      └── Determines minimum frame budget
│
└── 3. Visual Matrix / Environmental Context
       └── Determines contrast, lighting, and integration strategy
```

---

# 3. Typographic Role Classification

The effect complexity should depend on the text's communication role.

---

## 3.1 Hero / Title / Intro

Purpose:

- Visual hook
- Brand statement
- Section opener
- Campaign title
- Trailer title
- Major visual moment

Allowed complexity:

- Strong motion
- 3D integration
- Bold lighting
- Depth
- Glow
- Material effects
- Camera interaction
- Distortion
- Character-level animation

Typical display duration:

**Approximately 2–4 seconds**

This is contextual.

Do not force complex effects when the message is short and serious.

---

## 3.2 Lower Third / Subtitle / Caption

Purpose:

- Functional information
- Speaker identification
- Translation
- Dialogue support
- Data labeling

Priority:

**Readability first**

Avoid:

- Excessive glow
- Heavy displacement
- Long easing
- Large overshoot
- Decorative distortion
- Constant motion

Animation should usually be:

- Fast
- Clear
- Stable
- Predictable

A practical intro may often remain under roughly:

**10–15 frames**

depending on frame rate and content.

---

## 3.3 Kinetic Typography / Lyric Video

Purpose:

- Synchronize language with rhythm
- Emphasize emotional delivery
- Transform spoken or sung content into visual rhythm

Synchronize with:

- BPM
- Phrase accents
- Syllables
- Vocal cadence
- Tone of voice
- Musical structure

Do not animate every beat identically.

Use:

- On-beat emphasis
- Off-beat movement
- Holds
- Delayed reveals
- Contrast between strong and weak phrases

---

## 3.4 UI Callout / HUD Data

Purpose:

- Data visualization
- Technical labeling
- Futuristic interface
- Object annotation
- System feedback

Appropriate behaviors:

- Typing
- Stepped reveals
- Tracking changes
- Numeric updates
- Scanning
- Cursor behavior
- Encoded transitions

Keep information architecture clear.

Do not sacrifice scanability for “tech” decoration.

---

# 4. Reading Pace Equation

Typography animation requires enough time for:

- Intro motion
- Reading
- Outro motion

Use this planning equation:

**Total Frames = In Animation + Reading Frames + Out Animation**

Approximate reading frames:

**Reading Frames = Word Count × 0.35 seconds × FPS**

This corresponds roughly to:

- 200–250 WPM
- Around 3–4 words per second

Treat this as a planning heuristic, not a universal cognitive law.

Adjust for:

- Font size
- Text complexity
- Language
- Audience
- Screen size
- Content familiarity
- Background motion
- Accessibility needs

---

## 4.1 Example

At 24 FPS, for a 4-word phrase:

### Intro
12 frames ≈ 0.5 seconds

### Reading
4 × 0.35 × 24 = 33.6 frames

Approximate:

34 frames ≈ 1.4 seconds

### Outro
8 frames ≈ 0.33 seconds

### Total
12 + 34 + 8 = 54 frames

Approximately:

**2.25 seconds**

If the text disappears before the viewer can process it, the typography system has failed even if the animation looks impressive.

---

# 5. Frame Budget Logic

Before animating, define:

```text
TOTAL TEXT DURATION
├── INTRO
├── SUSTAIN
└── OUTRO
```

Typical structure:

```text
INTRO       10–20 frames
SUSTAIN     Reading time
OUTRO       8–12 frames
```

These values are starting ranges.

Do not treat them as rigid rules.

The Sustain phase should absorb most duration changes.

---

# 6. Contrast Control Matrix

Text must remain readable against its environment.

For functional text, a contrast ratio around:

**4.5:1**

is a strong accessibility-oriented target for normal-size text.

This threshold comes from UI/accessibility practice and should be treated as a useful reference for video graphics, not as a guarantee that all motion-video situations are compliant.

Also consider:

- Motion
- Texture
- Background complexity
- Text weight
- Stroke
- Glow
- Viewing distance
- Compression

---

# 7. Dynamic Background Protection

If the background changes constantly, add an intermediate contrast system.

Possible solutions:

- Dual-layer drop shadow
- Gradient scrim
- Black vignette
- Semi-transparent backplate
- Bounding box
- Blur panel
- Local darkening
- Light text stroke
- Background desaturation

Do not rely only on text color when the footage varies dramatically.

---

# 8. Three-Phase Motion Choreography

Every text animation should be considered as:

**Intro → Sustain → Outro**

```text
TEXT MOTION TIMELINE

├───────────────┼─────────────────────────────┼─────────────┤
│ INTRO         │ SUSTAIN                     │ OUTRO       │
│ 10–20 frames  │ Reading / mostly stable     │ 8–12 frames │
│ Wind-up/Burst │ Micro-motion or 95% static  │ Retract      │
└───────────────┴─────────────────────────────┴─────────────┘
```

The Sustain phase is not empty time.

It is the part where the viewer actually reads.

---

# 9. Intro Phase

The Intro should:

- Establish hierarchy
- Attract attention
- Resolve quickly
- Lead the eye into the reading state

Possible motion:

- Slide
- Mask reveal
- Scale
- Tracking
- Blur-to-sharp
- Character cascade
- Rotation
- Z-depth
- Wipe
- Light reveal

Do not keep the intro moving for so long that reading is delayed.

---

# 10. Sustain Phase

The Sustain should preserve readability.

Prefer:

- Static hold
- Very subtle drift
- Minor glow breathing
- Very small parallax
- Small light shimmer

Think:

**95% stable, 5% alive**

unless the format is explicitly kinetic typography.

---

# 11. Outro Phase

The Outro should:

- Exit quickly
- Preserve visual flow
- Lead toward the next scene
- Avoid stealing attention from upcoming content

Possible behaviors:

- Retract
- Mask close
- Slide out
- Fade
- Scale down
- Blur out
- Tracking collapse

The outro is usually shorter than the reading phase.

---

# 12. Motion Layering

Avoid revealing the entire block at once unless the design intentionally requires a hard cut.

Decompose:

**Line → Word → Character**

Use hierarchy.

Example:

1. Headline line enters
2. Important word accents
3. Supporting characters resolve

Motion should guide reading order.

---

# 13. Staggering & Cascading Logic

A useful character offset can be:

**1–2 frames per character**

This can create a kinetic wave.

The exact offset depends on:

- Text length
- FPS
- Emotion
- Language
- Reading direction

Do not use the same stagger for a 5-letter title and a 40-character sentence.

---

# 14. Reading Direction

The cascade should normally support natural reading flow.

Examples:

- Left-to-right languages: left → right
- Right-to-left languages: right → left
- Vertical typography: top → bottom where appropriate

Do not impose left-to-right motion universally.

---

# 15. Graph Editor Mindset

Avoid default Linear motion for polished animation unless mechanical constant-speed motion is intentional.

Think in terms of:

- Acceleration
- Deceleration
- Inertia
- Weight
- Arrival
- Departure

---

# 16. Sharp Pop-In

For energetic text:

- Begin with high velocity
- Decelerate strongly toward the final position

A strong Ease Out may use high influence values.

A practical starting range can be:

**75%–90% influence**

depending on the graph.

Do not copy influence values blindly.

Judge:

- Distance
- Duration
- Scale
- Visual weight

---

# 17. Controlled Overshoot

A common motion structure:

**0% → 105% → 100%**

with the final settling phase over roughly:

**4 frames**

This can simulate elasticity.

Use overshoot according to brand tone.

Appropriate:

- Playful
- Energetic
- Tech
- Social

Use less for:

- Luxury
- Editorial
- Serious finance
- Institutional design

---

# 18. Text Animators — Professional Standard

Do not split every character into separate layers unless there is a specific reason.

Use Text Animators for scalable character/word/line animation.

Possible properties:

- Position
- Scale
- Rotation
- Opacity
- Tracking
- Blur
- Fill Color
- Stroke Color
- Character Offset

---

# 19. Range Selector Framework

Example starting state:

```text
Position: +100 px Y
Opacity: 0%
Tracking: +20
```

Then use Range Selector to reveal the text.

This allows one text layer to control many characters cleanly.

---

# 20. Advanced Range Selector Configuration

Useful controls:

### Units
Percentage

### Based On
- Characters
- Characters Excluding Spaces
- Words
- Lines

### Shape
Possible shapes:

- Square
- Ramp Up
- Ramp Down
- Triangle
- Round
- Smooth

For fluid progressive reveals, Ramp Up can be useful.

---

# 21. Ease High / Ease Low

A possible starting configuration:

- Ease High: +80%
- Ease Low: +30%

This can produce a more inertial transition inside the selector.

Treat these as starting values.

Do not assume they replace the Graph Editor in every case.

---

# 22. Clean Reveal with Matte

For typography that emerges from a boundary:

1. Create text animation.
2. Create a Shape Layer.
3. Position the Shape Layer as the reveal boundary.
4. Use Alpha Matte.
5. Animate the text behind the matte.

This produces cleaner results than masking every text layer separately.

---

# 23. Kinetic Wave Logic

A good character cascade should create:

- Direction
- Rhythm
- Hierarchy
- Momentum

Avoid a “typewriter” appearance unless typing is the intended concept.

Character stagger and typing simulation are not the same thing.

---

# 24. Typography Lighting Principle

Do not treat Glow as decoration.

Lighting should communicate:

- Material
- Energy
- Depth
- Environment
- Brand tone

Think in optical layers.

---

# 25. Typography Optical Stack

Recommended conceptual structure:

```text
Layer 4 — Light Sweep / Shimmer
Layer 3 — Atmospheric Glow
Layer 2 — Secondary Glow
Layer 1 — Core Glow
Layer 0 — Base Text
```

Each layer has a different optical purpose.

---

# 26. Core Glow

Purpose:

- Define luminous edge
- Preserve text anatomy
- Create high-energy core

Possible starting values:

- Radius: 5–10 px
- Intensity: 1.5–2.0
- Threshold: around 60%

These values are resolution-dependent.

The core should remain tight.

---

# 27. Secondary Glow

Purpose:

- Transition from the luminous edge into surrounding space

Possible starting values:

- Radius: 40–70 px
- Intensity: 0.5–0.8

Avoid making it brighter than the core.

---

# 28. Atmospheric Glow

Purpose:

- Integrate text into environment
- Simulate haze
- Create large-scale light contamination

Possible starting values:

- Radius: 200–400 px
- Intensity: 0.1–0.2

This layer should be very subtle.

---

# 29. Why One Large Glow Fails

A single large-radius high-intensity Glow often causes:

- Muddy edges
- Lost letter anatomy
- Gray haze
- Reduced contrast
- Poor readability
- Amateur-looking bloom

Professional glow uses:

**Core → Falloff → Atmosphere**

not one oversized blur.

---

# 30. Light Sweep / Shimmer

Use CC Light Sweep or equivalent surface-light logic to suggest:

- Metallic material
- Luxury
- Polished glass
- Premium finish
- Energy scan

A common directional starting point:

- -45°
- +135°

These angles are stylistic conventions, not physical requirements.

Match the scene lighting where possible.

---

# 31. Sweep Timing

Keep the sweep relatively fast.

A useful range can be:

**8–12 frames**

A slow sweep often:

- Distracts from reading
- Feels decorative
- Exposes the effect
- Reduces perceived quality

The sweep should support the text, not become the main message.

---

# 32. Blend Mode Strategy

For light text on dark backgrounds:

Possible modes:

- Screen
- Color Dodge
- Linear Dodge (Add)

Use Color Dodge carefully because it can:

- Clip highlights
- Shift saturation
- Blow out footage

For dark text on light backgrounds:

Possible modes:

- Multiply
- Linear Burn
- Normal

A thin contrasting stroke may help separation.

---

# 33. Material-Based Typography

Before adding lighting, identify material intent.

Examples:

- Neon
- Chrome
- Glass
- Holographic
- Matte plastic
- Printed ink
- LED
- Metallic foil

Each requires different:

- Highlight
- Shadow
- Reflection
- Glow
- Edge sharpness

Do not use neon glow on typography that is supposed to feel like printed ink.

---

# 34. Motion + Lighting Synchronization

Lighting animation should be synchronized with motion.

Example:

When text lands:

- Main motion decelerates
- Core glow peaks
- Secondary glow follows
- Atmospheric glow lingers
- Light sweep occurs after readability is established

Do not trigger every effect simultaneously by default.

Layer temporal events.

---

# 35. Effect Hierarchy

Use effect hierarchy:

1. Motion
2. Legibility
3. Material
4. Light
5. Atmosphere
6. Decorative detail

Do not solve a weak motion design by adding more glow.

---

# 36. Premiere Pro vs. After Effects Responsibility

Use After Effects for:

- Advanced Text Animators
- Character-level animation
- Range Selectors
- Graph Editor
- Complex glow stacks
- Light Sweep
- 3D typography
- Expressions
- Responsive MOGRT systems

Use Premiere Pro for:

- Editorial placement
- Sequence timing
- Simple text edits
- MOGRT parameter changes
- Batch editing
- Long-form timeline management

Default workflow:

**Design in After Effects → Package as MOGRT → Edit and scale in Premiere Pro**

---

# 37. MOGRT Architecture

A professional MOGRT should allow the editor to change the message without breaking the design.

Expose only useful controls.

Examples:

- Master text
- Secondary text
- Text color
- Accent color
- Background color
- Padding
- Alignment
- Shadow toggle
- Glow intensity
- Animation style
- Duration-safe controls

Do not expose every internal property.

---

# 38. Adaptive Box

Use expressions so the text container resizes automatically.

Apply to Rectangle Path Size:

```jsx
padding = [80, 40];
targetText = thisComp.layer("MASTER_TEXT");
boxWidth = targetText.sourceRectAtTime(time, false).width + padding[0];
boxHeight = targetText.sourceRectAtTime(time, false).height + padding[1];
[boxWidth, boxHeight];
```

This allows the box to follow text width and height.

---

# 39. Adaptive Box Position

Apply to the Rectangle Path Position:

```jsx
targetText = thisComp.layer("MASTER_TEXT");
rect = targetText.sourceRectAtTime(time, false);
[rect.left + rect.width / 2, rect.top + rect.height / 2];
```

Purpose:

- Keep the container centered on the text bounds
- Prevent manual repositioning
- Support variable copy

---

# 40. Padding Architecture

Do not hard-code padding without considering hierarchy.

Possible controls:

```text
Horizontal Padding
Vertical Padding
Corner Radius
Stroke Width
Backplate Opacity
```

Expose these as Essential Graphics controls when useful.

---

# 41. Responsive Design — Time

Use Responsive Design — Time to pin:

- Intro
- Outro

Allow:

- Sustain section to stretch

This ensures that when editors extend or shorten the MOGRT in Premiere:

- Intro speed remains stable
- Outro speed remains stable
- Easing remains stable
- Only reading time changes

This is a core production requirement for reusable templates.

---

# 42. Intro / Outro Protection

Pin regions based on animation logic.

Example:

```text
[INTRO PIN] [------ FLEXIBLE SUSTAIN ------] [OUTRO PIN]
```

Do not allow the editor to accidentally stretch a 10-frame intro into 40 frames.

---

# 43. Typography Data Architecture

Recommended layer structure:

```text
TYPOGRAPHY_MASTER
│
├── MASTER_TEXT
├── SUPPORT_TEXT
├── TEXT_MATTE
├── BACKPLATE
├── GLOW_CORE
├── GLOW_SECONDARY
├── GLOW_ATMOSPHERE
├── LIGHT_SWEEP
└── CONTROLS
```

Use:

- Clear names
- Expressions
- Parent controls
- Essential Graphics exposure

Avoid:

- Text 1
- Text 2 copy
- Glow copy 4
- Shape Layer 17

---

# 44. Control Layer Architecture

Create a master control Null or Shape Layer.

Possible controls:

```text
Typography FX Controls
├── Text Color
├── Accent Color
├── Glow Color
├── Glow Intensity
├── Intro Speed
├── Stagger Amount
├── Overshoot Amount
├── Padding X
├── Padding Y
├── Shadow Toggle
└── Backplate Opacity
```

This improves:

- Reusability
- Debugging
- MOGRT packaging
- Collaboration

---

# 45. Expression Strategy

Expressions should automate repeated relationships.

Useful functions:

- `sourceRectAtTime()`
- `linear()`
- `ease()`
- `clamp()`
- `valueAtTime()`
- `loopOut()`

Do not use expressions just to appear advanced.

Use them when they reduce manual maintenance.

---

# 46. Lower Third Logic

Lower thirds should prioritize:

1. Name
2. Role / descriptor
3. Optional brand marker

Motion should:

- Enter quickly
- Settle immediately
- Stay readable
- Exit cleanly

Avoid:

- Long glow animation
- Excessive character distortion
- Constant movement

---

# 47. Subtitle / Caption Logic

Captions should emphasize:

- Speed
- Clarity
- Contrast
- Stability

Use minimal motion.

Consider:

- Safe margins
- Mobile screens
- Multi-line wrapping
- Background changes
- Speaker identification
- Localization

Do not use per-character effects that interfere with reading unless the format is explicitly expressive.

---

# 48. Hero Title Logic

Hero titles can support stronger effects.

Possible structure:

```text
Anticipation
→ Burst / Reveal
→ Resolve
→ Reading Hold
→ Light Accent
→ Exit
```

Even hero typography needs a stable reading phase.

---

# 49. HUD / Technical Text Logic

Use:

- Stepped timing
- Monospaced or technical typography where appropriate
- Controlled tracking
- Numeric alignment
- Scanning
- Small indicator motion

Avoid random glitch.

Technical design should feel systematic.

---

# 50. Kinetic Typography Logic

Motion should interpret language.

Examples:

Word meaning:

- “fall” → downward motion
- “expand” → scale outward
- “impact” → sharp arrival
- “whisper” → low contrast / soft movement

Use semantic motion where useful.

Do not literalize every word.

---

# 51. Audio Synchronization

Typography may synchronize to:

- Beat
- Snare
- Kick
- Vocal consonant
- Phrase start
- Phrase end
- Silence
- Crescendo

Do not attach every keyframe to every beat.

Use rhythmic contrast.

---

# 52. Cognitive Load Rules

Avoid simultaneous competition between:

- Complex footage
- Strong typography motion
- Bright glow
- Camera movement
- Dense copy
- Fast cuts

If the background is complex, simplify the typography.

If the typography is complex, simplify the surrounding scene.

---

# 53. Visual Anchor Continuity

Track where the viewer is looking.

When one title exits, place the next important element near the viewer's existing gaze position when appropriate.

Avoid unnecessary focal jumps.

Typography choreography should guide the eye across scenes.

---

# 54. Typography Anatomy Protection

Effects must preserve:

- Counter shapes
- Stem clarity
- Stroke structure
- Kerning
- Character recognition
- Word silhouette

If glow or blur destroys letter anatomy, reduce the effect.

---

# 55. Motion Blur

Use motion blur for fast positional or rotational movement.

Do not use excessive blur on:

- Subtitles
- Lower thirds
- Small UI text

Blur should support motion continuity without damaging legibility.

---

# 56. QA — Legibility

Senior sign-off criteria:

- Text can be read without strain
- Background contrast is sufficient
- Important letterforms remain intact
- Copy does not disappear before reading completes
- Backplates or shadows work on difficult footage

Useful target:

**Contrast ≈ 4.5:1 or stronger for normal-size functional text**

where practical.

---

# 57. QA — Timing

Useful starting standards:

- In-animation: < 0.6 s
- Out-animation: < 0.4 s
- Sustain: ≥ 1.2 s for short functional text

These are not universal.

Always calculate reading time.

Common failure:

> Scene changes before the viewer finishes reading.

---

# 58. QA — Graph Quality

Check:

- No unintended Linear keyframes
- No abrupt velocity spikes
- Overshoot settles cleanly
- Stagger feels directional
- Motion has mass
- Arrival supports readability

Linear motion is acceptable only when mechanically intentional.

---

# 59. QA — Lighting

Check:

- Base text remains readable
- Core glow is distinct
- Secondary glow is controlled
- Atmospheric glow is subtle
- Light color fits the scene
- Light Sweep does not distract
- Glow does not create gray fog

---

# 60. QA — Data Architecture

Check:

- Text changes do not break layout
- Box auto-sizes
- Intro and outro are pinned
- Sustain duration is flexible
- Essential Graphics controls are clear
- Layers are named
- Expressions are robust
- MOGRT can be edited safely in Premiere

---

# 61. Common Logic Errors

Avoid:

- Manual resizing every time the text changes
- Splitting every letter into separate layers
- Animating all text at once
- Using default Linear keyframes
- Applying one giant Glow
- Making every title overshoot
- Using too much Light Sweep
- Using glow on light backgrounds without contrast strategy
- Making subtitles move constantly
- Ignoring reading duration
- Using the same animation for every hierarchy level
- Building a MOGRT that breaks with longer text
- Hard-coding box width
- Stretching intro and outro timing with template duration
- Treating 4.5:1 as the only factor in video readability
- Designing only for one line of text
- Ignoring localization

---

# 62. Localization Resilience

Test with:

- Longer names
- Two-line titles
- Different languages
- Wider character sets
- Diacritics
- Mixed case
- Numerals

Use:

- Flexible boxes
- Safe margins
- Dynamic alignment
- Responsive line breaks

Do not build a MOGRT that only works with the original English copy.

---

# 63. Senior Typography Critique Framework

When reviewing animated text, evaluate:

## 1. Role
Does the animation match the text's function?

## 2. Readability
Can it be read easily?

## 3. Reading Time
Does it remain long enough?

## 4. Hierarchy
What is seen first?

## 5. Motion
Is the movement physically convincing?

## 6. Rhythm
Does it align with audio and scene pacing?

## 7. Contrast
Does the text survive the background?

## 8. Lighting
Does the optical stack support material and environment?

## 9. Anatomy
Are letterforms preserved?

## 10. System
Can the effect be reused safely?

---

# 64. Problem → Cause → Fix → Result

Structure typography recommendations as:

**Problem → Cause → Technical Fix → Expected Result**

Example:

**Problem:** The title looks muddy and difficult to read.

**Cause:** A single high-radius Glow is blurring the letter edges and reducing local contrast.

**Technical Fix:** Replace the single Glow with a three-tier system: tight high-intensity core, medium falloff, and low-intensity atmospheric glow.

**Expected Result:** The title keeps a luminous appearance while restoring crisp typography anatomy.

---

# 65. Response Behavior

When asked:

> “How should I animate this title?”

Respond with:

1. Typographic role
2. Reading-time requirement
3. Intro
4. Sustain
5. Outro
6. Text Animator structure
7. Stagger logic
8. Graph behavior
9. Contrast protection
10. Optional lighting
11. MOGRT considerations

When asked:

> “How do I make this typography look premium?”

Translate “premium” into:

- Controlled motion
- Restrained overshoot
- Strong typography
- Clean hierarchy
- Refined surface lighting
- Fast Light Sweep
- Subtle glow
- High contrast
- Stable Sustain phase

Do not simply add more effects.

When asked:

> “How do I turn this into a MOGRT?”

Respond with:

1. Clean master text structure
2. Essential Graphics controls
3. `sourceRectAtTime()` architecture
4. Adaptive box
5. Padding controls
6. Responsive Design — Time
7. Localization testing
8. Premiere validation

---

# 66. Master-Level Self-Check

Before finalizing a typography system, verify:

- Is the text's role correctly classified?
- Is effect complexity appropriate?
- Is reading time sufficient?
- Does the intro resolve quickly?
- Is the Sustain phase stable?
- Is the outro efficient?
- Does stagger support reading direction?
- Is motion eased intentionally?
- Is overshoot appropriate to brand tone?
- Are Text Animators used instead of unnecessary layers?
- Does the Range Selector behave smoothly?
- Is contrast sufficient?
- Does the background need a scrim or container?
- Is letter anatomy preserved?
- Is the glow layered correctly?
- Does Light Sweep fit the material?
- Does lighting harmonize with the scene?
- Is the box responsive?
- Does the MOGRT survive longer text?
- Are intro and outro protected?
- Can Premiere editors use it without breaking it?
- Is the effect improving communication rather than distracting from it?

---

# 67. Final Operating Principle

The AI should think like a:

**Senior Motion Typography Designer + Cognitive Visual Designer + After Effects Systems Animator + Premiere MOGRT Architect**

The objective is not:

> “Make the text move.”

The objective is:

> **Make the message arrive clearly, rhythmically, beautifully, and reliably across real production workflows.**

The governing model is:

**Role → Reading Time → Hierarchy → Motion → Contrast → Lighting → Responsiveness → Delivery**

And the governing rule is:

> **Legibility before decoration.  
> Reading time before transition speed.  
> Motion hierarchy before motion quantity.  
> Optical structure before glow intensity.  
> Automation before repetitive manual work.**
