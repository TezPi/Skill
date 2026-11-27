# SFT pipeline bridge (Delta, Pillar 1)

How the Rule of Six plugs into SFT Super Motion Studio V2: when it is mandatory, what the pre-flight must produce, how the six criteria translate to motion graphics with no camera footage, and where it sits in the Forge pipeline. The mappings below are this plugin's application of Murch's criteria, not Murch's definitions (see [sources](sources.md)).

## 1. When the pre-flight runs

| Job | Pass |
|---|---|
| Watched, time-based deliverable with 2+ shots or scenes: footage edit, talking-head, film, reel, explainer, MV, launch film, slideshow, captioned clip, multi-scene animation | **Full** pre-flight (section 2) |
| Single-shot piece: logo sting, loop, lower third, one title card, one transition | **Lite**: one line each for emotion, story, rhythm, eye-trace; 2D/3D only if something moves across the frame |
| Live UI micro-interaction, pure encode/convert, SVG cleanup, asset prep | Skip |
| Revision of one cut or one scene | Scope to that join: evidence → purpose → decision → tradeoff → check |

Run it before choosing host, engine, or writing any code/timeline change. Pillars 2 and 3 of `sfc-super-motion-v1` then attach motion parameters and text blueprints to every beat this pass produces. It is short; scale it to the request.

## 2. Pre-flight output (full pass)

1. **Brief**: purpose, audience, message, genre, point of view, intended emotional arc, duration, aspect ratio, must-survive content (spoken meaning, procedure order, required claims). Assumptions stated in one line each.
2. **Evidence inventory**: every input labelled `observed` / `user_provided` / `inferred` / `proposed` / `unknown`. Never claim to have watched or heard what was not inspected.
3. **Beat map**: per beat, viewer state before → change → state after, plus the supporting shot/scene.
4. **Provisional cut/scene list**: per join, its purpose, picture transition and sound transition recorded separately (J/L), hold/no-cut considered.
5. **Checks**: what must be replayed at speed with sound before locking.

Large job or handoff: fill `../assets/edit-plan-template.json`. Small job: a compact table.

## 3. Six criteria in motion graphics (no camera)

| Criterion | In code-rendered or AE motion graphics |
|---|---|
| Emotion | The feeling per beat chooses ease family, tempo, palette temperature and sound density. Motion that serves no intended feeling is decoration; cut it. |
| Story | Each scene must change what the viewer knows (problem → mechanism → proof → result → CTA for launches). A scene that changes nothing is removed, not dressed up with a transition. Setups (a UI element, a number) must be shown before their payoff. |
| Rhythm | Dramatic beats set scene boundaries; a BPM grid quantizes them only when music leads. Durations follow information load (reading time for copy, inspection time for UI). Holds are real options. Vary scene lengths on purpose; equal lengths are a by-product, not a style. |
| Eye-trace | One primary focal point per moment. The incoming scene's focal point lands where the outgoing one ended, or a motion/sound cue leads the eye there. Animated text must not compete with the action it explains. Check stills pairwise: last frame of A vs first frame of B. |
| 2D screen plane | Keep a consistent screen grammar: progress/forward flows one direction (e.g. L→R), recurring objects keep their side (product left, copy right), transition direction matches narrative direction (forward pushes one way, back the other). Reframing to 9:16 re-checks all of this. |
| 3D action space | In 3D scenes, do not jump the camera across the object's axis without a visible move; object state, position and depth order persist across cuts; a turntable keeps one rotation direction unless the reversal means something. |

Mark `not_applicable` with a reason for abstract montage that implies no continuous space.

## 4. Forge pipeline integration (`motion-director` §3)

- **Step 0**: `sfc-super-motion-v1` (this pillar first, then Pillars 2 and 3). Nothing below starts until the beat map exists.
- **Step 1 spec**: state-table rows come from the beat map. The BPM grid is the quantization layer, never the source of structure; any cut on a musical accent also names its dramatic purpose.
- **Step 4 stills**: one still per beat, reviewed in pairs for eye-trace handoff and screen direction, not only as single frames.
- **Step 7 QA → triple gate**: motion gate + delivery gate + **editorial gate** = three-scale review (join / scene / whole video) at playback speed with sound, each key decision tagged `appropriate` / `review_needed` / `insufficient_evidence` / `not_applicable`. Ship only when all three pass.
- **Report** the real state: analyzed, proposed, applied to timeline, or exported. No promised retention or engagement percentages.

## 5. Per host

- **Premiere / After Effects** (`edit-ae-pr-master`): build the radio edit (spoken meaning) first, then picture; J/L via split audio/video trims; confirm sequence fps/timebase before frame-exact changes; after any reframe re-check eye-trace, 2D and 3D.
- **Talking-head**: cut on meaning shifts and reactions, keep breaths and consonants; remove repetition only after checking it adds nothing; B-roll illustrates the spoken claim and never masks altered meaning.
- **Code hosts** (`code-motion-graphics`, `code-hyperframes`, `code-remotion`, `code-motion-canvas`): the beat map becomes the timeline; each transition earns its place by signalling time, subjectivity, concept link or structure.
- **Captions and vertical cuts**: captions are an attention participant: chunk them by meaning, keep them off the crucial action; use platform safe areas only from the brief or a verified spec.
