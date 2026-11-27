---
name: code-remotion
description: "Official Remotion Agent Skills 4.0.535 in one hub: create a Remotion video, React markup, timing props, transitions, effects, color correction/LUTs, captions, maps (Mapbox/MapLibre/MapTiler/Cesium), Mediabunny multimedia, Studio preview, Studio interactivity, rendering, SaaS/Player/Lambda, upgrades, plus an offline docs mirror. Use whenever the user mentions Remotion, useCurrentFrame, Composition, Sequence, TransitionSeries, Remotion Studio or Lambda, or wants a React-based programmatic video. Includes the preserved 4.0.533 rules delta (formerly remotion-latest-rules). Load senior-editor (Layer 0) then sfc-super-motion-v1 first (Rule of Six editorial, Shape & Motion Graph tokens, Motion Text blueprints)."
version: '4.0.535'
---

# Remotion hub (SFT Super Motion Studio V2)

Upstream: `remotion-dev/remotion` → `packages/skills/skills` @ 4.0.535, kept verbatim. Each former skill now lives in its own folder as `REFERENCE.md`; load only the one the router below points to. This version supersedes the old `code-remotion-rules` delta (4.0.533): **from 4.0.535 Studio premounts timed items 2 s by default**, so do not add `premountFor` everywhere — add it only when an item needs a longer or explicit premount.

SFT additions (not upstream):
- `remotion-markup/new-markup.md` — put timing on content components, `<Track>`, `Interactive.create({layout:'absolute-fill'})` (from Remotion's internal agent skills).
- `remotion-interactivity/studio-interactivity-best-practices.md`, `make-component-interactive.md` — the docs pages the internal skill links to.
- `legacy/remotion-latest-rules.md` — the former `remotion-latest-rules` skill, verbatim; status per rule in `legacy/README.md`. One rule exists only there and always applies: **the `effects` array must be inline** (hardcoded parameters, no computed or conditional arrays; render separate elements instead).
- `remotion-docs/offline/` — full docs mirror (1,200+ pages, 4.0.535). Grep it first: `grep -rl "<api>" remotion-docs/offline`. Fall back to the online workflow in `remotion-docs/REFERENCE.md` only for APIs newer than 4.0.535.

Before building, also load `code-motion-graphics` for direction laws, the spec format and the QA gate; they apply on Remotion too. For alpha masters (ProRes 4444 → WebM VP9 / HEVC alpha) see `media-ffmpeg`.


## Preserve user changes

Users may make edits in the code outside of the conversation.

If you detect a surprising change made in the meanwhile, don't overwrite it, assume it was intentional or ask for confirmation.

## Creating a video

If the user asks to make, create, or build a new video or composition, load [Create a new Remotion video](./remotion-create/REFERENCE.md), whether or not a Remotion project already exists.

## New project setup

If no Remotion project currently exists, load [Create a new Remotion project](./remotion-create/REFERENCE.md)

## React Markup Best Practices

If you are writing Remotion React Markup, load [Remotion Markup Best Practices](./remotion-markup/REFERENCE.md)

## Maps

For static maps, animated routes and markers, geographic explainers, Mapbox, MapLibre, MapTiler, GeoJSON, or 3D geographic flyovers, load [Remotion Maps](./remotion-maps/REFERENCE.md).

## Multimedia

For achieving multimedia tasks in the browser, such as trimming, cropping videos, or getting metadata from them, load [Remotion Multimedia](./remotion-multimedia/REFERENCE.md)

## Improving Interactivity

By structuring the Remotion markup well, we can allow users to interactively change things in the Studio and write back to code. If relevant: [Interactivity Best Practices](./remotion-interactivity/REFERENCE.md)

## Open the preview

If the user asks to "make" a video, "create" a video, etc.
Don't render the video by default unless they are very explicit. They want to instead see an interactive preview.
As soon as the project can run, start Studio and open the preview in the browser before building or editing the composition. Keep it open while you work so the user can watch progress and steer.

### If you are using Cursor

Run Studio without `--no-open` so it opens the browser automatically:

```bash
npx remotion studio
```

### If you are using another agent client with an in-app browser

You can use the command above to let Studio open the browser, or run:

```bash
npx remotion studio --no-open
```

This will start a long-running process and print the server URL for the preview.  
If the server is already started, it will print the URL.
If you use `--no-open`, open the exact printed URL in the in-app browser and verify that Studio loads. Once a composition exists, verify that its video preview loads. If you cannot open it there, run Studio without `--no-open`.
You can visit a specific composition by navigating to `/[composition-id]`, for example `http://localhost:3000/MapAnimation`.

:::note
The Studio supports WebMCP tools.
:::

### If you do not have an in-app browser

This will open the Studio in the browser or refocus it if it is already open.

```bash
npx remotion studio
```

### More options

To launch a project in Remotion Studio, open its exact local URL, or configure Studio CLI flags, load [Remotion Studio](./remotion-studio/REFERENCE.md).

## Render the video

Only render if the user is very explicit in asking for it.  
E.g. "Render the video", "Export", "Give me the MP4".

The preview also has a more intuitive rendering interface, so consider using it instead of the command line for rendering.

```
npx remotion render
```

For more options, see [Rendering](./remotion-render/REFERENCE.md).

For advanced rendering beyond simple `npx remotion render`, see: [Rendering Best Practices](./remotion-render/REFERENCE.md)

## Captions

When working with Captions, load [Remotion Captions](./remotion-captions/REFERENCE.md).

## Creating a SaaS, automation or application

Use the [Remotion SaaS skill](./remotion-saas/REFERENCE.md) for knowledge about Remotion-powered SaaS apps, such as `<Player>`, rendering on Lambda, Vercel, Cloudflare, via Express.js, client-side rendering, or for finding the right SaaS template.

## Looking up Remotion APIs and documentation

To find and read current Remotion documentation, load [Remotion Docs](./remotion-docs/REFERENCE.md).

## Upgrading

To upgrade Remotion, related packages, compatible Mediabunny packages, and installed Remotion Agent Skills, load [Remotion Upgrade](./remotion-upgrade/REFERENCE.md).
