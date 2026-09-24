# TezPi Studio Portfolio

Portfolio for Hồ Phú Thịnh (UI/UX Designer), rebuilt from the Figma file
[Portfolio-Design](https://www.figma.com/design/nXTzlY93ii7puYURR5oyEY/Portfolio-Design).

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Motion · Phosphor Icons.
Fonts are self-hosted with Fontsource: **Jersey 10** (display/body) and **Iosevka Charon Mono** (labels, long-form).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all case studies are prerendered)
npm run typecheck
```

## Adding your content

Everything you edit lives in `src/content/`. You never need to touch components.

| What | File | Notes |
| --- | --- | --- |
| Name, bio, contact, experience, education | `site.ts` | Empty strings hide their UI (e.g. social links) |
| Resume | `site.ts` → `resumeUrl` | Put `resume.pdf` in `/public` and set `"/resume.pdf"`. Empty = "Resume" jumps to Experience |
| Portrait on the ID badge | `site.ts` → `portrait` | e.g. `"/images/portrait.jpg"`. Empty = "HT" monogram |
| 3 client + 4 personal projects | `projects.ts` | Replace the writing prompts. Keep `shortName` ≤ 8 characters (vertical rail) |
| Case study sections | `projects.ts` | Client projects use the evidence-led template, personal projects the lighter one. Delete blocks you don't need |
| Images | `public/images/projects/<slug>/` | Set `src` on the matching slot. Empty `src` shows a labelled placeholder frame |
| Playground | `playground.ts` | Empty the array to hide the section and its nav item |
| NDA work | `projects.ts` → `confidential: true` | Hero stays public, body becomes a "Request access" state |

Rules the templates assume: never invent metrics (delete the card or use a
qualitative outcome), and write display text (titles, taglines) in Latin
characters, since Jersey 10 has no Vietnamese glyphs. Names with diacritics
render in Iosevka Charon Mono.

## Intro sequence and toolbar

First visit to `/` plays a short loader ("Opening Portfolio.fig"), then the
curtain lifts and the chrome enters in order: toolbar (bottom), tab bar (top),
hero frame.

- **When it plays**: once per browser session, only on `/`, not for `#hash`
  deep links or `prefers-reduced-motion`. The decision is made before first paint
  in `bootScript` (`src/app/layout.tsx`), so skipped visits never flash the loader.
- **Timing**: progress fills to 90% in `MIN_FILL_S`, then waits for fonts and
  page load, capped at `MAX_WAIT_MS` (`src/components/intro/IntroLoader.tsx`).
  Entrance offsets live in `INTRO_CUES` (`src/components/intro/constants.ts`).
- **Skipping**: any key, click, scroll/swipe, or the "Skip intro" button.
- **Replay while developing**: run `sessionStorage.removeItem("tezpi-intro-seen")`
  in the console and reload.

The toolbar (`src/components/layout/CanvasToolbar.tsx`) is the Figma tool strip
from the original hero, wired as navigation: Move → Intro, Frame → Work,
Text → About, Pen → Playground, Comment → Contact, plus Resume. Keyboard:
one Tab stop, arrow keys/Home/End, and the Figma letter (V, F, T, P, C, R)
while the toolbar has focus.

## Character (master asset)

The hero character is the master model from `design/character/`, rigged and animated
in `src/components/character/`.

- **Traced, not redrawn**: head, hair, face, glasses, neck, shirt top, sleeves, straps
  and backpack are vector paths traced from `master-model.webp` into `master-paths.ts`
  (`npm run trace:character`; never hand-edit that file). Eyes are the master's exact
  ellipses, separated so they can blink and follow the pointer.
- **Drawn to match** (the master bust ends at the sleeves): forearms and hands, lower
  shirt, baggy pants, sneakers. Same palette (`#1959BB`, `#0F0F11`, white) and line
  weight. Locked parameters live in `character.config.ts`.
- **Rig**: root, legs (hip, knee, shoe), upper body (waist), head (neck), forearms
  (elbow). Animations only move these joints and swap expression/hand states.
- **Actions** (`actions.ts`): idle (breathing, blink, sway), wave, point, talk, jump,
  walk, run, sit, sleep/wake, greet. The toolbar under the artboard triggers them.
- **On the page**: greets after the intro, eyes and head follow the pointer, waves on
  hover, jumps on click, dozes off after 24s without activity. Any element with
  `data-character-cue="Text"` makes him point at it and say the text (the hero CTAs use it).
- Reduced motion: loops off, poses change instantly.

## Cursor and scrollbar (mouse devices)

- **Multiplayer cursor** (`src/components/cursor/CanvasCursor.tsx`): the visitor's
  pointer is a Figma cursor tagged "You", next to the designer's "HoPhuThinh"
  cursor in the hero. The arrow tracks the pointer exactly; the tag trails and
  changes on context. Give any element `data-cursor="Label"` to set its tag
  text (project cards, email, ID card already have one). Touch devices keep
  native behavior.
- **Brand scrollbar** (`src/components/layout/CanvasScrollbar.tsx`): replaces the
  OS scrollbar, tied to scroll progress. Drag the thumb, click the track, or
  click a section marker. Markers come from `data-scroll-marker="Label"` on
  sections. Touch devices and inner scrollers keep native scrollbars in brand
  colors.

## Design system

Tokens are in `src/app/globals.css` (`@theme`), taken from the Figma "Design System" board:

| Token | Value | Use |
| --- | --- | --- |
| `cobalt` | `#3457DB` | Brand surface, primary buttons |
| `cobalt-deep` | `#192F81` | Hard shadow, footer bar, text on sun |
| `cream` | `#FFF5E7` | Page surface (light) |
| `sun` | `#FECD50` | Registration marks, selection frame, CTA on cobalt |
| `amber` | `#FFB700` | Marker highlight, index chips |
| `putty` / `putty-deep` | `#898478` / `#5E5A51` | Placeholders / tag fills and muted text |
| `ink` | `#0B0B0C` | Text |

Radius scale 2 / 4 / 8 / pill. Accessibility adjustments to the original palette:
sun-on-putty tags (2.5:1) now use `putty-deep` (4.6:1); small text on sun uses
`cobalt-deep` (8:1) instead of cobalt (4:1); small labels on cobalt use cream (5.5:1).
Light and dark themes follow the OS, with a manual toggle in the header.
