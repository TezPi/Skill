# From editorial intent to a finished edit

This is an AI-oriented application workflow, not a mandatory Murch procedure or an empirically validated model. Use the steps that serve the current request. A single-cut revision does not require rebuilding the entire video brief.

## 1. Create a decision-ready brief

Record purpose, audience, message, genre, point of view, and the intended emotional change. Define success in concrete reception terms: understanding a procedure, recognizing evidence, sensing hesitation, or following a chase. “Make it more engaging” is too broad to select a shot by itself; interpret it from context or ask when different meanings would produce substantially different results.

Separate confirmed requirements from assumptions: duration, aspect ratio, allowed sources, music, captions, mandatory content, preserved spoken meaning, and delivery type. Do not turn an interview into an advertisement or add a twist simply to strengthen the story. Continue with supported work when missing information does not block it.

## 2. Inventory sources and access

| Available input | Supported use | What remains unverified |
|---|---|---|
| Accessible video and audio | Record behavior, sound, and context within inspected ranges; evaluate playback timing. | Actual audience response, uninspected media, and unread metadata. |
| Timestamped transcript | Organize arguments, remove repetition, and build a provisional radio edit. | Exact cut frames, vocal quality, precise pauses, gaze, and visual geography. |
| Stills or storyboard | Plan composition, information regions, coverage, and order. | Movement, performance over time, and audiovisual timing. |
| Brief or script | Develop a beat map and coverage plan. | Whether footage exists or a take performs well. |

Preserve the distinction between user descriptions and direct AI observation. A conclusion can rely on a supplied fact, but identify that basis. If a source cannot be opened, offer conditional options and request only inputs needed for the next consequential step.

## 3. Build a sufficient shot log and beat map

A shot log records source ID, description, people/objects, dialogue/sound, behavior, function, and checks. Add source in/out when verified. If the input contains only labels A/B/C, retain those labels without inventing filenames or timecodes.

Connect these layers in the beat map:

| Beat | What viewers know/feel before | Necessary change | Supporting source | What comes next |
|---|---|---|---|---|
| Project-defined ID | Initial state and open question | Information or emotional development | Existing shot, line, or action | Intended understanding and feeling |

A beat need not have its own shot. Mark where action relationships must be clear and where ellipsis or montage is appropriate. For tutorials, check dependencies between steps; for interviews, the argument; for fiction, what characters and audiences know.

## 4. Assemble by function

Place the necessary material so the video progresses before polishing every transition. Ask “What would viewers lose if this were removed?” to identify redundancy, then consider changes in meaning or emotion before removing a pause or a shot without speech.

Select existing coverage for its purpose: a master for relationships when needed, a close-up for a significant detail, a reaction for consequence, an insert for evidence. Not every scene needs to open wide. Do not list nonexistent pickup footage as available; distinguish `available` from `pickup_needed` when additional coverage is required.

## 5. Refine through purposeful comparison

Create A/B options where a conflict or uncertainty warrants them. Compare with equal surrounding context, sound, and intended playback speed. Include the unchanged version or a hold when relevant.

A useful explanation is: “The source description places B's reaction after the important information. Try moving picture to B while A's speech continues, so viewers can read its effect. This reduces time on A; verify the reaction's context and natural overlap on the source.” This separates evidence from a proposal without pretending to have locked a frame.

For dialogue, preserve emphasis, consonants, and meaningful phrasing; trim excess without making delivery rushed or changing its nuance. For action, compare phase, direction, and speed rather than one matching pose. For music, consider phrasing, entrances/exits of layers, and climaxes according to the brief. A transition earns its place when it communicates time, subjectivity, conceptual connection, or structure; it cannot repair an unclear editorial purpose by decoration alone.

## 6. Track picture and sound separately

Record distinct picture and audio transition points when they overlap. J/L-cut labels describe that relationship rather than guarantee a cinematic result. Check for missing words, repeated sound, abrupt ambience changes, and unintended implications about time or location.

An audio bridge can join a sequence but can also imply simultaneity between different moments. In factual material, verify the meaning created by the join. Music, room tone, and B-roll do not replace checking the truthfulness of the content.

## 7. Check three visual layers in the final format

Read A→B in context: predicted attention target, screen eyeline/action orientation, and relationships in the represented space. Identify the criterion being examined while allowing a problem to affect several layers.

For coordinates, use `(0,0)` at top left and `(1,1)` at bottom right of the **output frame after cropping**, with x increasing rightward and y downward. Label an image-based estimate `estimated_from_frame`; use `measured_eye_tracking` only with real gaze measurements. A verbal region such as “lower right, hand” is often sufficient. Coordinate distance is not an automatic quality score.

After reframing 16:9 to 9:16, recheck gaze paths, hands, props, targets, captions, and joins. Text requires reading attention; avoid simultaneously demanding inspection of a small essential action and a new text block when playback shows competition. Inspect output with its actual sound, captions, and known platform layout; do not invent current safe-area specifications.

## 8. Prioritize by impact

| Practical priority | Signs | Response |
|---|---|---|
| Prevents the video's purpose | Changed meaning, a missing essential step, unclear actor/action, or unreadable required information. | Lead with the impact and a repair. |
| Weakens the experience | A lost reaction, rushed timing, music competing with speech, or difficult attention shifts. | Propose a testable change with evidence and tradeoff. |
| Finishing | Minor discrepancies or aesthetic details with limited effect. | Adjust when the benefit is clear without undermining performance/story. |

This is the skill's work-prioritization aid, not another Murch percentage system. Judge a continuity discrepancy by the misunderstanding it creates; a small detail can become a high priority when it is a clue.

## 9. Review and report the actual delivery state

Watch the scene and complete video rather than only looping frames around a cut. A silent pass can reveal visual competition; audio-only review can diagnose dialogue logic. Return to the combined experience afterward. If viewers test the edit, ask what they understood and where they lost track rather than only whether they liked it. One person's response does not establish a representative audience outcome.

For planning, deliver a conditional beat map/cut list and footage requirements. For execution, verify the project/sequence, source mapping, fps/timebase, format, and version before frame-exact changes. For VFR or mismatched timestamp systems, use appropriate time references and verify mapping instead of guessing rounded frames. Preserve recoverability within the available tool and requested scope.

Report what was done and what remains unchecked: a proposal, timeline edits, a render, or inspection of the exported file. A JSON cut list is not an NLE project or a standard EDL. If EDL/XML/executable scripting is requested, convert against the real tool and format specifications; renaming the JSON does not make it compatible.

## JSON template conventions

The [edit-plan template](../assets/edit-plan-template.json) is a customizable handoff scaffold, not a mandatory schema. Omit unnecessary parts or add project fields. Every `null` means a value is unknown; an empty array means no entries have been listed and does not prove there are no issues.

Use these labels consistently:

- `evidence_type`: `observed`, `user_provided`, `inferred`, `proposed`, `unknown`.
- `status`: `appropriate`, `review_needed`, `insufficient_evidence`, `not_applicable`.
- `confidence`: `low`, `medium`, `high`, or `null`; explain confidence in the conclusion rather than treating it as the probability of an audience response.
- `time_reference`: specify verified units/timecode; time fields do not inherently mean frames. For `HH:MM:SS:FF`, provide fps and the applicable timecode convention. For seconds, specify `seconds` and avoid unverified frame conversion. For frame-exact handoff, state whether indexing begins at 0 or 1 (`frame_index_origin`) and whether the out point includes the final frame (`out_point_convention`), following the target tool's conventions.
- `source` locates material within the original media; `timeline` locates it within the target sequence. They can have different fps/timebases, so metadata is separate.

Keep evidence, purpose, choice, tradeoff, and verification linked within each decision. Leave unsupported values unknown rather than filling fields for completeness.
