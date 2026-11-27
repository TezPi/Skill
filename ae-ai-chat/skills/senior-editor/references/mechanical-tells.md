# Mechanical tells (ME-) library

Each tell is a default choice showing through. Entries are ordered strongest first. For each: what it looks like, why it reads as made by default, the fix, and when a senior editor keeps it on purpose. "Keep when" always needs a reason you can say in one sentence; "it looks nice" is not one.

Check at three scales, like paragraph shape in prose: a single move, a scene, and the whole piece. A tell that repeats across scenes (the same end flourish on every section) is the same tell at a larger scale.

---

## Tier 1: act on one sighting

### ME-01 Uniform rhythm
**Looks like:** every shot or scene within ±10% of the same length; a cut on every bar of the music; a 30 s piece built as ten 3 s scenes.
**Why:** durations were assigned, not earned. Real editing follows information load and feeling, so lengths spread out with a long tail.
**Fix:** derive each duration from the beat map: reading time for copy, inspection time for UI, breathing room for the feeling beat. Let the feeling beat run long and the transitional beats run short. When music leads, place cuts by dramatic purpose first, then snap to the nearest musical accent.
**Keep when:** the uniformity is the idea (a metronomic montage about routine, a strict grid music video), and the notes say so.
**Measure:** `editor_fingerprint.py scan` → `cv` under about 0.25 or `near_median_share` at 0.6 or more raises the flag.

### ME-02 One curve on everything
**Looks like:** every channel of every element uses the same ease (CSS `ease`, `ease-in-out`, AE Easy Ease 33/33, one `power2.out`); enter and exit share it.
**Why:** the curve was never chosen. Weight, role and intent all move differently.
**Fix:** a named Pillar 2 token per channel, chosen for this element's role at this beat. Hero arrives on a premium out-curve and settles; supporting elements use a shorter, plainer token; exits use an accelerating curve and fewer properties.
**Keep when:** a live UI system where consistency is the brand contract (still use the brand's token set, not one curve).

### ME-03 Fade-up-everything
**Looks like:** each element enters with opacity 0→1 plus a 20–40 px upward slide, same duration, scene after scene.
**Why:** it is the template entrance. It says "something appeared" and nothing about what it is or where it came from.
**Fix:** choose the entrance from the element's role and the screen direction the edit has set: some things simply cut in, some are revealed by a mask or by the camera, some are pushed in by another element, a number counts, a line draws. Vary by role, not by random choice.
**Keep when:** a single, quiet, supporting element in a scene where the hero has a distinct entrance.

### ME-04 Stagger by rule
**Looks like:** the same interval (often 50–100 ms) between every item of every group, always left to right or top to bottom, regardless of meaning.
**Why:** order and timing were not decided by reading or importance.
**Fix:** order by meaning (hero first, or hero last as the payoff), group by phrase or row before staggering, vary the interval within the Pillar 2 cap, and add seeded `VAR-` jitter of ±1–2 frames where the items are organic (photos, cards) rather than tabular.
**Keep when:** tabular data, lists that must read in order, UI where predictability matters. Then keep the order strict and the interval short.

### ME-05 Transition as connector
**Looks like:** the same device on every join: whip pan, glitch, zoom blur, light leak, swipe, morph.
**Why:** the device stands in for deciding how two shots relate, exactly as dashes stand in for deciding how two clauses relate.
**Fix:** straight cut by default. Use a device only where it carries meaning: a time jump, a change of point of view, a concept link (match cut), a structural chapter. Let sound do the joining (J/L cut) more often than picture.
**Keep when:** the device is the piece's signature and is used at the structural joins only, not every join.

### ME-06 Inflation stack
**Looks like:** particles, glow, lens flare, chromatic aberration, 3D extrusion, camera shake, a riser and a boom, all on ordinary information (a settings toggle, a changelog line, a price).
**Why:** importance is asserted by effects instead of shown by content, like "pivotal" and "testament" in prose.
**Fix:** effect weight proportional to the real significance of the beat. Strip effects until the beat gets weaker, then put back the last one removed. The biggest moment should feel big partly because the rest was quiet.
**Keep when:** the beat is genuinely the climax and the rest of the piece is restrained.

### ME-07 Staged reveal that pays nothing
**Looks like:** blackout, slow push, "And now…", a long build before an ordinary fact; an end card that restates the opening headline; a closing "The future is here." beat.
**Why:** the build asks for attention it does not repay. The repeated end card is the one-line closer of video.
**Fix:** get to the fact. Build only when the reveal itself is the payoff. End on the last concrete thing: the product doing its job, the CTA, the one striking detail.
**Keep when:** the reveal is the product or the punchline, and the build is short relative to the payoff.

### ME-08 Leftovers
**Looks like:** lorem ipsum, "John Doe", "$1,234.56", "Your Company", default fonts nobody chose, 1 s default durations, a template watermark, a loop seam in a non-loop, a stock "like and subscribe" card, audio tails running past the cut, an unused adjustment layer still rendering.
**Why:** drafting material was never cleared, the video version of "I hope this helps!".
**Fix:** remove. Use real or user-supplied content. If the real content is missing, ask for it or simplify the shot; never fill the gap with invented data that looks real.
**Keep when:** never in a delivery. In a clearly labelled animatic, placeholders are fine and the notes say they are placeholders.

### ME-09 Copy tells (on screen and in VO)
Run every word through `canon/humanizer-3.1.0.md` (the prose method, structure-first). Video copy has its own frequent offenders:

| English | Vietnamese |
|---|---|
| "Introducing…", "Meet X" as a reflex opener | "Giới thiệu…", "Chào mừng bạn đến với…" |
| "Unlock the power of", "Take X to the next level", "Elevate your" | "Nâng tầm", "Mở khóa sức mạnh", "Đưa X lên một tầm cao mới" |
| "Not just X. It's Y." | "Không chỉ là X, mà còn là Y", "Hơn cả một X" |
| Triad slogans: "Fast. Simple. Secure." | "Nhanh chóng. Tiện lợi. An toàn." |
| "The future of X is here", "Redefining X" | "Kiến tạo tương lai", "Định nghĩa lại X", "Kỷ nguyên mới" |
| "Seamless", "cutting-edge", "game-changing", "all-in-one" | "Liền mạch", "đột phá", "vượt trội", "toàn diện", "tối ưu" |
| "Let's dive in", "Here's how it works" | "Hãy cùng khám phá", "Cùng tìm hiểu" |
| "In today's fast-paced world" | "Trong thời đại số", "Trong bối cảnh hiện nay", "Hơn bao giờ hết" |
| Closer that restates: "X. Made for you." | "X. Dành cho bạn.", "Hành trình bắt đầu từ đây." |

**Fix:** say what the thing does, with the specific: the number, the screen, the user's words. Keep slogans only when they are the client's approved tagline (locked layer).
**Before:** "Introducing Nova. Not just a CRM. It's your growth engine. Fast. Smart. Seamless."
**After:** "Nova reads every Zalo chat and drafts the reply. Your team just hits send."
(The after-copy uses only facts from the brief. If the brief has no such fact, ask for it.)

---

## Tier 2: reliable; act on clear hits in mixed and full passes

### ME-10 No stillness
**Looks like:** nothing ever holds; idle breathing on every layer; the camera always drifts.
**Fix:** decide where the stillness is first. Text in its read hold, data, and the hero's landing frame hold still. Motion then reads as contrast.
**Keep when:** a deliberate restless piece (anxiety, chaos) that resolves into one still moment.

### ME-11 Centred and symmetric by default
**Looks like:** every composition centred, every layout mirrored, no use of negative space.
**Fix:** compose for eye-trace: place the focal point where the previous shot's attention ended; let negative space point at what comes next.
**Keep when:** luxury, architecture, ceremony, logo resolve. Symmetry there is a statement.

### ME-12 Re-explaining (wrong viewer)
**Looks like:** a 3 s logo before the hook; every click of a flow the viewer can infer; on-screen text repeating the VO word for word in a sound-on piece; a recap card listing what was just shown.
**Fix:** lead with what the viewer does not have. Cut inferable steps; keep the one step they would get wrong. On-screen text adds what the VO does not (the number, the name), unless it is an accessibility caption track.
**Keep when:** captions for sound-off surfaces and accessibility; legally required disclosures.

### ME-13 Overshoot everywhere
**Looks like:** every element springs past its target and wobbles back, including text, icons and numbers.
**Fix:** overshoot only on objects with implied mass and a reason to bounce. Text, data, colour and opacity never overshoot (Pillar 2 guardrail).
**Keep when:** a playful brand whose token set is bouncy, applied to objects, not to reading.

### ME-14 SFX on every move
**Looks like:** a whoosh per transition, a click per element, a riser before every scene.
**Fix:** sound for weight and meaning only. Leave 6–12 frames of air before the hit that matters. Room tone and a few well-placed accents beat a wall of effects.
**Keep when:** UI sound design where every interaction has a documented sound, quietly mixed.

### ME-15 Every word animated
**Looks like:** per-letter or per-word kinetic treatment on every line, the video version of bold on every phrase.
**Fix:** animate the emphasis words the speaker stresses; let the rest simply be there and readable. Group long lines by phrase (Pillar 3).
**Keep when:** a short kinetic-type piece where the type is the whole show.

### ME-16 One template for every card
**Looks like:** identical lower third, title card or callout box regardless of content length, importance or position in the story.
**Fix:** one system, variants by role: the first appearance can be fuller, repeats lighter; long names get a different line break, not a squeezed font.

### ME-17 Generic stock for the specific
**Looks like:** glowing network nodes for "AI", a handshake for "partnership", a globe for "global", a rocket for "growth".
**Fix:** the real product, the real people, the real place, or pure typography. If none exists, a well-set sentence beats a cliché image.

### ME-18 Forced triads
**Looks like:** three feature cards, three icons, three beats, when the content has two or four.
**Fix:** match the count to the content. Develop the strongest item; merge the weak ones.
**Keep when:** the content really has three parts.

---

## Tier 3: act only when stacked with Tier 1–2 hits

| ID | Looks like | Fix |
|---|---|---|
| ME-19 Unmotivated camera | Slow push-in or parallax drift on every shot | Move the camera when it reveals, follows or changes meaning; otherwise lock it |
| ME-20 Preset grade | One LUT or teal-orange on everything regardless of feeling | Grade per beat's emotion; warm/cool shifts mark story turns |
| ME-21 Grid lock | Every scene uses the same safe-area composition and text position | Keep the system, vary placement by eye-trace and screen direction |
| ME-22 Reverse-played exits | Everything leaves by playing its entrance backwards, all at once | Exits shorter, fewer properties, ordered by what the next scene needs |
| ME-23 Wall-to-wall sound | Music at constant level start to end, no silence, no dynamics | Duck under meaning, drop out before the hero beat, let a silence land (`editor_fingerprint.py` flags no silence ≥ 0.3 s) |

## Tier 4: weak alone; default is to leave them

| ID | Often deliberate when |
|---|---|
| ME-24 Linear motion | Mechanical subjects, conveyors, tickers, marquees, timecode, glitch or brutalist aesthetics |
| ME-25 Symmetry | Luxury, architecture, ceremony, logo resolve |
| ME-26 Fast cutting | Action, music-driven edits, montage, trailers |
| ME-27 Centred titles | Title cards, chapter cards, end frames |

---

## Human residue to protect

These are the details that make work feel made by a person. Do not "clean" them away unless they hurt meaning:

- A specific, unusual detail: the real street sign, the actual customer message, the odd prop on the desk.
- Real imperfection in footage: a breath, a glance off camera, a small handheld drift, a laugh that runs over.
- Mixed feeling: a beat of tension that is not resolved into cheer.
- Era-bound and local references the audience will recognise.
- A rule-break the editor can explain in one sentence.

## Worked example: 15 s SaaS launch, plan level

**Before (machine default)**

| t (s) | Beat | Motion | Sound |
|---|---|---|---|
| 0–3 | Logo | Logo fades up, glow, particles | Riser + boom |
| 3–6 | "Introducing Nova" | Word-by-word fade-up, 80 ms stagger | Whoosh |
| 6–9 | Three feature cards | Each fades up, 80 ms stagger, overshoot | Whoosh ×3 |
| 9–12 | Dashboard | Slow push-in, `ease-in-out` | Whoosh |
| 12–15 | "The future of sales is here." | Fade-up, glow | Boom |

Tells: ME-01 (five 3 s scenes), ME-02, ME-03, ME-04, ME-05, ME-06, ME-07 (closer), ME-09 (copy ×2), ME-12 (logo first), ME-13, ME-14, ME-18. Density about 8 T1 per 10 s → full pass.

**After (one idea: "Nova answers your customers before you can")**

| t (s) | Beat | Motion | Sound |
|---|---|---|---|
| 0–1.6 | Hook: a real Zalo chat, customer asks a price at 23:47 | Cut in, message bubble pops on `SPRING_SAAS_CARD`, no other motion | Notification tick |
| 1.6–5.2 | Nova drafts the reply in place (the feeling beat) | Typing reveal of the real draft, everything else still; camera locked | Room tone only, silence 8 f before the send |
| 5.2–6.0 | Send | Bubble lifts on `PUNCHY_ENTER_15_85`; timestamp "23:47" stays still | One soft send click |
| 6.0–10.4 | Proof: the morning inbox, 37 conversations answered | Counter on the critically damped preset, monotonic; list rows staggered by recency, `VAR-01` ±1 f seeded | Music enters under, low |
| 10.4–13.0 | The one setting that makes it work | Straight cut, cursor to the toggle, hold 1.2 s on the toggle | Music swells slightly |
| 13.0–15.0 | Logo + CTA "Try Nova free" | Logo cuts in, settles; CTA on a quiet out-curve; nothing exits | Music resolves |

Shot lengths now 1.6 / 3.6 / 0.8 / 4.4 / 2.6 / 2.0 s. The 23:47 time, the 37 conversations and the toggle must come from the brief; if they don't, ask, or show the mechanism without numbers.
