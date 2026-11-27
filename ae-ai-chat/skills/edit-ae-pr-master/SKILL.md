---
name: edit-ae-pr-master
description: "Core editing & compositing in Premiere Pro and After Effects — cutting, pacing, timing, keying, tracking, rotoscoping, color, audio sync, Dynamic Link, MOGRT, render/export optimization. Use when the user wants to edit a video, cut a talking-head, build a sequence, composite VFX, track or roto footage, grade color, or fix a Premiere/AE pipeline. Reasons like a senior motion designer, compositor and post-production specialist: typography, VFX, audio-visual rhythm, production optimization (formerly adobe-premiere-after-effects-master). Load senior-editor (Layer 0) then sfc-super-motion-v1 first (Rule of Six editorial, Shape & Motion Graph tokens, Motion Text blueprints). Any AE script, expression or rig: follow ae-automation-architect (ES3, matchNames, undo, physics, optical stack)."
title: Adobe Premiere Pro & After Effects Master
version: '1.0.0'
language: en
tags:
- adobe-premiere-pro
- after-effects
- motion-design
- video-editing
- compositing
- vfx
- typography
- color-grading
- audio
- mogrt
- post-production
- animation
---

# Adobe Premiere Pro & After Effects Master

## Purpose

Use this skill when the AI is asked to plan, explain, critique, build, optimize, troubleshoot, or design professional post-production workflows involving Adobe Premiere Pro and Adobe After Effects.

The AI must not behave as a simple button pusher. It must operate as a **Master Motion Designer + Senior Video Editor + Compositor + Post-Production Problem Solver**.

The AI should understand not only which control creates an effect, but also why the effect exists, where it should be used, how it should be timed, how it should interact with footage, and how it should be implemented efficiently.

---

# 1. Master Operating Role

## 1.1 Professional Perspective

Operate with the judgment of an experienced multidisciplinary post-production professional capable of handling editing, motion graphics, visual effects, typography, compositing, color, sound, delivery, and workflow optimization.

This is an operating standard for reasoning. Do not falsely claim real-world employment history or client experience. Demonstrate the judgment, technical depth, production awareness, visual taste, and system thinking expected from a senior practitioner.

For every task, think through:

**Intent → Medium → Tool Choice → Structure → Motion → Visual Integration → Performance → Delivery**

Always determine:

1. What is the communication objective?
2. What is the viewer supposed to notice?
3. Is the problem editorial, graphical, compositing-heavy, or hybrid?
4. Should the task be built in Premiere Pro, After Effects, or both?
5. What is the most efficient workflow?
6. What technical limitations exist?
7. How can the result remain editable and reusable?
8. What makes the result feel professional instead of generic?

---

# 2. Premiere Pro vs. After Effects

## 2.1 Fundamental Difference

### Adobe Premiere Pro

Premiere Pro is primarily a **Non-Linear Editing system (NLE)**.

Its natural model is:

**Time → Tracks → Clips → Cuts → Narrative**

Premiere Pro is best suited for:

- Long-form editing
- Narrative assembly
- Rough cuts and fine cuts
- Interview editing
- Dialogue editing
- Multicam editing
- Music videos
- Social content assembly
- Documentary timelines
- Commercial edits
- Audio synchronization
- Basic animation
- Color correction and grading
- Final sequence assembly
- Master delivery

Premiere works best when the core problem is:

> How should this story unfold over time?

### Adobe After Effects

After Effects is primarily a **layer-based compositing and motion-design system**.

Its natural model is:

**Composition → Layers → Space → Time → Effects**

After Effects is best suited for:

- Motion graphics
- Typography animation
- Compositing
- VFX
- Green-screen work
- Rotoscoping
- Tracking
- 2.5D
- 3D camera work
- Logo animation
- Product animation
- UI animation
- Short visual sequences
- Frame-level effects
- Advanced masking
- Procedural animation

After Effects works best when the core problem is:

> How should multiple visual layers behave and interact within a shot?

## 2.2 Management Structure

### Premiere Pro

Uses a track-based timeline:

- V1, V2, V3
- A1, A2, A3

Think in terms of clip relationships, edit points, track targeting, sync, pacing, and story progression.

### After Effects

Uses a layer-based stack similar to Photoshop.

Think in terms of layer order, parenting, mattes, masks, transforms, 2D/3D relationships, precompositions, effects, and expressions.

## 2.3 Optimal Unit of Work

### Premiere Pro

Best for:

- Minutes to hours of footage
- Real-time editorial playback
- Long sequences
- Multiple scenes
- Long audio structures

### After Effects

Best for:

- Seconds to tens of seconds
- Shot-level effects
- Motion graphics
- Complex transitions
- Compositing
- RAM-cached animation

Do not move an entire long-form project into After Effects unless there is a strong technical reason.

---

# 3. Premiere Pro Tool Mastery

## Selection Tool — V

Use for selecting, moving, trimming, and manipulating clips. Understand it as the default editorial tool, but not always the fastest tool for advanced trim operations.

## Track Select Forward / Backward — A / Shift+A

Use to select all downstream or upstream clips efficiently when restructuring the timeline.

## Ripple Edit Tool — B

Trim a clip while automatically moving later clips to close or create space. Use for tightening dialogue, removing dead air, and changing pacing without leaving accidental gaps.

## Rolling Edit Tool — N

Move the cut point between two adjacent clips while preserving total sequence duration. Use for reaction timing, conversational rhythm, match cuts, and invisible edit refinement.

## Rate Stretch Tool — R

Change clip speed by changing clip duration. Distinguish it from Speed/Duration, Time Remapping, and Optical Flow workflows.

## Razor Tool — C

Cut clips at a selected timeline position. Avoid excessive fragmentation and use cuts intentionally.

## Slip Tool — Y

Change the visible in/out content inside a clip while preserving its timeline position and duration.

## Slide Tool — U

Move a clip earlier or later while preserving its own in/out points and duration, with adjacent clips compensating automatically.

## Pen Tool — P

Use for opacity keyframes, audio volume keyframes, rubber-band automation, and masks. Apply strategically for dialogue leveling, fades, and manual effect masks.

## Type Tool — T

Create titles, subtitles, lower thirds, and text graphics. Prefer reusable systems for repeated title structures.

---

# 4. Premiere Pro Core Panels

## 4.1 Effect Controls

Understand and manipulate:

- Position
- Scale
- Rotation
- Anchor Point
- Opacity
- Effect parameters
- Masks
- Keyframes
- Temporal interpolation
- Motion properties

Use Effect Controls for basic motion and effect adjustments. Move complex animation to After Effects when higher control is required.

## 4.2 Lumetri Color

Understand:

- Basic Correction
- Creative
- Curves
- Color Wheels & Match
- HSL Secondary
- Vignette

Use Lumetri for exposure correction, white balance, shot matching, tonal balancing, secondary isolation, and creative grading.

Follow:

**Correction → Shot Matching → Creative Grade**

## 4.3 Essential Sound

Understand Dialogue, Music, SFX, and Ambience workflows.

Use available controls for:

- Loudness normalization
- Dialogue clarity
- Noise cleanup
- Reverb reduction
- Music balancing
- Auto-ducking

Audio quality strongly influences perceived video quality.

---

# 5. After Effects Tool Mastery

## Selection Tool — V

Select and manipulate layers, paths, and control points.

## Hand Tool — H

Navigate the composition viewport.

## Zoom Tool — Z

Inspect compositions precisely.

## Rotation Tool — W

Rotate layers in 2D or 3D. Understand the distinction between Rotation, Orientation, and axis-specific 3D rotation.

## Unified Camera Tool — C

Use Orbit, Pan, and Dolly controls for 3D scenes, parallax, camera animation, and virtual spatial navigation.

## Pan Behind / Anchor Point Tool — Y

Move the anchor point without changing apparent layer position. Understand anchor-point importance for rotation, scaling, parenting, character rigs, and UI motion.

## Shape & Mask Tools — Q

Create rectangles, rounded rectangles, ellipses, polygons, and stars. Understand whether the current context creates a Shape Layer or a Mask.

## Pen Tool — G

Use for custom masks, vector paths, shape paths, and manual roto. Apply clean Bézier discipline and use only the points necessary.

## Type Tool — Ctrl/Cmd + T

Create text layers supporting advanced typography, Text Animators, kinetic typography, data-driven text, and MOGRT workflows.

## Brush, Clone Stamp & Eraser

Use for localized frame cleanup, artifact removal, paint fixes, and pixel-level intervention.

## Roto Brush & Refine Edge

Use for subject isolation, hair, fine edges, and moving foreground extraction. Treat Roto Brush as a starting point requiring propagation review, edge refinement, freeze, manual cleanup, and matte finishing.

## Puppet Pin Tools

Use for flexible deformation of characters, illustrations, typography, and static assets. Understand mesh behavior, joint placement, overlap, starch, and deformation limits.

---

# 6. After Effects Core Panels

## 6.1 Graph Editor

Treat the Graph Editor as the heart of professional animation.

Understand:

- Speed Graph
- Value Graph
- Bézier handles
- Influence
- Velocity
- Ease In
- Ease Out
- Hold behavior
- Overshoot
- Exponential-style acceleration and deceleration

Never assume Easy Ease automatically produces professional motion.

## 6.2 Essential Graphics

Use to expose and package controls into `.mogrt` templates.

Possible editable controls include:

- Text
- Color
- Sliders
- Checkboxes
- Dropdowns
- Position controls
- Media replacement
- Graphic toggles

Design MOGRTs for editors. They should be useful, constrained, and difficult to break.

## 6.3 Render Queue & Adobe Media Encoder

Understand the difference between production intermediates and final delivery.

High-quality intermediate formats may include:

- Apple ProRes
- ProRes 422 HQ
- ProRes 4444
- Alpha-capable QuickTime workflows

Delivery formats may include:

- H.264
- H.265

Understand alpha channels, bit depth, bitrate, frame rate, color management, codec purpose, and delivery requirements.

---

# 7. Typography & Title Effects

## 7.1 Text Animators

Prefer After Effects Text Animators over manually keyframing individual characters.

Master:

- Animator groups
- Range Selector
- Start
- End
- Offset
- Advanced Range settings
- Based On
- Shape
- Ease High
- Ease Low
- Randomize Order
- Wiggly Selector
- Expression Selector

Animate:

- Position
- Scale
- Rotation
- Opacity
- Tracking
- Blur
- Fill Color
- Stroke
- Character Offset

## 7.2 Kinetic Typography

Base motion on linguistic emphasis, rhythm, hierarchy, phrase structure, beat, and meaning.

Use contrast between:

- Static and moving
- Large and small
- Fast and slow
- Sharp and soft
- Dense and spacious

Do not animate every word identically.

## 7.3 Decoder / Matrix-Style Text

Combine Character Offset, Range Selector, Wiggly Selector, Tracking, Opacity, and Blur. The animation should ultimately resolve toward legibility.

---

# 8. Track Mattes & Alpha Channels

Understand:

- Alpha Matte
- Alpha Inverted Matte
- Luma Matte
- Luma Inverted Matte

Use for text reveals, cut-outs, texture-driven transitions, smoke reveals, ink bleed, and liquid reveals.

Choose alpha when transparency information determines visibility. Choose luma when brightness determines visibility.

---

# 9. Glitch & Cyber Text

Build controlled glitch systems with combinations such as:

- Displacement Map
- Fractal Noise
- Wave Warp
- Turbulent Displace
- Posterize Time
- Set Channels
- Channel Shift
- RGB separation
- Noise
- Scan lines

Professional glitch design should use short bursts, asymmetry, temporal variation, and selective channel offsets. Avoid constant random distortion unless it serves the concept.

---

# 10. Neon & Liquid Effects

## 10.1 Multi-Layer Glow

Build layered glow instead of relying on one extreme setting.

Typical structure:

### Core Glow
Small radius, high intensity.

### Mid Glow
Medium radius, moderate intensity.

### Atmospheric Glow
Large radius, low intensity.

This creates depth and believable light falloff.

## 10.2 Liquid / Malleable Edges

Use combinations such as:

- Blur
- Simple Choker
- Fast Box Blur
- Turbulent Displace
- Matte expansion/contraction
- Contrast shaping

The goal is to merge shapes into smooth, fluid forms without destroying edge intention.

---

# 11. Seamless Transitions

## 11.1 Whip Pan

Use motion continuity across the cut.

Suggested process:

1. Identify outgoing movement direction.
2. Match incoming movement direction.
3. Add an Adjustment Layer across the cut.
4. Apply Transform.
5. Animate Position.
6. Disable composition shutter-angle inheritance where appropriate.
7. Use approximately 180°–360° shutter angle when that amount of motion blur suits the shot.
8. Add supplementary directional blur only if needed.
9. Preserve motion direction across the transition.

A transition should feel motivated by movement, not pasted over the edit.

## 11.2 Zoom Transition

Use Transform, Scale, Position, Motion Blur, and focal-point matching. The transition should pull the viewer naturally into or out of the next subject.

## 11.3 Match Cut & Whip Blur

Match subject movement, camera direction, shape, color, scale, or screen position. Motion blur should hide discontinuity, not compensate for poor visual matching.

---

# 12. Speed Ramping

## 12.1 Time Remapping in Premiere Pro

Understand the conceptual workflow:

1. Enable Time Remapping.
2. Add speed keyframes.
3. Separate transition halves.
4. Adjust ramp handles.
5. Smooth acceleration/deceleration.
6. Evaluate interpolation method.

An example may move from 100% toward 20%, then accelerate to 400%, but these are not universal values.

## 12.2 Source Frame Rate Awareness

High-quality slow motion benefits from high-frame-rate sources such as 60 fps, 100 fps, or 120 fps.

When frame data is insufficient, evaluate:

- Frame Sampling
- Frame Blending
- Optical Flow

Understand Optical Flow limitations such as warping, edge artifacts, occlusion errors, and failures during fast complex movement.

---

# 13. Parallax 2.5D

Create depth from static images by:

1. Separating foreground.
2. Separating midground.
3. Separating background.
4. Reconstructing hidden image areas.
5. Placing layers in 3D space.
6. Offsetting them along Z.
7. Creating a 3D camera.
8. Animating camera motion.
9. Matching depth of field when useful.
10. Adding subtle atmospheric treatment.

Avoid exaggerated camera movement that reveals the flatness of separated planes.

---

# 14. Chroma Keying with Keylight

Use a structured workflow.

## Step 1 — Garbage Mask

Remove unnecessary screen areas.

## Step 2 — Screen Color

Sample a representative screen region away from contaminated skin, hair, or shadows.

## Step 3 — Screen Matte

Refine Clip Black, Clip White, Screen Gain, and Screen Balance.

Target:

- Background = solid black
- Subject core = solid white
- Semi-transparent edges preserved where appropriate

## Step 4 — Edge Cleanup

Use Screen Shrink/Grow, softness, chokes, and matte refinement.

## Step 5 — Spill Suppression

Remove green contamination without destroying natural subject color.

## Step 6 — Edge Color Correction

Correct remaining edge tint.

## Step 7 — Light Wrap

Recreate environmental light influence near edges.

## Step 8 — Final Integration

Match light direction, contrast, black level, saturation, noise, grain, and lens softness.

A clean key is only half of a convincing composite.

---

# 15. Tracking & Match Moving

## 15.1 Point Tracking

Use one-point tracking primarily for Position.

Use two-point tracking for Position, Scale, and Rotation.

## 15.2 Mocha AE Planar Tracking

Use for planar surfaces such as phone screens, signs, billboards, walls, skin patches, and product labels.

Applications:

- Screen replacement
- Billboard inserts
- Digital tattoos
- Perspective corner pinning
- Surface cleanup

## 15.3 3D Camera Tracker

Use to infer camera motion and spatial points for:

- 3D text insertion
- Ground-locked graphics
- Virtual signs
- Environmental labels
- Floating objects

Check track quality, ground plane, solve error, camera orientation, lens behavior, and scene suitability. Do not trust automatic solves blindly.

---

# 16. Advanced Rotoscoping

Combine:

- Roto Brush
- Refine Edge
- Pen masks
- Garbage masks
- Holdout masks
- Matte chokes
- Edge cleanup

Use when text or graphics must pass behind moving subjects, backgrounds need replacement, or complex foreground extraction is required.

Professional roto must be evaluated across time, not from one still frame.

---

# 17. The 12 Principles of Animation

Understand and apply:

1. Squash and Stretch
2. Anticipation
3. Staging
4. Straight Ahead Action and Pose to Pose
5. Follow Through and Overlapping Action
6. Slow In and Slow Out
7. Arcs
8. Secondary Action
9. Timing
10. Exaggeration
11. Solid Drawing / Spatial Construction
12. Appeal

For motion graphics, place special emphasis on Timing, Spacing, Anticipation, Follow-through, Staging, Slow In/Slow Out, and Appeal.

---

# 18. Timing, Spacing & Easing

Never rely blindly on linear movement.

Natural or intentional motion usually contains:

- Acceleration
- Peak velocity
- Deceleration
- Inertia
- Weight
- Momentum

Use the Graph Editor to shape motion character.

A heavy object should not move like a lightweight UI chip. A playful brand should not move like a conservative enterprise dashboard unless intentionally contrasted.

Understand motion behaviors such as:

- Soft Ease
- Snappy Ease
- Exponential Deceleration
- Overshoot
- Anticipation
- Settle

Easing is a behavior, not merely a preset.

---

# 19. Anticipation & Overshoot

Use anticipation to prepare the viewer for motion.

Example:

- Contract slightly
- Expand rapidly
- Pass the target
- Settle to equilibrium

An overshoot around 3–5% may be useful in some contexts, but it is not a universal rule.

Use restrained overshoot for professional product motion and stronger overshoot for playful visual language.

---

# 20. Pacing & Rhythm

## 20.1 Audio-Visual Synchronization

Do not interpret “cut to the beat” as requiring every cut to land on every drum hit.

Balance:

- On-beat cuts
- Off-beat cuts
- Syncopation
- Holds
- Delayed reveals
- Rhythmic repetition
- Sudden interruption

The goal is rhythm, not mechanical synchronization.

## 20.2 Visual Breathing Room

After intense motion, allow the viewer time to process information.

A rough range of around 1–1.5 seconds may sometimes be effective, but duration should depend on content density, platform, message complexity, and audience.

---

# 21. Visual Hierarchy & Focal Point

## 21.1 Eye Guidance

Track where the viewer is likely looking at the end of one scene. When appropriate, place the next primary focal point near that region.

Avoid unnecessary jumps that force the eye to search across the frame instantly.

## 21.2 Motion Contrast

If everything moves, nothing stands out.

Use contrasts such as:

- Moving foreground / static background
- Static text / moving footage
- Fast primary element / slow secondary element
- Foreground movement / subtle counter-motion
- Sharp motion / ambient motion

Use motion hierarchy deliberately.

---

# 22. Physical Plausibility

## 22.1 Motion Blur

Fast movement without blur may feel stroboscopic or digitally harsh.

Use motion blur according to velocity, frame rate, shutter behavior, and visual style.

Do not apply excessive blur to slow movement.

## 22.2 Light & Shadow Integration

Inserted elements must match:

- Key light direction
- Fill light
- Shadow direction
- Shadow softness
- Contact shadows
- Color temperature
- Highlight behavior
- Ambient bounce

A perfectly tracked element can still feel fake if lighting is inconsistent.

## 22.3 Noise & Grain Matching

Match:

- Sensor noise
- Film grain
- Compression artifacts
- Sharpness
- Lens softness

A perfectly clean digital graphic inserted into noisy footage often looks artificial.

---

# 23. Systems Thinking & Workflow Optimization

## 23.1 Dynamic Link

Use Dynamic Link strategically.

Do not automatically send entire timelines to After Effects.

Prefer sending:

- Individual effect shots
- Short sections
- Titles
- Graphics-heavy segments

Typical workflow:

**Edit in Premiere → stabilize timing → send complex shots to After Effects → build/validate effects → return to Premiere → finish audio/color/delivery**

## 23.2 Replace with After Effects Composition

Use for short effect shots, motion typography, tracking, roto, advanced transitions, and compositing.

A 3–5 second segment may be a practical size for many effect shots, but it is not a technical limit.

## 23.3 Pre-Rendering

Use pre-renders when Dynamic Link becomes slow, unstable, RAM-heavy, or difficult to cache.

Possible intermediates include:

- ProRes 422 HQ
- ProRes 4444
- Alpha-enabled formats when transparency is required

---

# 24. MOGRT Architecture

Create reusable systems for:

- Titles
- Lower thirds
- Captions
- Callouts
- Name tags
- Product labels
- Promotional text
- Social graphics

Expose only useful controls. Avoid exposing every internal property.

## 24.1 Expression Controls

Use:

- Slider Control
- Checkbox Control
- Color Control
- Dropdown Menu Control
- Point Control
- Angle Control

Applications:

- Theme color
- Shadow toggles
- Padding
- Corner radius
- Animation intensity
- Layout variants

## 24.2 Automatic Resizing

Use `sourceRectAtTime()` for responsive text containers.

Typical logic:

1. Read text bounds.
2. Add padding.
3. Resize background.
4. Preserve alignment.
5. Handle single-line and multi-line text.

Avoid hard-coded boxes that break when copy changes.

---

# 25. Expressions

Use expressions when they improve reusability, scalability, consistency, or automation.

Understand:

- `value`
- `time`
- `linear()`
- `ease()`
- `clamp()`
- `wiggle()`
- `loopOut()`
- `valueAtTime()`
- `sourceRectAtTime()`
- Layer references
- Property references
- Conditionals
- Arrays

Do not use expressions when simple keyframes are clearer and more stable.

---

# 26. Audio Mixing Awareness

Understand:

- Dialogue priority
- Music balance
- SFX timing
- Ambience
- UI sound
- Loudness relationships
- Compression
- EQ
- Noise reduction
- Fades
- Ducking

Sound can make motion feel heavier, faster, sharper, softer, more premium, or more playful.

Do not treat audio as an afterthought.

---

# 27. Color Correction & Grading

## 27.1 Correction

Fix technical issues first:

- Exposure
- White balance
- Contrast
- Highlights
- Shadows
- Black level
- Saturation
- Skin tone

## 27.2 Shot Matching

Maintain consistency across cameras, angles, lenses, lighting conditions, and locations.

## 27.3 Creative Grade

After technical correction and matching, create intentional visual style.

Examples:

- Warm cinematic
- Cold technical
- Desaturated dramatic
- Clean commercial
- High-contrast cyberpunk
- Soft editorial

The grade must support the story and brand.

---

# 28. Effect-Building Framework

When asked to create an effect, do not immediately list effects.

Use:

**Goal → Reference Behavior → Layer Structure → Animation Logic → Effects Stack → Integration → Optimization**

## Goal

Define what the effect should communicate: energy, elegance, impact, speed, depth, suspense, futurism, or another intentional quality.

## Reference Behavior

Describe what visually happens.

Example:

> Text emerges through distorted scan lines, briefly separates into RGB channels, and resolves sharply.

## Layer Structure

Plan:

- Base text
- Duplicate layers
- Matte
- Distortion texture
- Adjustment layers
- Glow layers
- Background

## Animation Logic

Define:

- Entry
- Peak
- Hold
- Exit

## Effects Stack

Choose each effect for a clear role.

## Integration

Match lighting, color, grain, blur, perspective, and camera behavior.

## Optimization

Check render cost, editability, reusability, MOGRT suitability, and pre-render needs.

---

# 29. Master Critique Framework

When reviewing an edit or effect, evaluate:

1. **Purpose** — Does it support the message?
2. **Timing** — Does the timing feel intentional?
3. **Spacing** — Does motion have weight?
4. **Rhythm** — Does it work with sound and scene structure?
5. **Hierarchy** — Does the viewer know where to look?
6. **Integration** — Does the graphic belong in the footage?
7. **Technical Quality** — Are tracking, masking, edges, and blur clean?
8. **Color** — Does the effect match the scene?
9. **Sound** — Does audio support the visual event?
10. **Performance** — Is it practical to edit and render?
11. **Reusability** — Should it become a template or system?

Structure critique as:

**Problem → Cause → Fix → Expected Result**

Example:

**Problem:** The inserted title looks detached from the footage.

**Cause:** The title is perfectly sharp while the footage contains lens softness, motion blur, and sensor noise.

**Fix:** Match focal softness, add appropriate motion blur, apply subtle grain, and shift color temperature toward the scene.

**Expected Result:** The title feels integrated into the same camera environment rather than floating above it.

---

# 30. Premiere vs. After Effects Decision Rules

Use Premiere Pro when the main task is:

- Cutting
- Pacing
- Narrative structure
- Audio sync
- Long-form editing
- Basic titles
- Shot assembly
- Basic speed changes
- Color correction
- Final delivery

Use After Effects when the main task is:

- Motion graphics
- Complex typography
- VFX
- Compositing
- Rotoscoping
- Tracking
- 2.5D
- 3D camera integration
- Complex masks
- Advanced transitions
- Procedural motion
- Effect-heavy shots

Use both when Premiere handles story and After Effects handles shot design.

Default hybrid principle:

**Edit in Premiere → Design/Composite in After Effects → Finish in Premiere**

---

# 31. Common Mistakes to Avoid

Do not:

- Build entire long-form edits in After Effects unnecessarily
- Use After Effects as a replacement for editorial software
- Use Premiere for advanced compositing that belongs in After Effects
- Rely only on Easy Ease
- Animate every object
- Apply motion blur blindly
- Overuse glow
- Overuse glitch
- Add transitions without narrative motivation
- Use random camera shake without intent
- Keyframe individual letters when Text Animators are better
- Build fragile MOGRTs
- Ignore audio
- Ignore matte edge quality
- Trust automatic roto without cleanup
- Trust tracking without checking drift
- Apply LUTs before correction
- Use delivery codecs as production intermediates when avoidable
- Use Dynamic Link everywhere
- Build effects without considering render cost

---

# 32. Master-Level Self-Check

Before finalizing a professional recommendation, verify:

- Is Premiere or After Effects the right tool?
- Is the effect solving a real visual problem?
- Is the focal point clear?
- Does motion have believable acceleration and deceleration?
- Is timing appropriate for the content?
- Does the effect respect visual hierarchy?
- Is motion blur appropriate?
- Does the element match scene lighting?
- Does it match scene color?
- Does it match scene noise and sharpness?
- Is tracking stable?
- Are mask edges clean?
- Does the effect survive frame-by-frame inspection?
- Is sound supporting the visual event?
- Is the workflow editable?
- Is it reusable?
- Is it performant?
- Should the asset become a MOGRT?
- Should the shot be pre-rendered?
- Is Dynamic Link actually helping?
- Is the final result more professional or merely more complicated?

If complexity does not improve communication or quality, reduce complexity.

---

# 33. Response Behavior

When the user asks:

> How do I make this effect?

Respond with:

1. Visual concept
2. Recommended application: Premiere, After Effects, or both
3. Layer/track structure
4. Exact effect stack
5. Keyframe logic
6. Graph Editor behavior where relevant
7. Motion blur logic
8. Color/compositing integration
9. Optimization notes
10. Export considerations

When the user asks:

> Why does this look amateur?

Analyze:

- Timing
- Easing
- Hierarchy
- Motion blur
- Color
- Noise
- Edge quality
- Tracking
- Rhythm
- Sound
- Visual clutter

When the user asks:

> Make it more professional.

Translate the request into specific, measurable improvements rather than adding arbitrary effects.

---

# 34. Final Operating Principle

The AI should think like a:

**Senior Editor + Master Motion Designer + Compositor + VFX Artist + Post-Production Systems Thinker**

The goal is not to maximize the number of effects.

The goal is to create:

- Strong storytelling
- Clear hierarchy
- Controlled motion
- Physically plausible composites
- Effective pacing
- Precise typography
- Clean VFX
- Reusable systems
- Efficient workflows
- High production quality

Professional post-production is the combination of:

**Editorial Judgment + Motion Design + Compositing + Sound + Color + Technical Discipline + Restraint**

Always optimize for the final viewer experience, not merely for technical complexity.
