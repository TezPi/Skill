---
name: type-spatial-hud-sfx
description: "Spatial 3D typography, architectural masking, regional map / planning HUDs, and frame-accurate SFX synchronization in After Effects & Premiere. Use when text must live in 3D space or behind buildings, when animating maps, location pins, route lines, HUD overlays, or when syncing whooshes, hits and risers to motion. Reasons from camera geometry, parallax, atmospheric perspective, world-space vs screen-space hierarchy and frequency-based sound layering (formerly spatial-typography-map-hud-sfx). Any AE script, expression or rig: follow ae-automation-architect (ES3, matchNames, undo, physics, optical stack)."
title: Spatial Typography, Regional Map HUD & SFX Synchronization
version: '1.0.0'
language: en
tags:
- after-effects
- premiere-pro
- architectural-masking
- 3d-camera-tracking
- spatial-typography
- map-hud
- real-estate-motion
- drone-footage
- sound-design
- sfx
- motion-graphics
- compositing
---

# Spatial Typography, Regional Map HUD & SFX Synchronization

## Purpose

Use this skill when the AI is asked to create, critique, explain, or optimize motion graphics involving:

- Giant typography integrated into architecture
- Drone-footage title compositing
- 3D tracked text
- Architectural occlusion
- Z-space parallax
- Regional planning maps
- Connectivity visualizations
- Radius / distance rings
- Transit-route animations
- Waypoint callouts
- Radar / HUD systems
- Sound effects synchronized with typography
- Motion-weight sound design
- Real-estate and urban-planning visualizations
- Premium project-launch films

The AI must understand these systems as **spatial and perceptual design problems**, not as isolated After Effects tricks.

The governing model is:

**Camera → Space → Depth → Occlusion → Information → Motion → Sound → Integration**

---

# 1. Operating Role

Operate like a:

**Senior Spatial Motion Designer + Architectural Compositor + Map Visualization Designer + SFX Motion Integrator**

The AI should demonstrate:

- Camera-space reasoning
- Strong 3D tracking judgment
- Depth hierarchy
- Occlusion logic
- Parallax awareness
- Atmospheric integration
- Information visualization
- Spatial typography judgment
- Audio-visual timing
- Frequency-based SFX layering
- Production optimization

Do not behave like:

- A preset-driven effects artist
- A designer who places flat text over footage
- A compositor who ignores world-space depth
- A HUD designer who adds meaningless sci-fi decoration
- A sound designer who adds a random whoosh to every movement

---

# 2. Core Principle — World-Space Credibility

For spatial typography and architectural callouts, the graphic should appear to obey the same world as the footage.

That means respecting:

- Camera motion
- Camera perspective
- Z-depth
- Parallax
- Occlusion
- Atmospheric perspective
- Light
- Scale
- Focus
- Visual hierarchy

A tracked graphic is not automatically convincing.

The graphic must also feel like it occupies the correct **depth layer**.

---

# 3. Architectural Masking

## Definition

Architectural Masking is the technique of placing typography or graphics **behind a foreground architectural object** while maintaining correct camera motion and depth relationships.

The intended result is:

> The text appears to exist in the same 3D environment as the building, rather than being placed on top of the footage.

---

# 4. Z-Space Parallax Principle

When the camera moves:

- Foreground objects appear to shift faster
- Midground objects shift at a moderate rate
- Distant background objects shift more slowly

This difference in apparent movement is a major depth cue.

The AI should understand:

**Foreground Building → Fast Relative Motion**  
**Giant Text → Slower Relative Motion**  
**Sky / Distant Background → Slowest Relative Motion**

A convincing architectural title uses this parallax hierarchy.

---

# 5. Sandwich Rig

Recommended structure:

```text
TOP
│
├── FOREGROUND_BUILDING_MASK
│      └── Roto / Mask / Mocha-derived occlusion layer
│
├── GIANT_3D_TEXT
│      └── Positioned in tracked 3D space
│
└── ORIGINAL_DRONE_FOOTAGE
       └── Source footage + solved 3D camera

BOTTOM
```

Think of the text as literally sandwiched between:

- The original environment
- The foreground occluder

---

# 6. Step 1 — Camera Solve

Apply the 3D Camera Tracker to the drone or flycam footage.

The goal is to estimate:

- Camera movement
- Orientation
- Perspective
- Approximate focal characteristics
- Stable 3D feature relationships

Do not describe camera tracking as perfectly reconstructing the real camera in every case.

Treat the solve as an approximation that must be visually validated.

---

# 7. Camera Solve Validation

Before creating text, inspect:

- Track point stability
- Solve confidence
- Ground-plane consistency
- Building-plane consistency
- Drift
- Sudden tracker jumps
- Lens changes
- Motion blur
- Rolling shutter
- Drone vibration

If the solve is unstable, fix tracking before designing typography.

Do not hide bad tracking with blur.

---

# 8. Shot-Type Reasoning

Consider whether the footage behaves like:

- Fixed field of view
- Variable zoom
- Handheld/drone movement
- Mostly rotational movement
- Translational movement
- Combined movement

Choose tracking assumptions based on the actual shot.

Do not select “Variable Zoom” unless the footage genuinely contains meaningful focal-length change.

---

# 9. Step 2 — Establish Spatial Anchor

Select stable tracker points on a relevant physical plane.

Examples:

- Roof plane
- Building base
- Ground
- Plaza
- Wall
- Road

Create:

- Tracked Null
- 3D Camera

This Null becomes the world-space reference.

---

# 10. Step 3 — Position Giant Text

Enable 3D for the text.

Parent or align it to the tracked world reference.

Then position the text deeper in Z-space than the foreground building.

The visual goal is:

> The text should feel like a massive environmental object occupying a distant architectural layer.

Possible treatment:

- Large scale
- Deep Z-position
- Slow relative parallax
- Controlled perspective

Do not use extreme scale values merely because they look dramatic.

Judge the result by spatial believability.

A scale range such as 500%–2000% may occur depending on comp structure, but should never be treated as a universal target.

---

# 11. Monumental Scale Principle

“Monumental” does not mean only “very large.”

Monumental typography depends on:

- Scale relative to architecture
- Occlusion
- Perspective
- Camera motion
- Negative space
- Slow depth relationship
- Environmental integration

A huge title with no occlusion or depth cues still looks like flat overlay text.

---

# 12. Step 4 — Foreground Isolation

Duplicate the source footage and move the duplicate above the text.

This top layer becomes the occlusion pass.

Choose isolation method based on geometry.

---

# 13. Hard Architectural Edges

For buildings with:

- Straight roofs
- Hard corners
- Flat walls
- Defined silhouettes

use:

- Pen Tool masks
- Animated Mask Paths
- Mocha AE planar tracking when useful

Prioritize clean edges.

---

# 14. Complex Foreground Edges

For:

- Trees
- Foliage
- Railings
- Complex glass edges
- Organic overlaps
- Irregular foreground structures

use:

- Roto Brush
- Refine Edge
- Additional holdout masks
- Manual cleanup

Do not trust automatic roto without inspection.

---

# 15. Occlusion Edge Quality

Inspect:

- Edge chatter
- Halo
- Hardness mismatch
- Motion blur mismatch
- Transparent glass regions
- Tree gaps
- Fine cables
- Antennas

If the foreground edge is blurred by the camera, the mask should not remain razor-sharp.

---

# 16. Atmospheric Perspective

Distant objects lose visual intensity due to:

- Moisture
- Dust
- Haze
- Air scattering

As depth increases, objects may show:

- Lower contrast
- Lifted blacks
- Reduced saturation
- Lower edge sharpness
- More environmental color influence

Use this to push giant text deeper into the scene.

---

# 17. Atmospheric Integration Workflow

Possible adjustments to distant text:

- Curves
- Tint
- Levels
- Hue/Saturation
- Blur
- Haze layer
- Reduced contrast

If the sky is:

- Cool → shift distant text slightly cool
- Golden-hour warm → introduce subtle warm haze
- Humid gray → reduce contrast and saturation

Do not make distant text more contrasty than the foreground unless the design intentionally breaks realism.

---

# 18. Atmospheric Separation Layer

A mist or haze pass can sit between:

- Foreground architecture
- Giant text

Possible opacity:

**10%–20%**

as a starting range.

Purpose:

- Strengthen depth
- Separate spatial planes
- Reduce cut-out feeling
- Simulate air volume

The haze should not look like a visible flat overlay.

---

# 19. World-Space vs Screen-Space Decision

Use **world-space typography** when:

- Monumental scale is important
- Text should feel built into the city
- Perspective interaction is meaningful
- Camera movement is moderate enough for readability

Use **screen-space text** when:

- Information must remain easily readable
- Camera motion is aggressive
- Text is functional rather than cinematic

Use a hybrid system when:

- Anchor belongs in world space
- Label belongs in screen space

---

# 20. Regional Planning Map HUD

## Purpose

Use the Map HUD system to convert:

- Satellite imagery
- Drone footage
- Master plans
- Urban maps

into a readable system for explaining:

- Project location
- Travel relationships
- Nearby amenities
- Transportation
- Connectivity
- Catchment areas
- Planning radius

The HUD should reduce geographic abstraction.

---

# 21. HUD System Architecture

Recommended system:

```text
MAP_HUD
│
├── 01_EPICENTER_PULSE
│
├── 02_RADIUS_OR_ISOCHRONE_RINGS
│
├── 03_TRANSIT_ARTERIES
│
└── 04_WAYPOINT_CALLOUTS
```

Every component should communicate a real relationship.

---

# 22. Epicenter Pulse

Purpose:

Identify the project center.

Build with:

- Shape Layer
- Circular stroke
- Repeater
- Scale animation
- Opacity animation
- Looping expression

Conceptual motion:

```text
Scale:   0% → 300%
Opacity: 100% → 0%
```

Use:

```jsx
loopOut("cycle")
```

when appropriate.

---

# 23. Radar Wave Behavior

Radar waves should feel:

- Periodic
- Controlled
- Lightweight
- Spatially centered

Avoid:

- Excessive glow
- Huge opacity
- Too many simultaneous rings

The pulse should identify, not dominate.

---

# 24. Echo Effect

Echo can be used to create trailing wave impressions.

Use carefully.

Too much Echo can:

- Smear the map
- Reduce clarity
- Create visual noise
- Make the system feel dated

Use it as reinforcement, not as the foundation of the effect.

---

# 25. Transit Arteries

Use paths to show:

- Highway connections
- Metro lines
- Main roads
- Regional routes
- Access corridors

Build with:

- Pen Tool
- Shape Paths
- Stroke
- Trim Paths

---

# 26. Route Draw Animation

Animate Trim Paths:

```text
End: 0% → 100%
```

A practical duration may be around:

**1 second**

for major routes, depending on map scale.

The path should appear to propagate from a logical origin.

---

# 27. Animated Dashes

Use Stroke Dashes.

Set:

- Round Caps
- Dash
- Gap
- Offset

Example expression:

```jsx
time * -150
```

on Dash Offset can simulate flow.

Treat speed as context-dependent.

---

# 28. Directionality

Animated dashes should have meaning.

Possible meanings:

- Traffic flow
- Connection direction
- Data flow
- Project access
- Transit movement

Do not animate dashes in random directions.

---

# 29. Radius Rings vs Isochrones

Distinguish between:

## Radius Rings

Represent physical distance from a center.

Examples:

- 1 km
- 3 km
- 5 km

These are geometric distance rings.

## Isochrones

Represent equal travel time.

Examples:

- 5 minutes
- 10 minutes
- 15 minutes

True isochrones depend on:

- Road network
- Speed
- Traffic
- Travel mode

Do not falsely label simple circles as travel-time isochrones unless the data genuinely supports that relationship.

This distinction is important.

---

# 30. Distance Ring Styling

Use:

- Thin strokes
- Subtle labels
- Low visual weight
- Consistent line system

Starting stroke width:

**1–2 px**

at common HD/4K contexts.

Adjust according to resolution.

---

# 31. Rotating Sweep on Rings

A subtle rotating accent may use:

- CC Light Sweep
- Rotating highlight
- Small glow segment

The motion should imply:

- Scanning
- Measurement
- Technical visualization

Avoid turning every ring into a flashy neon effect.

---

# 32. Waypoint Callouts

Use for:

- Airport
- Metro
- School
- Hospital
- Mall
- Park
- CBD
- Highway
- Landmark

A waypoint system should include:

- Anchor
- Marker
- Connector
- Label
- Optional distance/time

---

# 33. Waypoint Motion

Recommended reveal order:

**Anchor → Connector → Label → Data**

This mirrors information hierarchy.

Avoid labels appearing before viewers know what they point to.

---

# 34. Map Background Processing

The map or satellite background should support the HUD.

Typical treatment:

- Lower saturation
- Reduce contrast
- Darken
- Blur slightly if necessary
- Preserve major roads and landmarks

Possible saturation reduction:

**50%–80%**

as a starting range.

Do not destroy useful geographic information.

---

# 35. HUD Color Systems

## Cyan Neon

Example:

`#00E5FF`

Appropriate for:

- Smart-city
- Technology
- Urban infrastructure
- Modern architecture

## Gold Amber

Example:

`#FFC837`

Appropriate for:

- Luxury real estate
- Premium urban projects
- Hospitality
- Prestige positioning

Use one dominant HUD color system.

Avoid rainbow HUD palettes unless the data requires categorical differentiation.

---

# 36. Map Legibility Hierarchy

Priority should normally be:

1. Project location
2. Main transit relationships
3. Key destination waypoints
4. Radius / distance context
5. Supporting map detail

Do not give every road and label equal brightness.

---

# 37. SFX as Motion Weight

Sound design should make motion feel:

- Heavy
- Light
- Fast
- Delicate
- Metallic
- Digital
- Architectural
- Energetic

Do not treat SFX as decorative afterthought.

The sound should reinforce the perceived physics of motion.

---

# 38. Perception Timing Heuristic

Auditory and visual perception operate on different timescales, but exact processing latencies vary greatly by stimulus and task.

Do not rely on simplified fixed values such as:

- 140 ms auditory
- 190 ms visual

as universal biological constants.

Use the practical design principle instead:

> **Sound can prepare the viewer for motion and strongly influence perceived timing, impact, and weight.**

---

# 39. Four-Layer Sound Stack

Organize SFX by frequency role.

```text
1. HIGHS       8 kHz – 16 kHz
2. MID-HIGHS   2 kHz – 6 kHz
3. MID-LOWS    250 Hz – 1 kHz
4. SUB-BASS    30 Hz – 80 Hz
```

These ranges are practical categories, not rigid boundaries.

---

# 40. Layer 1 — High Frequencies

Examples:

- Air
- Glint
- Shimmer
- Glass sheen
- Metallic sparkle

Use for:

- Light sweeps
- Luxury logo reveals
- Small reflective accents

High-frequency sound implies:

- Lightness
- Precision
- Shine

---

# 41. Layer 2 — Mid-High Frequencies

Examples:

- Clicks
- HUD ticks
- Mechanical relays
- Numeric flips
- Digital markers

Use for:

- Counters
- Radar
- HUD animations
- Locator pin activity

These frequencies create:

- Technical clarity
- Micro-mechanical detail

---

# 42. Layer 3 — Mid-Low Frequencies

Examples:

- Whoosh
- Swoosh
- Whip
- Wind movement

Use for:

- Sliding text
- Accelerating titles
- Camera-linked movement
- Large spatial transitions

This layer communicates movement through air.

---

# 43. Layer 4 — Sub-Bass

Examples:

- Boom
- Thud
- Impact
- Low hit

Use for:

- Final landing
- Hero title lock
- Massive project-name reveal
- Large architectural events

Sub-bass communicates:

- Weight
- Scale
- Finality
- Mass

Use sparingly.

---

# 44. Intro Whoosh Timing

For text entering rapidly:

Use:

- Whoosh
- Wind rise
- Pitch rise

A useful timing principle:

**Place the whoosh's perceptual peak slightly before the visual arrival.**

A starting range may be:

**1–2 frames before the text stops**

This creates anticipation.

Judge by feel and frame rate.

---

# 45. Landing Impact Timing

For final text lock:

Align the primary transient peak with:

> The first frame where the text reaches its final settled position.

This creates strong audio-visual causality.

The impact should not arrive noticeably late.

---

# 46. Counter SFX Timing

For animated number counters:

Use:

- Clicks
- Digital ticks
- Relay-like sounds

Density can be higher during fast counting.

Then:

- Reduce click density as the count slows
- Stop sharply at the final number

This mirrors the visual deceleration curve.

---

# 47. Light Sweep SFX

Use:

- Glass chime
- Shimmer
- Metallic ring
- High-frequency sheen

Peak the sound around the moment the visible sweep crosses the most important part of the title.

Do not use long-decay chimes for every small light movement.

---

# 48. Sound Scale Matching

Use pitch to reinforce visual scale.

## Large Architectural Typography

Lower pitch:

**-3 to -6 semitones**

may create:

- Heaviness
- Mass
- Concrete/steel feeling

## Small HUD Details

Raise pitch:

**+2 to +4 semitones**

may create:

- Precision
- Delicacy
- Micro-tech character

These are creative starting points.

---

# 49. Pitch-Material Relationship

Think beyond size.

Possible associations:

- Glass → brighter transients
- Metal → resonant mid/high ring
- Concrete → dull low impact
- Digital HUD → short crisp click
- Luxury gold → warm metallic shimmer
- Giant building text → low cinematic hit

Use sound to support perceived material.

---

# 50. Sidechain Ducking

When a strong low-frequency impact overlaps with:

- Music kick
- Bass line
- Low synth

the mix can become muddy.

Use:

- Compressor
- Dynamic EQ
- Sidechain

on the music bed.

---

# 51. Low-End Ducking Strategy

When the hero impact occurs:

Temporarily reduce music energy around:

**40–120 Hz**

by approximately:

**3–5 dB**

for a short duration, such as around:

**0.2 seconds**

as a starting approach.

Do not apply broad full-spectrum ducking unless necessary.

The goal is to create room for the impact, not to make the music audibly pump.

---

# 52. Audio Priority Hierarchy

For motion graphics, prioritize:

1. Dialogue / Voiceover
2. Critical message cue
3. Hero impact
4. Music
5. Supporting micro-SFX

Never let SFX obscure spoken content.

---

# 53. Architectural Masking Failure Modes

Avoid:

- Text moving faster than foreground building without spatial reason
- Roto edges chattering
- Text remaining too contrasty at great distance
- Text floating with no atmospheric depth
- Wrong ground plane
- Bad camera solve
- Text intersecting architecture
- Unrealistic size with no depth cues
- Occluder edges too sharp or too soft

---

# 54. Map HUD Failure Modes

Avoid:

- Decorative lines with no data meaning
- False travel-time circles
- Too many equally bright routes
- Over-saturated satellite imagery
- Labels colliding with map detail
- Excessive radar pulses
- Constant glow everywhere
- Routes drawing from arbitrary endpoints
- Dashes moving in conflicting directions

---

# 55. SFX Failure Modes

Avoid:

- Whoosh on every transition
- Sub-bass on every title
- Sound peaks arriving late
- Overlapping low-frequency impacts
- Loud high-frequency ticks causing fatigue
- Long reverb on functional HUD elements
- Pitch choices that conflict with visual scale
- Music not ducked for hero impacts
- SFX overpowering narration

---

# 56. QA — Spatial Typography

Check:

- Camera track is stable
- Text depth is believable
- Parallax supports scale
- Building mask is clean
- Occlusion feels natural
- Text contrast fits depth
- Atmospheric haze is subtle
- Font remains readable
- Monumental scale feels environmental, not oversized

---

# 57. QA — Map HUD

Check:

- Project center is obvious
- Radius rings are correctly labeled
- Isochrones are only used when travel-time data is valid
- Transit lines represent real routes
- Waypoints correspond to actual locations
- Color hierarchy is controlled
- Background is subdued but still informative
- Labels remain legible

---

# 58. QA — SFX

Check:

- Whoosh anticipates arrival appropriately
- Impact transient aligns with landing
- Counter clicks follow number-speed changes
- Light sweep sound matches visual center
- Frequency layering is balanced
- Low-end does not clash with music
- Pitch matches scale
- SFX reinforce hierarchy
- Voiceover remains clear

---

# 59. Response Behavior

When asked:

> “How do I place giant text behind this building?”

Respond with:

1. Camera solve strategy
2. Stable tracking plane
3. Text Z-depth
4. Scale logic
5. Foreground mask method
6. Occlusion cleanup
7. Atmospheric perspective
8. Final color integration

When asked:

> “How do I create a regional planning HUD?”

Respond with:

1. Project epicenter
2. Distance vs travel-time logic
3. Route hierarchy
4. Waypoint system
5. Background processing
6. Color system
7. Animation order
8. Data accuracy checks

When asked:

> “What sound should this title use?”

Respond with:

1. Motion type
2. Perceived scale
3. Material
4. Frequency layers
5. Pre-roll or impact timing
6. Pitch treatment
7. Music ducking if required

---

# 60. Senior Decision Framework

For every spatial motion scene, reason through:

**What belongs to the world?  
What belongs to the interface?  
What belongs to the soundscape?**

Then assign:

- World-space motion
- Screen-space information
- Frequency-space audio

The strongest scenes coordinate all three.

---

# 61. Final Operating Principle

The AI should think like a:

**Spatial Motion Art Director + Architectural Compositor + Geographic Information Designer + Motion SFX Integrator**

The objective is not to impress viewers with technique.

The objective is to make:

- Architecture feel monumental
- Geography feel understandable
- Typography feel spatial
- Data feel credible
- Motion feel physical
- Sound feel synchronized
- Effects feel integrated rather than applied

The governing rule is:

> **Depth must be earned through parallax and occlusion.  
> Maps must communicate real relationships.  
> Sound must reinforce motion physics.  
> Every effect must improve understanding, scale, or prestige.**
