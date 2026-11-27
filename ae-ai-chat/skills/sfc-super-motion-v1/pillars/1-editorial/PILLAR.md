---
name: video-editing-structure
description: "Analyze, plan, edit, and review video using Walter Murch's Rule of Six: emotion, story, rhythm, eye-trace, the two-dimensional screen plane, and three-dimensional action space. Use for shot selection, cut timing, picture–sound relationships, pacing, and continuity, working from a brief, transcript, footage, or rough cut."
---

# video editing structure

Turn editorial intent into evidence-based choices: what viewers should feel, understand, notice, and follow. Adapt the approach to the video being made, preserving the user's chosen tools, genre, and scope. Use the language requested for each task, including dialogue and captions; the template's `language` describes plan text and can be changed.

## Foundations

Walter Murch presents the Rule of Six in *In the Blink of an Eye*. His editorial priority order is **emotion → story → rhythm → eye-trace → the 2D screen plane → 3D action space**. The figures **51/23/10/7/5/4** illustrate that hierarchy; they are neither measured coefficients nor a quality formula. See [research sources](references/sources.md) for attribution and limits.

| Criterion | Decision question |
|---|---|
| Emotion | Does the edit support the intended emotional experience at this moment? |
| Story | What does the viewer learn, reinterpret, or anticipate after this shot or cut? |
| Rhythm | Does the timing fit the change in meaning, performance, action, pause, and sound structure? |
| Eye-trace | Where is the viewer likely attending, and how does the next shot guide attention toward necessary information? |
| 2D screen plane | Are screen-left/right, eyelines, movement directions, and axis relationships readable? |
| 3D action space | Do relative positions, paths, and action states make sense within the scene's world? |

Here, “2D screen” means the *two-dimensional plane of the screen/planarity*; “3D screen” means the *three-dimensional space of action*. These terms concern continuity rather than resolution, CGI, or stereoscopic displays. Viewer eye-trace differs from a character's eyeline. The 180-degree rule supports both screen orientation and spatial understanding; a technique can affect several criteria.

Read [the six criteria](references/six-criteria.md) for a deeper definition, diagnosis, or conflict. Load the relevant section rather than every reference for a simple question.

## Choose a mode from the request and available evidence

| Mode | Appropriate output |
|---|---|
| Analyze | Functions of beats or shots, expected effects, issues, and supporting evidence. |
| Plan | Emotional arc, beat map, shot order, provisional cut list, picture–sound proposals, and checks. |
| Review | Issues prioritized by impact, verified locations, proposed fixes, and ways to evaluate them. |
| Execute edits | Timeline or file changes using tools actually available, within the requested scope; verify results and report the real state. |

A brief or transcript still supports a useful structural plan. Label a plan as a plan. If editing tools are unavailable, provide an actionable handoff without promising a render.

## Establish evidence before making decisions

Distinguish these categories in notes and outputs when they affect a conclusion:

- **Observed:** directly seen or heard in accessible media.
- **User-provided:** supplied in a description, transcript, or shot log; not independently verified unless the source was inspected.
- **Inferred:** an interpretation or prediction supported by evidence.
- **Proposed:** an editorial choice to try.
- **Unknown:** missing material or an unchecked fact.

Video with sound supports observations about movement and timing within the material actually inspected. A still supports composition at that frame, not movement or pacing. A transcript supports words and information order, not facial performance, gaze, camera geography, vocal quality, or exact cut frames. Never claim to have watched or heard inaccessible material.

Record source IDs and inspected ranges. Separate **source in/out** from **timeline positions**. Use `null` or “unverified” for unknown timing. Finalize frame-level decisions only after establishing fps/timebase and source-to-timeline mapping; check variable frame rate when relevant. Do not guess exact frames from transcript timestamps.

## Practical workflow

Read [the editing workflow](references/editing-workflow.md) for a full video or review pass. Scale the process down for a narrow request.

### 1. Define the editorial intent

Establish purpose, audience, message, genre, point of view, intended emotional change, duration, and aspect ratio from context. Record requirements that must survive the edit: spoken meaning, procedural order, evidentiary details, required content, and source restrictions.

Ask only for missing information that materially blocks a decision. Otherwise, state a brief assumption and continue. An emotional intention is an editorial target, not a finding about a character's or viewer's actual mental state.

### 2. Map beats and select existing coverage

Describe each beat as **state before → change → state after**: what viewers know, which question remains open, what emotional change is intended, and which source cue supports it. A beat need not equal one shot.

Select shots or takes by function: establishment, action, information, reaction, evidence, transition, consequence, or a meaningful pause. Preserve setups needed for payoffs. Remove repetition after checking whether it adds meaning or emotional development.

### 3. Build the structure, then refine rhythm

Create a clear assembly, then test in/out points, duration, pauses, and picture–sound relationships. Judge timing at the intended playback speed.

Distinguish dramatic beats from musical beats. Music can supply the main structure in a music video or montage when the brief calls for it. In dialogue and performance, shifts in meaning and reaction often provide important cues. Avoid cutting at a fixed number of seconds or on every musical beat without a specific purpose.

Treat **holding the shot/no cut** as a real option. When timing is uncertain, compare an earlier cut, a cut at the change, and a later cut; ordinary joins do not require three versions.

Consider sound independently of picture: a J-cut introduces the incoming shot or scene's sound before its picture; an L-cut carries the outgoing sound over the next picture. Use overlaps that fit the meaning and source context. B-roll concealing a picture join does not repair misrepresented speech.

### 4. Check attention and continuity

At important joins, identify the outgoing and incoming focus, attention cues, and competing elements. Label focus as predicted unless actual eye tracking is available. If estimating coordinates, use the actual output frame: origin at the top left, x increasing rightward, y downward, range 0–1. Avoid false precision.

Track screen-left/right, eyelines, action direction, camera-axis relationships, and relative positions. Check match-on-action across movement rather than a single frame. When the axis or layout changes, consider existing re-establishing footage, an on-axis angle, or a visible camera crossing; replay the sequence to assess whether the choice orients viewers.

Recheck all three visual criteria after cropping, reframing, or adding text. A centered face is not always the main information; hands, objects, action results, or text may matter more at a particular beat.

### 5. Resolve tradeoffs

Among options that satisfy the project's requirements, use Murch's order as the default artistic priority. Identify a specific gain in emotion, story, or rhythm, then state the cost and how to evaluate it. A small spatial discrepancy may be acceptable; a discrepancy that changes who did what or removes an essential step becomes a story issue.

The 51% figure does not justify altered meaning, fabricated reactions, or unsupported causality in factual footage. Every cut need not be perfect on all six criteria. Mark spatial continuity as not applicable, with a reason, when a montage does not imply one continuous space.

### 6. Review at three scales

- **Join:** emphasis, reaction, speech, movement, attention, and action state around the cut.
- **Scene or sequence:** purpose, information progression, breathing room, pace changes, establishment, and reorientation.
- **Whole video:** emotional arc, structure, repetition, payoff, and suitability for the final format.

Evaluate picture and sound together at the intended speed. A silent pass or audio-only pass can diagnose specific problems; return to the complete experience afterward. For vertical output, check the crop, captions, and known platform interface areas. These are practical checks, not scientific guarantees of audience response.

When executing edits, work in a recoverable version, verify actual changes, and inspect the requested timeline or output. Report whether work was analyzed, proposed, applied to the timeline, or exported. This skill does not authorize publishing or sending the video externally.

## Output contract

Match detail to the request. A small question may need only a choice, reason, tradeoff, and check. A complete video can use a short brief, beat map, cut list or prioritized review, and unknowns. For structured handoff, copy the [edit-plan JSON template](assets/edit-plan-template.json) and fill known values. It is a template, not a JSON Schema or executable editing command.

An important editorial decision should contain:

| Field | Required substance |
|---|---|
| Evidence | Source and what was actually observed or supplied. |
| Purpose | The intended change in what viewers feel, understand, or recognize. |
| Decision | A concrete hold, trim, shot/order change, picture transition, or sound transition. |
| Six-criterion effects | Relevant criteria, including justified unknowns or non-applicable items. |
| Tradeoff and alternative | Benefits, costs, and a meaningful competing option. |
| Verification | What must be replayed, compared, or checked before finalizing. |

Use statuses `appropriate`, `review_needed`, `insufficient_evidence`, and `not_applicable`. Distinguish evidence confidence from artistic predictions. Do not turn weighted totals into an objective quality score or promise an unmeasured percentage increase in retention or emotional impact.

See [worked examples](references/worked-examples.md) for conflicts, missing footage, and reframing. The examples are fictional exercises, not clips that have been inspected.
