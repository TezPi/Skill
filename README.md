# Portfolio.fig

TezPi's portfolio. It opens like a Figma file: a live, resizable frame around "Portfolio", with the Figma toolbar, layers, rulers and design panel around it. The visual language is a three-color comic print (halftone, ink outlines, hard offset shadows).

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · GSAP (ScrollTrigger, Flip) · Phosphor icons · Be Vietnam Pro

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck
```

Copy `.env.example` to `.env.local` to turn on the contact form and the password-protected case study.

## Make it yours

All content lives in `content/`. Anything written as `[Insert ...]` renders as a dashed "missing property" slot, so unfinished facts stay visible instead of invented. Search for `[Insert` to find each one.

| File | What to edit |
| --- | --- |
| `content/profile.ts` | Name, intro, bio, email, links, experience, education, portrait, resume PDF |
| `content/projects.ts` | Case studies. `portfolio-fig` is real. `ai-copilot` and `token-system` are **sample structures**, so replace or delete them. `private-project` is the NDA slot. |
| `public/work/` | Project covers. The sample covers use picsum.photos until you add real shots. |

## The hero canvas

| Tool | Key | What it does |
| --- | --- | --- |
| Move | V | Drag any corner or edge. The type reflows through container query units. Shift keeps the ratio. Arrow keys resize, Home resets. |
| Frame | F | Desktop, Tablet and Mobile presets. The Mobile preset stacks the word. |
| Pen | P | Draw on the canvas. Strokes fade after two seconds. |
| Text | T | Retype the headline. |
| Hand | H | Pan the canvas. It springs back home when you let go. |
| Comments | C | Show every comment at once. |

Shortcuts only fire while the hero is in view and focus is on the page or inside the hero, never while you're typing in a field.

The intro loader plays once per session, only on a hard load of `/`, and never with reduced motion. It holds at 84% until fonts are ready (up to 1.2s), can be skipped with the button or Esc, and hands its drawn outline to the hero frame.

## Design system

- **Color:** `#DCDCDC` paper, `#2D5FFF` signal, `#161616` ink. Tailwind's default palette is removed (`--color-*: initial`), so no other hue can slip in. Signal on paper measures 3.65:1, so blue is only used for strokes, shadows and large text.
- **Shape:** structure is sharp (radius 0). Only voices are round: speech bubbles, comment pins and cursor labels.
- **Comic devices:** halftone is texture, the ink outline is structure, the blue offset shadow is feedback.
- **Motion:** UI uses `cubic-bezier(0.16, 1, 0.3, 1)` and comic pops use `back.out`. Only transform and opacity animate, and everything respects `prefers-reduced-motion`.
- **Theme:** light and dark follow the system, with a manual toggle.

Tokens and component classes are in `app/globals.css`.

## Structure

```
app/                 routes: /, /work, /work/[slug], /work/private/[slug], /about, /resume, /contact, 404
app/api/contact      validates, then forwards to CONTACT_WEBHOOK_URL
app/api/unlock       checks PRIVATE_CASE_PASSWORD, sets a signed httpOnly cookie
components/hero      FigmaHero, IntroLoader, ResizableFrame, FigmaToolbar, Panels
components/home      Statement, FeaturedWork, Expertise, Principles, ToolsMarquee, ExperiencePreview, ContactCta
components/case      CaseStudy, CaseBlocks, CaseNav, ProtectedGate
content/             profile, projects (server only), taxonomy (safe to import in client code)
```

Protected case study content is only imported by server components. Client code imports `content/taxonomy.ts`, so NDA text never ships in a browser bundle.
