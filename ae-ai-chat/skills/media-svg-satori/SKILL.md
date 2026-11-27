---
name: media-svg-satori
description: "SVG asset pipeline for motion: SVGO 4 optimization with an animation-safe config (keep IDs, groups, hidden/zero-opacity start states, shapes for MorphSVG/DrawSVG/anime.js), Figma/Illustrator SVG cleanup, plus Satori (JSX/HTML+CSS to SVG, flex/grid layout, fonts incl. Vietnamese, emoji) for OG images, thumbnails, title cards and server-side frame rendering to PNG. Use when the user wants to optimize or clean SVGs, prepare an SVG for animation, asks why an SVG animation broke after optimizing, generates social/OG images or video thumbnails from JSX, or renders text cards without a browser."
---

# SVG pipeline (SVGO + Satori)

Sources: `svg/svgo` 4.1 docs (`references/svgo/`: usage, `03-preset-default.mdx`, one page per plugin in `04-plugins/`) and `vercel/satori` README at repo HEAD (`references/satori/README.md`, full CSS support table).

## SVGO: animation-safe optimization

The default preset is built for static icons. It silently breaks animation: `cleanupIds` renames/removes the IDs your GSAP/CSS/anime.js targets use, `collapseGroups` / `moveElemsAttrsToGroup` / `moveGroupAttrsToElems` destroy the groups and transform origins you animate, `mergePaths` fuses separately-animated paths, `removeHiddenElems` deletes start-state elements (`opacity="0"`, `display:none`, `r="0"`, `width="0"`), `convertShapeToPath` turns circles/rects you animate by `r`/`width` into paths, and `inlineStyles` strips the class selectors your CSS keyframes need.

`svgo.config.mjs` for anything that will move:

```js
export default {
  multipass: true,
  floatPrecision: 2,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: false,
          collapseGroups: false,
          moveElemsAttrsToGroup: false,
          moveGroupAttrsToElems: false,
          mergePaths: false,
          removeHiddenElems: false,
          convertShapeToPath: false,
          inlineStyles: false,
          removeEmptyContainers: false,     // keep empty <g> filled at runtime
          removeUselessStrokeAndFill: false, // keep stroke you will animate in (DrawSVG)
        },
      },
    },
  ],
};
```

Tested on SVGO 4.1 with a logo SVG (`r="0"` dot, `width="0"` bar, `opacity="0"` line, two sibling paths, a CSS class, an empty group): `preset-default` deleted the three start-state elements, merged the paths, dropped every ID, the class and the group; this config kept all of them. Several SVGs inlined on one page with clashing IDs: add `{ name: 'prefixIds', params: { prefix: 'sft' } }`, but it rewrites **every** ID and class (`#dot` → `#sft__dot`), so update animation selectors to match.

`npx svgo -i in.svg -o out.svg --config svgo.config.mjs` (folder: `-f src -o dist`). Static icons/illustrations that never animate: plain `preset-default` is fine.

Before animating an exported SVG (Figma/Illustrator):
- Name layers in the design tool so IDs survive export; flatten nothing you will move separately.
- Morphing (MorphSVG, anime.js `morphTo`, Remotion `@remotion/paths` `interpolatePath`): both shapes as single `<path>`s, similar point count and same winding; keep `convertPathData` on (it normalizes commands) but check visually.
- Line draw (DrawSVG, anime.js `createDrawable`): needs strokes, not outlined fills. "Outline stroke" in the design tool kills it.
- Keep `viewBox` (SVGO 4 no longer removes it by default); set `width/height` via CSS.
- Accessibility: keep `<title>` / `aria-*` on meaningful graphics (`removeTitle` is not in preset-default; don't add it).

## Satori: JSX → SVG (→ PNG)

```tsx
import satori from 'satori';
import { readFile } from 'node:fs/promises';
const font = await readFile('BeVietnamPro-Bold.ttf');   // TTF/OTF/WOFF (WOFF2 at HEAD); load once, reuse
const svg = await satori(
  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', padding: 72,
                background: '#0b0b0c', color: '#fff', fontFamily: 'Be Vietnam Pro', fontSize: 88, lineHeight: 1.2 }}>
    Nếp Nhà — kết nối ba thế hệ
  </div>,
  { width: 1200, height: 630, fonts: [{ name: 'Be Vietnam Pro', data: font, weight: 700, style: 'normal' }] },
);
// PNG: sharp(Buffer.from(svg)).png()  or  @resvg/resvg-js
```

- Pure, stateless JSX only (no hooks). Layout engine: Taffy (flex, grid, block) at repo HEAD; older npm releases are flexbox-only and reject WOFF2, so check the installed version against `references/satori/README.md` (CSS table) before using grid.
- Every rendered glyph needs a supplied font; Vietnamese diacritics need a font that contains them. Missing scripts/emoji: `loadAdditionalAsset(code, segment)` or `graphemeImages`.
- Text becomes `<path>` by default (`embedFont: true`), so the SVG is portable; set `embedFont: false` for editable `<text>`.
- Next.js OG images: `next/og` `ImageResponse` wraps Satori with the same rules.

### Satori as a frame renderer (no browser)

Deterministic title cards / data cards for video: compute styles from `t` in plain JS (springs/eases from `code-motion-graphics`), render each frame `satori(view(t))` → PNG (sharp/resvg) → `media-ffmpeg` image sequence encode. Good for server-side batch personalization (names, prices, Vietnamese copy). Limits: no CSS animations, filters/blend support is partial (check the table), each frame is a full layout pass — fine for 1080p cards, slow for long films (use a browser engine there).
