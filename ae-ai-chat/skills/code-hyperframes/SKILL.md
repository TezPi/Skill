---
name: code-hyperframes
description: "Use for any request to make, edit, animate or render a video, motion graphic, captioned clip, slideshow or HTML-to-video composition with HyperFrames (HeyGen), or to port Remotion to HyperFrames. (Formerly hyperframes-bootstrap.) Load senior-editor (Layer 0) then sfc-super-motion-v1 first (Rule of Six editorial, Shape & Motion Graph tokens, Motion Text blueprints)."
---

# HyperFrames bootstrap

HyperFrames (github.com/heygen-com/hyperframes, Apache-2.0) renders video from HTML: a composition is an HTML file whose DOM declares timing with `data-*` attributes, whose animation runtime is seekable (GSAP by default), and whose media playback is owned by the framework. The official skill set is 21 skills, ~900 files. This skill does not replace it; it installs it and gives a quick reference.

## Step 1: install the official skills (always, before building)

The official skills are the source of truth. Install them into the workspace at the start of any build or edit:

```bash
npx -y hyperframes@latest skills update          # core set: hyperframes, hyperframes-core/-animation/-audio/-cli/-creative/-keyframes/-registry/-studio, media-use
npx -y hyperframes@latest skills update <workflow> # add one workflow when routing selects it
npx -y hyperframes@latest skills                 # full published set (all 21)
```

They land in `~/.claude/skills/<name>/SKILL.md` (and `~/.agents/skills`). Then read `~/.claude/skills/hyperframes/SKILL.md` and follow it as the entry point; it routes to the workflow and domain skills. Requires Node 22+ and FFmpeg for render.

If installation fails (network, npm), say so plainly. Do not reconstruct a workflow from memory; the quick reference below is only for answering questions and small edits.

Persistent alternative for Claude Code users: `claude plugin marketplace add heygen-com/hyperframes` then `claude plugin install hyperframes@hyperframes`, or `npx skills add heygen-com/hyperframes`.

## Routing (from the official entry skill; first match wins)

1. Port existing Remotion source → `remotion-to-hyperframes`
2. Presentation, pitch deck, navigable deck → `slideshow`
3. Plain captions/subtitles on existing talking-head footage → `embedded-captions`
4. Designed graphic overlays on talking-head/interview/podcast footage → `talking-head-recut`
5. Beat-synced video driven by a music track → `music-to-video`
6. Short (<~10s) unnarrated motion-first unit: title sting, stat/chart/map hit, lower third → `motion-graphics`
7. Explain a GitHub PR → `pr-to-video`
8. Market a website/product/app from a URL → `product-launch-video`
9. Explain a topic with invented visuals, no site capture → `faceless-explainer`
10. Anything else (incl. pieces over ~3 min) → `general-video`

Project state comes first: an existing `BRIEF.md` fixes the workflow; a specific edit to an existing project is just made (no interview); a fresh creation runs the intent interview in `hyperframes/references/intent-interview.md`, which writes `BRIEF.md`.

Domain skills: `hyperframes-core` (composition contract), `hyperframes-animation` (motion, transitions, runtime adapters), `hyperframes-keyframes` (seek-safe GSAP/CSS/WAAPI, camera moves), `hyperframes-creative` (concept, palette, type, narration), `media-use` (images, audio, captions, grades, LUTs), `hyperframes-audio` (fades, ducking, FX, submix), `hyperframes-cli`, `hyperframes-registry` (search a named effect/transition before hand-building), `hyperframes-studio` (project layout), `figma`.

## Quick reference: composition contract

Minimal standalone `index.html` (no `<template>` around a standalone root):

```html
<div id="root" data-composition-id="main" data-start="0"
     data-width="1920" data-height="1080" data-duration="5">
  <section id="title-card" class="clip" data-start="0" data-duration="5">
    <h1 id="title">Hello HyperFrames</h1>
  </section>
</div>
<script>
  const tl = gsap.timeline({ paused: true });
  tl.from("#title", { y: 48, opacity: 0, duration: 0.6, ease: "power3.out" }, 0.2);
  window.__timelines["main"] = tl;
</script>
```

- Root needs `data-composition-id`, `data-width`, `data-height`; `#root` CSS is `width/height: 100%` (never hardcode 1920px/1080px).
- Render length = root `data-duration`, not the timeline length.
- Exactly one paused timeline per composition, registered at `window.__timelines[<composition-id>]` after the build completes. Child timelines auto-nest.
- An element becomes a clip by having `data-start` + a duration. `class="clip"` is a convention; `data-track-index` is only a Studio display lane.
- Sub-compositions (loaded via `data-composition-src`) wrap the root in `<template>`; put their `<style>`/`<script>` inside the template. Give host slot, template and timeline key the same id.

Lint errors to avoid on the first pass:
- CSS `transform` plus a GSAP tween on the same property (`gsap_css_transform_conflict`): set initial state with `fromTo` or use `xPercent`/`yPercent`; center with flex/inset.
- Tweening `autoAlpha`/`visibility`/`display` on a `.clip` (`gsap_animates_clip_element`): animate a child. No scene-exit `visibility:hidden` sets; the runtime hides clips.
- `crossorigin` on `<video>`/`<audio>`; `<audio>` without `id` (renders silent); `<video data-start>` inside another element with `data-start`.
- Named `font-family` without an in-file `@font-face` to a local file.
- Determinism: no wall clocks, unseeded `Math.random`, network or input state; `repeat: -1` only under a finite root duration. No `<br>` in body text.
- A lint error disables the layout/contrast audits, so `check` reporting 0 samples means nothing ran.

## Quick reference: CLI loop

```bash
npx hyperframes init <project>                 # scaffold
npx hyperframes catalog --query "<the effect>"  # search primitives before hand-authoring (query in English)
npx hyperframes add <name>                     # install a registry block
npx hyperframes timeline --json                # what is on the timeline, instead of reading every file
npx hyperframes lint                           # fast check while authoring
npx hyperframes check                          # final gate: lint + runtime + layout + motion + contrast
npx hyperframes snapshot --at <t1>,<t2>        # midpoint frames for sub-compositions
npx hyperframes preview --background           # Studio preview; get approval here
npx hyperframes render --quality looks --output out.mp4   # draft | looks | delivery; only after approval
```

After render: confirm the file is non-empty, `ffprobe` duration matches root `data-duration`, and read the summary's second line (`screenshot` + software GPU on Linux is the slow path). Never render just because checks pass.