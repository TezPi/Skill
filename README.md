# Hồ Phú Thịnh — Portfolio

Personal portfolio for a Product Designer working on AI workforce products (Agent-X · TezPi Studio).
Built as a product rather than a gallery: it's designed for a recruiter who scans, a hiring manager who reads, and a design lead who inspects.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion
**Type:** Be Vietnam Pro · **Colour:** `#161616` ink · `#DCDCDC` paper · `#2D5FFF` signal

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint && npm run typecheck
```

---

## Design idea: colour speaks once

The whole site runs on a rule from the Agent-X design system: **blue appears only where something needs attention**. That means the one action, the live status dot, or "you are here". Everything else is ink and paper.

| Signature | Where | What it shows |
|---|---|---|
| **Signal field** | Home hero | A canvas of neutral dots with exactly one blue signal. It ripples outward on load and works as a soft spotlight under the pointer. |
| **Name reveal** | Home hero | 0.07s per character with a pause between words, then the blue period pops on a spring. This is the Motion Grammar case study, running live. |
| **Border runner** | Primary CTAs | A light segment runs around the button edge and bends at the corners. It reads the element's real radius (`radius − inset`). |
| **Dương bản / Âm bản** | Home "How I decide", About | The page switches to paper for the sections about judgement. The principle cards flip between real before/after copy. |
| **Rolling odometer** | Home "Receipts" | Audit numbers roll from *before* to *after*. The digit columns travel different distances but land together. |

## Information architecture

```
/                 Hero → Selected work → How I decide → Receipts → Capabilities → Experience → Contact
/work             All case studies · category filters with result counts
/work/[slug]      Hero → 30-second summary → sticky section nav + deep read → next project
/about            Intro · How I work (AI-assisted, human-approved) · Beliefs · Capabilities · Experience
/resume           The same content as the site, laid out to print cleanly (Print → Save as PDF)
/contact          Validated form · copy-email · local time
404               Bilingual, with a route back to home and to work
```

## Project structure

```
src/
  app/                    routes, layout (fonts, metadata), globals.css (tokens)
    api/contact/          POST handler: validates, forwards to a webhook
  content/                ← all copy and data. Edit here, not in components
    profile.ts            identity, experience, capabilities, principles, audit stats
    projects.ts           case studies as typed section blocks
    types.ts              content model
  components/
    home/ case-study/ work/ contact/ resume/ specimens/ layout/ ui/
  hooks/useContactForm.ts form state + submission, kept out of the UI
  lib/                    motion tokens, contact validation (shared client/server)
```

Case studies are **data**. Each one is a list of typed blocks (`text`, `insight`, `beforeAfter`, `decisions`, `flow`, `table`, `stats`, `list`, `playground`, `reflection`), and `SectionRenderer` maps each block to a component. To add a project, add an object to `projects.ts`. No new component needed.

## Tokens

Defined once in `src/app/globals.css` with Tailwind 4 `@theme`:

- **Primitives:** `ink`, `paper`, `signal`, plus `on-signal` (white). White is only used for text on blue, which needs 5:1 for AA.
- **Semantic roles:** `bg`, `bg-raised`, `fg`, `fg-mid`, `fg-lo`, `line`, `line-strong`. These resolve per surface (`.surface-ink` / `.surface-paper`), so the same component works on either.
- **Contrast (checked):** paper on ink 13.2:1 · `fg-lo` floor 5.4:1 · signal on ink 3.6:1. Blue is therefore never used for small text, only for large type, dots, rules and fills.
- **Radius grammar:** chip 6 · control 10 · panel 14 · sheet 28.
- **Motion:** `ease-expo` = `cubic-bezier(0.16, 1, 0.3, 1)` on every entry. Four verbs: rise, fade, draw, pop.

## Accessibility & performance

- Semantic landmarks, skip link, one `h1` per page, and `lang="vi"` on Vietnamese strings.
- Visible focus rings, a focus-trapped mobile menu (Esc closes and returns focus), and ≥44px targets.
- `prefers-reduced-motion` is respected. Looping motion (rotator, signal field, border runner) also has a **Pause motion** toggle (WCAG 2.2.2), and the choice persists.
- Animations use transforms and opacity. The canvas caps DPR at 2 and pauses off-screen, in hidden tabs and when motion is paused.
- Fonts are self-hosted by `next/font`. Only the weights in use are shipped (300/400/500/600), and the italic is a separate, non-preloaded file.
- Every route except `/api/contact` is statically prerendered.

## Contact form

The form posts to `/api/contact`, which validates with the same rules as the client and forwards JSON to `CONTACT_WEBHOOK_URL` (a Slack/Discord webhook, Zapier, or an email relay).
If no webhook is set, the visitor gets an honest fallback: their message opens pre-filled in their email app, so nothing is lost. A honeypot field filters bots. See `.env.example`.

## Deploy

Works on Vercel with no extra configuration. Set `NEXT_PUBLIC_SITE_URL`, and optionally `CONTACT_WEBHOOK_URL`.

---

## Before you publish: fill the placeholders

Anything written as `[in brackets]` in `src/content` renders as a **dashed chip**, so it can't ship unnoticed. Nothing was invented. Where a fact wasn't on record, it was left as a placeholder.

- [ ] **Name.** "Hồ Phú Thịnh" was inferred from the email address. Confirm the diacritics in `profile.ts`.
- [ ] **Experience.** Start year for the Agent-X role, plus earlier roles (`experience` in `profile.ts`).
- [ ] **LinkedIn URL** (`socials`) and optionally a **résumé PDF** (`resumePdf`; drop the file in `/public`).
- [ ] **Case studies.** Team and timeline for each project, usability-test results, and shipped outcome metrics.
- [ ] **Portrait photo** on `/about` (it currently shows a monogram).
- [ ] **English level** on `/resume`.
- [ ] **NDA check.** Confirm that the Agent-X details (IA counts, token numbers, copy examples) are cleared for public use.
- [ ] **Phone number** is shown on `/resume` and `/contact`. Set `phone: null` to hide it.
