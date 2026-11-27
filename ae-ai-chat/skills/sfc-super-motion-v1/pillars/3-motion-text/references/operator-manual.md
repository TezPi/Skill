# Operator manual: 100 concrete mechanisms

Each entry is an original specification. Listed sources support its underlying technique, not this exact treatment. Progress s/v, units and timing are defined in schema-timing.md.

## F000: Translate settle (2d)

Start each shaped unit 1.1 em below its final baseline. Move vertically to its measured target without changing its width or character order.

**Movement:** y=q.y+1.1*(1-v) em; x=q.x; rotation=0; end offset exactly zero.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Combine with a padded matte on a separate opacity channel; do not animate the final baseline during reading.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A01. Output-channel categories (equation is authoritative): transform.y_em. Scope: unit.

## F001: Bezier arc converge (2d)

Move a unit along a cubic Bezier curve, rotating only if tangent following is explicitly enabled. Stop at the target with the original upright orientation.

**Movement:** B(v)=(1-v)^3 P0+3(1-v)^2 v P1+3(1-v)v^2 P2+v^3 P3; P3=q. Supply all four control points in em.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix a short highlight after arrival; preserve the curve endpoint when changing its bend.

**Requirements:** bezier_path

**Technical basis:** A01. Output-channel categories (equation is authoritative): path.progress. Scope: unit.

## F002: Spiral converge (2d)

Make two turns around the destination while the orbit radius shrinks to zero. Keep glyph orientation upright unless a secondary rotation is declared.

**Movement:** r=1.2*(1-s) em; theta=4*pi*s; offset=(r*cos(theta),r*sin(theta)); s=clamp(v,0,1).

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Replace the circular orbit with an ellipse or change turn count; finish at exactly the same measured target.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A02. Output-channel categories (equation is authoritative): path.progress. Scope: unit.

## F003: External pivot orbit (2d)

Rotate the whole unit through a short arc around an external pivot, then restore its ordinary transform hierarchy without a visible jump.

**Movement:** Pivot=q+(-0.5,0.5) em; angle=-45*(1-v) degrees. Reparent at the same world transform after angle reaches zero.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Layer an underline after the orbit; do not change pivot and translation independently without compensating the world transform.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A01. Output-channel categories (equation is authoritative): transform.rotation_deg. Scope: unit.

## F004: Damped pendulum (2d)

Swing the unit around its top-center attachment with decreasing angular amplitude, then lock its readable orientation.

**Movement:** theta=18*sin(3*pi*s)*(1-s)^2 degrees, s=clamp(v,0,1); translation follows the pivot; theta(1)=0.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Change oscillation count or attachment point; keep the damping envelope and final baseline explicit.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A02. Output-channel categories (equation is authoritative): deformation.progress. Scope: unit.

## F005: Spring scale pop (2d)

Grow from 65 percent size, pass slightly above full size, and settle at scale one around a baseline-aware pivot.

**Movement:** scale=1-0.35*exp(-6*s)*cos(8*s), with scale(1)=1 exactly. The family spring is intrinsic; do not double-apply a temporal spring.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Pair with opacity or matte reveal. Tune damping before increasing amplitude; never deform the text payload.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A08. Output-channel categories (equation is authoritative): transform.scale. Scope: unit.

## F006: Squash impact (2d)

Compress height and expand width briefly, then recover the original glyph proportions. This is a stylized transform rather than a soft-body simulation.

**Movement:** k=0.20*sin(pi*s)*(1-s); scale_y=1-k; scale_x=1/(1-k); both equal one at s=1.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Precede with a short downward arrival, keeping the impact and recovery in separate stages.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A02. Output-channel categories (equation is authoritative): deformation.progress. Scope: unit.

## F007: Shear settle (2d)

Start with an italic-like shear while retaining the original font shape, then remove the shear at the final baseline.

**Movement:** skew_x=-18*(1-v) degrees, anchored at baseline center; final skew is zero.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Combine with tracking on a parent group; avoid presenting the temporary skew as a different font style.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A01. Output-channel categories (equation is authoritative): transform.skew_deg. Scope: unit.

## F008: Tracking compress (2d)

Reduce additional spacing between already shaped targets without scaling or reshaping their glyph outlines.

**Movement:** Extra gap=0.4*(1-v) em. Use measured kerning as the final spacing; compensate the group anchor while gaps change.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Run a subtle opacity stagger inside the group, with one shared spacing controller.

**Requirements:** measured_shaping

**Technical basis:** A01. Output-channel categories (equation is authoritative): spacing.extra_em. Scope: group.

## F009: Baseline wave settle (2d)

Offset units along a traveling vertical wave and progressively remove the wave so the final sentence rests on its baseline.

**Movement:** dy=0.35*sin(2*pi*s+0.6*i)*(1-s) em; i is the original unit index; dy(1)=0.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Phase the wave against traversal rank or audio markers; keep original reading order independent of activation order.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A02. Output-channel categories (equation is authoritative): deformation.progress. Scope: unit.

## F010: Bounce drop (2d)

Bring the unit down to its target, add two smaller rebounds, and finish still. Use explicit keys rather than claiming a physics solve.

**Movement:** Piecewise normalized keys (s,dy_em): (0,-1.2),(.55,0),(.72,-.22),(.86,0),(.93,-.06),(1,0). Interpolate each segment with monotone easing.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Use a short squash only at contact keys; keep the final rebound before the reading hold.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A02. Output-channel categories (equation is authoritative): path.progress. Scope: unit.

## F011: Anticipation launch (2d)

Move a short distance opposite the main travel, accelerate toward the target, and settle without crossing the final text layout.

**Movement:** x offset keys in em: (0,-.8),(.18,-.95),(.82,.04),(1,0). Choose the direction deliberately; mirror all offsets together if reversed.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Combine with a reveal matte; retain the anticipation-to-main-action relationship when retiming.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A02. Output-channel categories (equation is authoritative): deformation.progress. Scope: unit.

## F012: Linear matte reveal (2d)

Keep text at its final layout and move a clipping edge across its measured bounds. The letters themselves remain stationary.

**Movement:** Reveal fraction=clamp(v,0,1); matte width=fraction*(bounds.width+2*padding), padding>=diacritic/outline extent.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Move the text behind the matte as a separate secondary channel, or reveal phrases rather than arbitrary letters.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A01. Output-channel categories (equation is authoritative): mask.reveal. Scope: unit.

## F013: Block matte reveal (2d)

Sweep an opaque block over stationary text; uncover the text behind its trailing edge and move the block entirely away.

**Movement:** Block leading edge travels from left-padding to right+padding; trailing edge follows by block_width. End with the block outside the text bounds.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Use the block as a chapter transition, but separate the block color from actual text alpha.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A01. Output-channel categories (equation is authoritative): mask.reveal. Scope: unit.

## F014: Iris reveal (2d)

Expand an elliptical matte around the unit until every corner and accent is visible.

**Movement:** Radius factor=clamp(v,0,1); final ellipse must contain the padded rectangle, not merely match half its width and height.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Change the iris center to a semantic focus point; recompute its final coverage for the actual text.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A01. Output-channel categories (equation is authoritative): mask.reveal. Scope: unit.

## F015: Slit reveal (2d)

Open a narrow horizontal aperture vertically around the baseline until the complete letter height is exposed.

**Movement:** Visible height=(bounds.height+2*padding)*clamp(v,0,1); centered aperture; final mask removed or expanded beyond all accents.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Combine with slight vertical translation; keep mask opening and glyph travel on independent controls.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A01. Output-channel categories (equation is authoritative): mask.reveal. Scope: unit.

## F016: Luma threshold reveal (2d)

Use a supplied grayscale matte to expose different regions of the final text progressively, then remove all residual masking.

**Movement:** Threshold=1-clamp(v,0,1); apply a declared soft transition band. At the last entrance frame bypass the matte so no dark holes remain.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Change the matte texture or traversal, while retaining a fully solid final text state.

**Requirements:** luma_matte

**Technical basis:** A01. Output-channel categories (equation is authoritative): mask.reveal. Scope: unit.

## F017: Gradient alpha reveal (2d)

Move a soft alpha ramp across the unit rather than fading the whole unit uniformly.

**Movement:** Ramp center moves from left-padding to right+padding; alpha=clamp((edge-x)/feather+0.5,0,1). Finish with alpha one everywhere.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Use a directional blur only during entrance and explicitly set blur to zero before reading.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A01. Output-channel categories (equation is authoritative): mask.reveal. Scope: unit.

## F018: Stroke draw (2d)

Reveal the ordered outline paths by arc length. This draws an outline and does not automatically reproduce human handwriting stroke order.

**Movement:** Visible path length=clamp(v,0,1)*total_path_length; specify contour order, direction and cap style; final contour coverage is complete.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Follow with fill reveal; keep holes/counters as separate contours and avoid fake pen ordering claims.

**Requirements:** outline_paths

**Technical basis:** A01. Output-channel categories (equation is authoritative): stroke.progress. Scope: unit.

## F019: Outline to fill (2d)

Present an outline first and then fill the same shaped glyph geometry while the outline becomes subordinate.

**Movement:** Fill alpha=clamp((s-.35)/.65,0,1); outline alpha falls from 1 to a declared final value during the final 30 percent.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a light sweep after fill is stable; retain enough contrast throughout the transition.

**Requirements:** outline_paths

**Technical basis:** A01. Output-channel categories (equation is authoritative): fill.opacity. Scope: unit.

## F020: Highlight sweep (2d)

Sweep a narrow highlight over text that is already readable in its base color. The moving band carries emphasis rather than essential content.

**Movement:** Band center crosses padded bounds; width=0.25*unit_width; additive or color blend uses a bounded gain and ends at zero highlight contribution.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Trigger the sweep on an important spoken phrase; do not use the sweep as the only visible copy of the text.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A01. Output-channel categories (equation is authoritative): accent.progress. Scope: unit.

## F021: Underline grow (2d)

Draw an underline from the chosen edge beneath the measured unit while leaving the letters stable.

**Movement:** Line length=measured_width*clamp(v,0,1); y=baseline+0.15 em; thickness starts at 0.04 em and is adjusted to the font.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Pair with a quiet unit arrival; preserve the underline relationship to its semantic phrase.

**Requirements:** measured_shaping

**Technical basis:** A01. Output-channel categories (equation is authoritative): accent.progress. Scope: unit.

## F022: Bracket frame draw (2d)

Draw corner brackets and an optional leader around a measured text region to establish a label or callout.

**Movement:** Four L-shaped paths reveal by path length; offsets use padded bounds. Leader endpoint must be supplied if attached to an object.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with an anchored world label; keep bracket motion separate from the target object's motion.

**Requirements:** measured_shaping

**Technical basis:** A01. Output-channel categories (equation is authoritative): accent.progress. Scope: group.

## F023: Marker wipe (2d)

Animate a colored backing strip behind stationary text, keeping the text above the strip and fully readable.

**Movement:** Backing width grows from 0 to padded text width; height=1.1 em initial heuristic; text alpha stays one.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a phrase reveal, and verify the final text/backing contrast instead of assuming a color is legible.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A01. Output-channel categories (equation is authoritative): accent.progress. Scope: unit.

## F024: Color wave (2d)

Propagate a bounded accent color through units, then restore the specified final color without changing the text shape.

**Movement:** Accent mix=sin(pi*s)^2 per delayed unit; final mix=0. Interpolate in an explicitly chosen color space.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Use semantic priority rather than random unit order for important statements; never encode essential meaning by color alone.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A01. Output-channel categories (equation is authoritative): accent.progress. Scope: unit.

## F025: Duotone emphasis (2d)

Transition between two declared fill states to mark a semantic change while retaining stable letter geometry.

**Movement:** Color=interpolate(base,accent,clamp(v,0,1)); hold uses the declared final state, not an arbitrary flashing alternation.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Combine with an underline or weight change; preserve text and background contrast in both states.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A01. Output-channel categories (equation is authoritative): accent.progress. Scope: unit.

## F026: Variable weight (2d)

Animate the font's actual weight axis while preserving the same text and shaping rules. An ordinary font cannot provide this axis.

**Movement:** wght=w0+(w1-w0)*clamp(v,0,1); both values must lie inside the loaded font axis limits; remeasure if metrics change.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a matte on a wrapper; do not approximate missing variable-font support by uncontrolled horizontal scaling.

**Requirements:** variable_wght_font, engine_axis_support

**Technical basis:** A01. Output-channel categories (equation is authoritative): font.wght. Scope: unit.

## F027: Variable width (2d)

Animate a supported width axis and reflow from measured font metrics, rather than squeezing a rendered bitmap.

**Movement:** wdth=d0+(d1-d0)*clamp(v,0,1); recompute wrap/kerning or pin a justified no-wrap layout; final width is d1.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Use with editorial layout transitions, keeping the reading hold after all reflow has finished.

**Requirements:** variable_wdth_font, engine_axis_support

**Technical basis:** A01. Output-channel categories (equation is authoritative): font.wdth. Scope: unit.

## F028: Blur focus (2d)

Reduce a temporary blur until the final shaped text is sharp; account for blur margins in clipping.

**Movement:** sigma=0.12*(1-clamp(v,0,1)) em; sigma(1)=0; opacity can rise separately without overshooting one.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a small translation; supply a reduced version without blur for information-dense text.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A01. Output-channel categories (equation is authoritative): effect.blur_px. Scope: unit.

## F029: Echo decay (2d)

Create delayed decorative copies behind the original and fade them away so only one text instance survives.

**Movement:** Copy j has offset j*0.08 em and alpha=(0.3/j)*(1-s)^2, j=1..3; original remains at q.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Combine with a quick arrival; remove duplicate geometry after alpha reaches zero to avoid later overlap.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A02. Output-channel categories (equation is authoritative): effect.echo_opacity. Scope: unit.

## F030: Chromatic register (2d)

Temporarily offset colored copies and bring all channels back into exact registration.

**Movement:** Red and blue offsets are opposite vectors of length 0.04*(1-s)^2 em; their extra contribution becomes zero at hold.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a short scan accent, while keeping the effect brief and offering a clean static fallback.

**Requirements:** channel_compositor

**Technical basis:** A02. Output-channel categories (equation is authoritative): effect.channel_offset_px. Scope: unit.

## F031: Pixel resolve (2d)

Reduce mosaic cell size until the exact rasterized text is visible, then bypass the mosaic filter.

**Movement:** Cell size interpolates from max(2,0.16*font_px) to 1 px, quantized to integers; filter disabled at s=1.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Pair with a restrained opacity reveal; do not replace characters with invented symbols or numbers.

**Requirements:** pixel_shader

**Technical basis:** A02. Output-channel categories (equation is authoritative): effect.pixel_size_px. Scope: unit.

## F032: Seeded jitter settle (2d)

Apply a deterministic, smoothly sampled displacement with a decaying envelope; avoid fresh random values on every render.

**Movement:** offset=0.12*(1-s)^2*noise(seed,i,s) em; noise is continuous and reproducible; force offset zero at s=1.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Change noise frequency or traversal while retaining the seed and final pose for reproducibility.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A02. Output-channel categories (equation is authoritative): effect.jitter_em. Scope: unit.

## F033: Displacement settle (2d)

Distort the rendered text or its mesh using a declared field, then remove distortion completely.

**Movement:** Displacement amplitude=0.10*(1-s)^2 em; field coordinates and sampling rate must be recorded; final amplitude zero.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a matte reveal; preserve the original unmodified text geometry for the final state.

**Requirements:** displacement_field

**Technical basis:** A02. Output-channel categories (equation is authoritative): effect.displacement_em. Scope: unit.

## F034: Scan glitch burst (2d)

Use one short scan-band displacement burst and return to a clean frame before the reading interval.

**Movement:** Burst envelope=sin(pi*s)^2 inside the declared burst window only; maximum band displacement=0.08 em; no persistent corruption.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Use on expressive titles with a clean alternate; inspect flashing and avoid repeated full-screen luminance jumps.

**Requirements:** scan_shader

**Technical basis:** A02. Output-channel categories (equation is authoritative): effect.scan_strength. Scope: unit.

## F035: Rolling window reveal (2d)

Slide each exact unit through a clipped vertical window until it rests on the final baseline. Never roll through fabricated prices or letters.

**Movement:** dy=1.0*(1-clamp(v,0,1)) em; clip bounds include diacritics; final dy=0 and mask may be bypassed.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with word-level timing; keep full numeric phrases and units together.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A01. Output-channel categories (equation is authoritative): transform.y_em. Scope: unit.

## F036: Typewriter cluster (2d)

Reveal complete declared units one at a time. Character-level behavior requires grapheme boundaries, not raw code-point slicing.

**Movement:** For activation time a_i, visibility_i=step(t-a_i); preserve complete clusters and all whitespace; an optional cursor is a separate layer.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Sync boundaries to transcript markers, and keep negation/qualifiers visible with the statement they modify.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A01. Output-channel categories (equation is authoritative): opacity. Scope: unit.

## F037: Token punch (2d)

Accent an already visible unit by briefly enlarging it and restoring its ordinary scale.

**Movement:** Scale keys: (s=0,1),(.25,1.12),(1,1); pivot at baseline center. Do not restart text alpha for an emphasis-only action.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Combine with stable captions; emphasize only editorially selected words rather than every token.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A02. Output-channel categories (equation is authoritative): transform.scale. Scope: unit.

## F038: Matched outline morph (2d)

Interpolate corresponding vector points from an authored source outline into the exact final glyph outlines.

**Movement:** p_k(s)=(1-s)*source_k+s*target_k; supply matching point counts, contour orientation and counter correspondence.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Add a hold after shape restoration; do not claim arbitrary unrelated letter shapes have valid topology automatically.

**Requirements:** matched_outline_topology

**Technical basis:** A02. Output-channel categories (equation is authoritative): geometry.morph. Scope: unit.

## F039: Trail collapse (2d)

Move several offset copies into registration with the original, then remove all copies except the original.

**Movement:** Copy j offset=j*0.10*(1-s) em; copy alpha falls to zero during the final 20 percent; final original offset zero.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a short rotation; clean duplicate layers to prevent darker overlapped text at hold.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** A02. Output-channel categories (equation is authoritative): effect.trail_spread_em. Scope: unit.

## F040: Depth card settle (2.5d)

Move flat text planes toward their final depth while maintaining their front-facing readable surfaces.

**Movement:** z=q.z+1.0*(1-v) wu; depth of each glyph plane is zero; adjust projection for stable final framing.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a planar matte; a depth transform on a plane remains 2.5D, not extruded typography.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D03, D05. Output-channel categories (equation is authoritative): transform.z_em. Scope: unit.

## F041: Hinge rise (2.5d)

Rotate a flat text card upward around its bottom edge and stop facing the camera.

**Movement:** rotation_x=-75*(1-v) degrees about the bottom edge; final normal faces the viewing direction; avoid exact edge-on visibility.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a receiver shadow if using a real plane mesh; keep the final baseline fixed after hinge completion.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D05, D08. Output-channel categories (equation is authoritative): transform.rotation_x_deg. Scope: unit.

## F042: Coverflow align (2.5d)

Arrange flat units with alternating shallow yaw, then align all fronts to the reading plane.

**Movement:** yaw_i=sign(i-center)*35*(1-v) degrees; z offsets diminish to the common final plane; no solid glyph sides exist.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix a small depth stagger, while preventing overlapping planes from obscuring adjacent words.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D03, D08. Output-channel categories (equation is authoritative): transform.rotation_y_deg. Scope: unit.

## F043: Shallow orbit settle (2.5d)

Move a flat unit through a shallow arc in 3D and return both position and orientation to its target.

**Movement:** offset=(0.5*sin(pi*s),0,0.5*(1-s)) wu; local yaw=20*(1-s) degrees; final offset and yaw zero.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Change the orbital plane or radius; keep the camera fixed unless a separate shot-level action is specified.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D03, D08. Output-channel categories (equation is authoritative): path.progress. Scope: unit.

## F044: Card flip reveal (2.5d)

Rotate a flat card from an almost edge-on yaw to front view, revealing only the readable face.

**Movement:** yaw=85*(1-clamp(v,0,1)) degrees; hide backface or use a declared back material; alpha low while projected width is tiny.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Pair with an opacity envelope; do not show mirrored reverse-side text as readable content.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D03, D05. Output-channel categories (equation is authoritative): transform.rotation_y_deg. Scope: unit.

## F045: Layer parallax resolve (2.5d)

Separate decorative text planes in depth so camera-relative movement produces parallax, then converge to one readable layer.

**Movement:** Three planes use z offsets (-.3,0,.3) wu and bounded lateral offsets; copies fade out before final reading.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Combine with one shared camera truck; preserve the actual text on the surviving master plane.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D03, D05. Output-channel categories (equation is authoritative): effect.layer_separation_em. Scope: group.

## F046: Dolly title plane (2.5d)

Move one camera toward a flat title plane, ending at a framing computed from actual text bounds.

**Movement:** Camera distance goes from d_fit+2 wu to d_fit; one camera serves the shot. Unit traversal controls reveal/accent, not duplicated cameras.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with small per-unit fades; fit the camera after shaping and keep the title within the near/far range.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D03, D05. Output-channel categories (equation is authoritative): camera.distance_em. Scope: shot.

## F047: Curved panel unfold (2.5d)

Flatten a curved text-bearing surface until its final state is a plane. The text is a surface texture or mapped outline.

**Movement:** Bend angle=45*(1-s) degrees with an explicit surface radius and UV map; final bend zero; no glyph extrusion.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a slow reveal; measure texture stretching and retain an undistorted final surface.

**Requirements:** deformable_plane

**Technical basis:** D05. Output-channel categories (equation is authoritative): geometry.curvature. Scope: unit.

## F048: Plane shadow lift (2.5d)

Lift a real text-bearing plane away from a receiving surface so its projected shadow changes coherently.

**Movement:** Plane height=0.25*clamp(v,0,1) wu; final height remains declared; a shadow-casting mesh and light/receiver are required.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a soft planar arrival; do not substitute a Sprite and claim it casts the same shadow.

**Requirements:** shadow_receiver, mesh_plane

**Technical basis:** D04, D05. Output-channel categories (equation is authoritative): transform.z_em. Scope: unit.

## F049: World label anchor (2.5d)

Attach a flat billboard label to a world point and update a leader while clamping its projected readable size.

**Movement:** Project the supplied world anchor through the camera; maintain screen size within authored bounds; leader follows the projected point.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Combine with object tracking or semantic highlights; keep label text out of the tracked object's occlusion zone.

**Requirements:** world_anchor

**Technical basis:** D03, D04. Output-channel categories (equation is authoritative): anchor.track_progress. Scope: group.

## F050: Accordion panels (2.5d)

Open linked flat panels from alternating folds into a continuous front-facing reading plane.

**Movement:** Hinge angle_i=(-1)^i*60*(1-s) degrees; evaluate parent transforms in chain order; final angles zero.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Stagger neighboring hinges with overlap, while checking text continuity at the panel seams.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D05, D08. Output-channel categories (equation is authoritative): transform.rotation_y_deg. Scope: unit.

## F051: Venetian slats (2.5d)

Rotate narrow flat text strips into registration to reconstruct a single readable planar image.

**Movement:** Each strip rotates around its own long axis from 75 to 0 degrees; preserve its unique UV interval; final strips have no visible gaps.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with alternating traversal; use enough padding or overscan to prevent exposed seams through accents.

**Requirements:** text_plane_slices

**Technical basis:** D05, D08. Output-channel categories (equation is authoritative): transform.rotation_x_deg. Scope: unit.

## F052: Cylindrical card array (2.5d)

Place flat labels on a cylindrical arc and move them to a common reading layout.

**Movement:** Initial p_i=(r*sin(theta_i),y_i,r*cos(theta_i)); interpolate toward q_i; interpolate local normals to front-facing at hold.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Change cylinder radius or arc span; keep each card planar and stop it before reading.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D03, D09. Output-channel categories (equation is authoritative): layout.cylinder_mix. Scope: group.

## F053: Spherical card resolve (2.5d)

Distribute flat labels over a sphere and bring them into the final readable plane.

**Movement:** Initial positions use supplied latitude/longitude; interpolate to q_i with collision-aware paths; final orientation faces the camera.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a fixed wide camera; avoid hiding labels on the far hemisphere during essential reading.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D03, D09. Output-channel categories (equation is authoritative): layout.sphere_mix. Scope: group.

## F054: Depth stagger lanes (2.5d)

Assign flat units to explicit depth lanes, then merge them onto one final depth plane.

**Movement:** z_i=q.z+lane_i*0.25*(1-s) wu; lane_i supplied or seeded; no permanent depth differences during reading.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with simple translation; retain enough spacing to prevent crossings from hiding units.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D03, D08. Output-channel categories (equation is authoritative): transform.z_em. Scope: unit.

## F055: Oblique plane return (2.5d)

Remove a compound pitch and yaw from a flat text card while it moves to its final anchor.

**Movement:** rotation_x=20*(1-v), rotation_y=-25*(1-v) degrees; final orientation and offset zero.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a matte or restrained light change; explicitly declare rotation order in the engine adapter.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D05, D08. Output-channel categories (equation is authoritative): transform.rotation_x_deg. Scope: unit.

## F056: Plane ribbon unroll (2.5d)

Unroll a text-bearing ribbon surface while retaining a stable UV-to-text mapping.

**Movement:** Unrolled arc length grows from a declared initial fraction to full length; curvature decays to zero; final surface is planar.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Combine with a follow camera only as one shared rig; prevent texture compression from becoming the final reading state.

**Requirements:** ribbon_mesh_uv

**Technical basis:** D05. Output-channel categories (equation is authoritative): geometry.unroll_progress. Scope: group.

## F057: Page curl flatten (2.5d)

Release a curled sheet-like text surface into a flat front view without mirrored readable text on its back.

**Movement:** Curl angle and radius follow declared keys, ending at angle zero; use sufficient subdivisions and a non-text back material.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a quiet shadow change; keep glyph content in the front texture and avoid clipping at the curl.

**Requirements:** deformable_plane

**Technical basis:** D05. Output-channel categories (equation is authoritative): geometry.curvature. Scope: group.

## F058: Card fan close (2.5d)

Open a fan of flat cards and close them into their intended final reading order.

**Movement:** yaw_i=(i-center)*8*(1-s) degrees; lateral offsets converge to q_i; final cards do not cover one another.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with staggered visibility; original text sequence must remain independent of fan draw order.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D08, D09. Output-channel categories (equation is authoritative): transform.rotation_z_deg. Scope: unit.

## F059: Layer focus rack (2.5d)

Shift actual depth of field between text planes, ending with all essential text sharp or one declared focal label.

**Movement:** Animate focus distance between measured plane depths; aperture/blur model is explicit; final circle of confusion must preserve letter readability.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a depth reveal; a camera focus property alone does not implement a blur pass.

**Requirements:** dof_renderer

**Technical basis:** D03, D05. Output-channel categories (equation is authoritative): effect.blur_px. Scope: shot.

## F060: Camera truck parallax (2.5d)

Translate one camera sideways in front of flat layers at different depths, then stop at the final composition.

**Movement:** Camera x moves from -0.6 to 0 wu relative to the fitted camera rig; target/framing compensate as declared; one shot-level camera.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix per-unit fades; separate camera motion from local unit transforms to avoid double movement.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D03, D05. Output-channel categories (equation is authoritative): camera.x_em. Scope: shot.

## F061: Camera crane plane (2.5d)

Raise one camera to reveal a flat title above an occluder and end at its readable framing.

**Movement:** Camera y moves from y_fit-0.7 to y_fit wu; aim at the title target; verify no near-plane intersection or crop.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Combine with a stationary title plane; timing should let the title settle before the reading hold.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D03, D05. Output-channel categories (equation is authoritative): camera.y_em. Scope: shot.

## F062: Camera roll settle (2.5d)

Remove a small camera roll while the flat title remains spatially stable.

**Movement:** Roll goes from -8 to 0 degrees around the viewing axis; the image must fit the rotated frustum throughout.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a short opacity reveal; keep roll small for content-heavy scenes and zero in the final read pose.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D03, D05. Output-channel categories (equation is authoritative): camera.roll_deg. Scope: shot.

## F063: Orthographic card stack (2.5d)

Show separated flat cards through an orthographic camera, then fade decorative layers into one final master plane.

**Movement:** Layer z_i=i*0.04 wu; orthographic scale fits measured bounds; duplicate alpha goes to zero; avoid coincident surviving planes.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Combine with tracking; an orthographic camera creates no perspective size change with depth.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D03, D05. Output-channel categories (equation is authoritative): effect.layer_separation_em. Scope: group.

## F064: Floor plane rise (2.5d)

Rotate a text-bearing plane from a floor-like orientation to a front-facing title around its bottom hinge.

**Movement:** rotation_x=-80*(1-s) degrees; bottom edge is the pivot; declare floor receiver and shadow only if actually present.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a small vertical lift; protect ascenders and accents as projected height changes.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D05, D08. Output-channel categories (equation is authoritative): transform.rotation_x_deg. Scope: unit.

## F065: Corner fold release (2.5d)

Unfold one corner of a subdivided text-bearing plane while the rest remains anchored.

**Movement:** A localized bend field affects the selected corner; angle goes from 45 to 0 degrees; attenuation becomes zero outside the corner region.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Combine with a static master plane or mask, preserving UV continuity and final geometry.

**Requirements:** deformable_plane

**Technical basis:** D05. Output-channel categories (equation is authoritative): geometry.fold_mix. Scope: unit.

## F066: Plane orbit label (2.5d)

Orbit one flat label around an object before locking it into an anchored callout position.

**Movement:** p(s)=object_center+radius*[cos(theta(s)),0,sin(theta(s))], then blend to supplied label anchor; final leader endpoint remains fixed.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with world label rules; preserve occlusion testing and keep the final label front-facing.

**Requirements:** world_anchor

**Technical basis:** D03, D04. Output-channel categories (equation is authoritative): path.progress. Scope: group.

## F067: Depth occlusion peek (2.5d)

Reveal a flat label from behind a genuine depth occluder and move it into a clear reading zone.

**Movement:** Move the plane from a supplied hidden start to q with explicit depth testing; final bounds must clear the occluder silhouette.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a short matte only if it is separately identified; do not call a 2D mask a depth interaction.

**Requirements:** occluder_geometry

**Technical basis:** D03, D05. Output-channel categories (equation is authoritative): transform.x_em. Scope: unit.

## F068: Projected grid align (2.5d)

Move perspective tiles carrying distinct UV regions until they reconstruct one flat, undistorted text image.

**Movement:** Tile transforms interpolate from declared offsets to their grid rest transforms; final UV coverage is contiguous with no duplicate regions.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Combine with a diagonal traversal; control texture seams and keep the final text at native adequate resolution.

**Requirements:** text_plane_tiles

**Technical basis:** D03, D09. Output-channel categories (equation is authoritative): layout.grid_mix. Scope: group.

## F069: Multi-plane book open (2.5d)

Open two flat text panels like a book, then arrange both so their content can be read without mirrored faces.

**Movement:** Left/right hinge yaw starts at +/-65 degrees and reaches zero; panel positions finish in separate nonoverlapping reading regions.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with paired semantic groups; do not force a full paragraph into one tiny panel.

**Requirements:** paired_panels

**Technical basis:** D05, D08. Output-channel categories (equation is authoritative): transform.rotation_y_deg. Scope: group.

## F070: Extrusion grow (3d)

Give shaped glyphs actual side surfaces by growing extrusion depth while the front face remains registered to the final text outline.

**Movement:** depth=0.005+(0.16-0.005)*clamp(v,0,1) em; bevel starts at 0.015 em only if topology permits; front-face z stays fixed.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a front matte or light sweep; side geometry must exist in the resulting engine scene.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D01, D05, D07. Output-channel categories (equation is authoritative): geometry.depth_em. Scope: unit.

## F071: Bevel pulse (3d)

Pulse the bevel width on already extruded glyphs and restore a safe final bevel without closing counters.

**Movement:** bevel=b0+0.008*sin(pi*s)^2 em; cap against minimum stroke/counter clearance; final bevel=b0.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Combine with a controlled light sweep; do not use material glare as a substitute for geometry.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D01, D05. Output-channel categories (equation is authoritative): geometry.bevel_em. Scope: unit.

## F072: Solid tumble settle (3d)

Rotate volumetric glyphs through a short compound tumble and settle upright in the final layout.

**Movement:** Euler example (x,y,z)=(25,-35,12)*(1-v) degrees; declare rotation order or use quaternion interpolation; geometry depth remains positive.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a bounded translation; keep backface exposure brief and final normals legible.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D01, D08. Output-channel categories (equation is authoritative): transform.rotation_y_deg. Scope: unit.

## F073: Spline solid assemble (3d)

Move extruded glyphs along an authored 3D spline and align tangent-following orientation before restoring the reading pose.

**Movement:** Sample spline position/tangent by normalized arc length s; end point=q_i; final orientation explicitly matches baseline, not an arbitrary tangent.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with staggered depth growth; provide the actual spline and stable normal/up-vector convention.

**Requirements:** bezier_path

**Technical basis:** D09, D12. Output-channel categories (equation is authoritative): path.progress. Scope: unit.

## F074: Helix unwind (3d)

Unwind volumetric letters from a helix into the measured final text arrangement.

**Movement:** Initial p_i=(r*cos(theta_i),pitch*theta_i,r*sin(theta_i)); blend to q_i using s; remove twist at hold.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Change pitch and turn count or use two helices; retain a clear final front-face reading layout.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D08, D09. Output-channel categories (equation is authoritative): layout.helix_mix. Scope: group.

## F075: Solid radial fan (3d)

Bring extruded glyphs from a radial fan into a straight or declared final layout.

**Movement:** Initial positions/rotations follow an arc; p_i=lerp(arc_i,q_i,s); orientation interpolates to the readable target.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Combine with a small scale accent, preserving glyph volume and avoiding intersection during closure.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D06, D08. Output-channel categories (equation is authoritative): transform.rotation_z_deg. Scope: unit.

## F076: Depth wave decay (3d)

Move volumetric glyphs along Z in a traveling wave while retaining real side geometry.

**Movement:** dz=0.8*sin(2*pi*s+0.6*i)*(1-s) wu; all depth offsets are zero at s=1; extrusion itself stays positive.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with word-level activation, then stop both camera and wave for reading.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D08, D09. Output-channel categories (equation is authoritative): transform.z_em. Scope: unit.

## F077: Domino stand (3d)

Stand volumetric letters upright around their bottom pivots in a delayed chain. This default uses keys, not a physics claim.

**Movement:** rotation_x=-75*(1-s) degrees about each glyph's base; target baseline positions remain fixed.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Add a short contact accent between stages; use a real simulation only if collisions and cache are actually created.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D06, D08. Output-channel categories (equation is authoritative): transform.rotation_x_deg. Scope: unit.

## F078: Solid spring landing (3d)

Land extruded glyphs using a damped transform response and settle in the measured final pose.

**Movement:** dy=-1.2*exp(-6*s)*cos(8*s) wu with final dy forced zero; optional scale remains bounded; no soft-body solve implied.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a bevel-light accent; avoid compounding two independent spring envelopes.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D08, D09. Output-channel categories (equation is authoritative): transform.y_em. Scope: unit.

## F079: Solid scatter converge (3d)

Collect volumetric glyphs from seeded spatial offsets and rotations into their exact final text layout.

**Movement:** offset_i=seeded_vector(seed,i)*1.5*(1-s) wu; quaternion rotation approaches the final orientation; keep all paths outside near clipping.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Change distribution topology or add collision-aware paths; preserve original text indices.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D03, D08. Output-channel categories (equation is authoritative): layout.scatter_mix. Scope: unit.

## F080: Fracture reassemble (3d)

Reassemble mapped fragments into the exact unbroken glyph mesh, then replace or weld them cleanly.

**Movement:** Fragment transforms interpolate from supplied exploded transforms to identity; every fragment has a target correspondence; final gaps and overlaps removed.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with an initial reveal or a solid hold; generating meaningful fracture topology is an explicit rig requirement.

**Requirements:** fracture_mesh_rig

**Technical basis:** D08, D09. Output-channel categories (equation is authoritative): geometry.fracture_mix. Scope: unit.

## F081: Point cloud to solid (3d)

Move samples toward the target glyph surface and transition to the complete solid mesh before reading.

**Movement:** Point positions follow supplied source-to-surface mappings; point contribution fades as target mesh alpha rises; target mesh alpha=1 at hold.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Change sample distribution or attraction path; the final readable result must not depend on sparse points.

**Requirements:** surface_samples, particle_rig

**Technical basis:** D08, D09. Output-channel categories (equation is authoritative): geometry.assembly_progress. Scope: unit.

## F082: Surface conform release (3d)

Release volumetric text from an authored binding surface into an independent readable pose.

**Movement:** Use a supplied surface correspondence and bind deformation; blend bind weight from 1 to 0 while positions approach q_i.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Combine with a camera truck; declare the target surface and avoid making unsupported automatic binding claims.

**Requirements:** target_surface, surface_bind_rig

**Technical basis:** D09. Output-channel categories (equation is authoritative): geometry.surface_bind_mix. Scope: group.

## F083: Twist relief unwind (3d)

Unwind a twist through the extrusion depth while preserving the final glyph outline and volume.

**Movement:** Angle(z)=25*(z/depth)*(1-s) degrees; sufficient subdivisions required; final twist zero; recompute normals.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with extrusion growth only after defining their evaluation order and preventing self-intersection.

**Requirements:** subdivided_glyph_mesh

**Technical basis:** D07, D10. Output-channel categories (equation is authoritative): geometry.twist_deg. Scope: unit.

## F084: Volume slice reveal (3d)

Reveal actual glyph volume using a clipping plane or boolean surface moving through the 3D mesh.

**Movement:** Cutting plane offset traverses the measured mesh bounds; cap open slices if needed; remove the cut at hold so full volume remains.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a side light; distinguish this operation from a screen-space alpha matte.

**Requirements:** volume_clip_rig

**Technical basis:** D01, D05, D08. Output-channel categories (equation is authoritative): geometry.clip_progress. Scope: unit.

## F085: Light sweep relief (3d)

Move one light across stationary extruded text so real bevels and side faces catch changing illumination.

**Movement:** Key light x travels from -4 to 4 wu while aimed at the title; fill remains sufficient; final light pose is explicitly held.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a quiet extrusion entrance; a shader highlight on a flat plane is a different 2D/2.5D treatment.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D05. Output-channel categories (equation is authoritative): light.azimuth_deg. Scope: shot.

## F086: Orbit solid title (3d)

Orbit one camera a short distance around volumetric text and finish at its front-readable hero framing.

**Movement:** Camera azimuth goes from -15 to 0 degrees on a fitted radius; aim at measured title center; no camera-per-character duplication.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix local visibility stagger with the shared shot rig; preserve crop and counter visibility throughout.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D01, D03, D05. Output-channel categories (equation is authoritative): camera.azimuth_deg. Scope: shot.

## F087: Counter portal push (3d)

Hold a readable volumetric title first, then send one camera through a verified open letter counter as an exit to a supplied next scene.

**Movement:** Portal path is an authored collision-free camera spline; transit belongs to EXIT after reading, not generic entrance; next-scene plate required.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** After the complete read hold, follow the authored counter-portal camera path and cut to the supplied next-scene plate.

**Mix/customize:** Mix with a destination scene or match cut; if no suitable counter/path/exit plate exists, reject or choose an explicit different recipe.

**Requirements:** verified_counter_portal, portal_readable_exit_plate

**Technical basis:** D01, D03. Output-channel categories (equation is authoritative): camera.portal_progress. Scope: shot.

## F088: Solid depth stack collapse (3d)

Collapse decorative copies of extruded text in depth and remove them so one solid title survives.

**Movement:** Copy j z-offset=j*0.12*(1-s) wu; copies fade out before coinciding; master geometry stays intact.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Combine with a light sweep or word reveal; avoid z-fighting and dark overlapping surfaces.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D01, D08, D09. Output-channel categories (equation is authoritative): effect.layer_separation_em. Scope: group.

## F089: Rigid letter drop (3d)

Drop volumetric letters with actual colliders, solve contacts, bake the result and lock a readable final pose.

**Movement:** Simulation uses declared mass/gravity/colliders; cache must be generated; after the solve, blend to the authored read pose if necessary.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with an editorial hold; without a simulation cache this recipe remains conditional rather than pretending keys are physics.

**Requirements:** rigid_body_cache, colliders

**Technical basis:** D08, D09. Output-channel categories (equation is authoritative): simulation.progress. Scope: unit.

## F090: Solid bend straighten (3d)

Straighten a bent volumetric text mesh while restoring exact target glyph geometry.

**Movement:** Bend angle=25*(1-s) degrees around a declared axis/center; use adequate subdivisions and a rest mesh; final bend zero.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a small camera move; evaluate deformation before final normals and avoid collapsed counters.

**Requirements:** subdivided_glyph_mesh

**Technical basis:** D07, D10. Output-channel categories (equation is authoritative): geometry.bend_deg. Scope: unit.

## F091: Taper volume restore (3d)

Restore the side-volume taper of extruded glyphs without changing the final front-face text outline.

**Movement:** Cross-section scale along depth interpolates from an authored taper to 1; front face remains fixed; no negative scale.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Combine with controlled lighting; restrict taper so thin strokes and counters remain valid.

**Requirements:** subdivided_glyph_mesh

**Technical basis:** D07, D10. Output-channel categories (equation is authoritative): geometry.taper. Scope: unit.

## F092: Solid lattice settle (3d)

Remove a bounded lattice deformation from volumetric letters and restore their exact rest mesh.

**Movement:** Control-point displacement=authored_field*(1-s)^2; freeze nonmoving boundary controls where needed; all displacements zero at hold.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a reveal matte; record lattice topology and bind settings for reproducibility.

**Requirements:** lattice_rig

**Technical basis:** D07, D10. Output-channel categories (equation is authoritative): geometry.lattice_mix. Scope: unit.

## F093: Voxel volume build (3d)

Assemble discrete cells into a glyph volume and finish by displaying the accurate solid glyph mesh.

**Movement:** Voxel targets come from the supplied glyph volume; occupancy/reveal rises to complete coverage; final transition removes voxel stair stepping.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with spatial traversal or attraction fields; preserve thin glyph parts when choosing voxel resolution.

**Requirements:** voxelization_rig

**Technical basis:** D08, D09. Output-channel categories (equation is authoritative): geometry.assembly_progress. Scope: unit.

## F094: Wireframe solid resolve (3d)

Move from a visible volumetric wire representation to a fully surfaced, readable solid glyph.

**Movement:** Wire alpha decreases as surface alpha increases; keep real mesh depth; final surface alpha one and wire at declared residual or zero.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a light sweep; do not leave essential text readable only as a sparse wire cage.

**Requirements:** wireframe_shader

**Technical basis:** D01, D05. Output-channel categories (equation is authoritative): material.surface_mix. Scope: unit.

## F095: Emboss surface emerge (3d)

Raise real glyph relief from a receiving surface with coherent side geometry and contact shading.

**Movement:** Relief depth grows from epsilon to 0.16 em relative to receiver; boolean/union or embedded mesh relation is declared.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a grazing light; verify receiver intersections and preserve the complete final glyph silhouette.

**Requirements:** shadow_receiver

**Technical basis:** D01, D05. Output-channel categories (equation is authoritative): geometry.depth_em. Scope: unit.

## F096: Engravure cut reveal (3d)

Reveal recessed letter volume cut into a receiver so light and shadow expose the engraved shape.

**Movement:** Boolean cutter depth increases from epsilon to declared recess depth; receiver topology and normals must remain valid; text is a cavity, not floating fill.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Combine with a slow light move; add a readable alternate if the recess alone has insufficient contrast.

**Requirements:** boolean_receiver_rig

**Technical basis:** D05, D10. Output-channel categories (equation is authoritative): geometry.cut_progress. Scope: unit.

## F097: Shell volume open (3d)

Separate mapped shell pieces of a volumetric glyph and close them back into a clean final solid.

**Movement:** Shell transforms interpolate from supplied offsets to identity; correspondence and final weld/removal of coincident internal faces required.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with a reveal or short hold accent; keep topology repair as an explicit implementation step.

**Requirements:** shell_mesh_rig

**Technical basis:** D01, D10. Output-channel categories (equation is authoritative): geometry.shell_mix. Scope: unit.

## F098: Solid spiral tunnel (3d)

Arrange volumetric glyphs along a spiral tunnel and move them into a final readable title plane.

**Movement:** Initial p_i=(r_i*cos(theta_i),r_i*sin(theta_i),z_i); blend to q_i while reducing rotation; keep camera fixed or define one shared rig.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Change tunnel depth or winding, then validate ordering and clipping instead of assuming every string fits.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D03, D09. Output-channel categories (equation is authoritative): layout.tunnel_mix. Scope: group.

## F099: Magnetic solid assembly (3d)

Attract volumetric glyphs from supplied anchors into the final text layout using a deterministic field or authored keys.

**Movement:** p_i=q_i+(start_i-q_i)*(1-s)^2; optional curved field is explicitly specified; final rotation and position match rest.

**Read pose:** Exact shaped text at its measured target; stable geometry, intended color, no residual entrance offsets. Essential content remains readable throughout the read interval.

**Exit:** Fade the complete unit from opacity 1 to 0 over the selected exit duration; preserve its text, baseline and geometry until hidden.

**Mix/customize:** Mix with inter-unit collision-aware paths; call it a magnetic metaphor unless an actual simulation was performed.

**Requirements:** Actual shaped text and measured final layout; no additional special rig asset declared.

**Technical basis:** D08, D09. Output-channel categories (equation is authoritative): layout.attract_mix. Scope: unit.
