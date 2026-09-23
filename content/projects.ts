/**
 * Case studies.
 *
 * "portfolio-fig" is real: it documents this site.
 * "ai-copilot" and "token-system" are SAMPLE structures (sample: true). Their
 * framing shows how a case study should read; every fact (client, team,
 * research, metrics) is an [Insert ...] slot. Replace or delete them.
 * "private-project" is an NDA slot behind a password (see .env.example).
 */

import type { CategoryId } from "./taxonomy";

// Server-side data. Client components import from ./taxonomy only, so
// protected case study content never ships in a browser bundle.
export { categories, projectHref, type CategoryId } from "./taxonomy";

export type Block =
  | { kind: "text"; body: string }
  | { kind: "insight"; label: string; body: string }
  | { kind: "flow"; label?: string; steps: string[] }
  | { kind: "pairs"; items: { term: string; detail: string }[] }
  | { kind: "compare"; before: string; after: string }
  | { kind: "tokens" }
  | { kind: "metrics"; note: string; items: { label: string; value: string }[] }
  | { kind: "list"; items: string[] };

export type Section = { id: string; title: string; blocks: Block[] };

export type Project = {
  slug: string;
  name: string;
  /** Product + challenge. Shown as the case study H1. */
  title: string;
  type: string;
  summary: string;
  role: string;
  scope: string[];
  year: string;
  categories: CategoryId[];
  cover: { src: string; alt: string } | null;
  sample?: boolean;
  protected?: boolean;
  meta: {
    timeline: string;
    team: string[];
    platform: string;
    responsibilities: string[];
  };
  scan: { problem: string; solution: string; impact: string };
  sections: Section[];
};

export const projects: Project[] = [
  {
    slug: "portfolio-fig",
    name: "Portfolio.fig",
    title: "Designing a portfolio as a product, not a gallery",
    type: "Personal site, web",
    summary:
      "A portfolio that opens like a Figma file: a live resizable frame, a three-color comic system, and case studies built for scanning and deep reading.",
    role: "Design direction, UX structure, visual system",
    scope: ["UX", "UI", "Interaction", "Design system"],
    year: "2026",
    categories: ["interaction", "system", "web"],
    cover: { src: "/work/portfolio-fig.jpg", alt: "The Portfolio.fig hero: a resizable frame on a Figma canvas with toolbar and panels." },
    meta: {
      timeline: "2026",
      team: ["TezPi, design direction", "AI coding pair, build"],
      platform: "Web, 375 to 1440 px",
      responsibilities: ["Information architecture", "Visual system", "Interaction design", "Build review"],
    },
    scan: {
      problem: "Recruiters scan a portfolio in seconds. Design leads read it closely. Most portfolios serve neither.",
      solution: "One site that answers who, what and how to reach me on the first screen, then rewards a deep read.",
      impact: "Not launched yet. The tracking plan is defined below.",
    },
    sections: [
      {
        id: "context",
        title: "Who reads this",
        blocks: [
          {
            kind: "text",
            body: "Three readers open a designer portfolio, each with a different job. These flows come from my portfolio playbook, not from user interviews.",
          },
          {
            kind: "pairs",
            items: [
              { term: "Recruiter", detail: "Scans identity, role, best work and resume, usually without reading a paragraph." },
              { term: "Hiring manager", detail: "Reads how a problem was framed and why each decision was made." },
              { term: "Design lead", detail: "Inspects grid, type, states, motion and consistency." },
            ],
          },
        ],
      },
      {
        id: "problem",
        title: "The problem",
        blocks: [
          { kind: "text", body: "A gallery shows output and hides thinking. It also makes the recruiter hunt for the resume." },
          { kind: "insight", label: "Insight", body: "The same page has to support a 10 second scan and a 10 minute read." },
        ],
      },
      {
        id: "structure",
        title: "Structure first",
        blocks: [
          { kind: "flow", label: "Primary path", steps: ["Home", "Featured project", "Case study", "Resume", "Contact"] },
          {
            kind: "text",
            body: "Navigation stays at four items: Work, About, Resume, Contact. The Layers panel in the hero repeats them as Figma pages, so a recruiter can jump straight to the resume from the first screen.",
          },
        ],
      },
      {
        id: "decisions",
        title: "Key decisions",
        blocks: [
          {
            kind: "pairs",
            items: [
              {
                term: "The first screen is a Figma file",
                detail: "The frame around “Portfolio” is live. Drag a corner and the type reflows through container units. It shows responsive thinking in the first interaction instead of claiming it.",
              },
              {
                term: "Three colors, locked",
                detail: "Paper #DCDCDC, Signal #2D5FFF, Ink #161616. Blue only carries interaction and emphasis, so it always means something.",
              },
              {
                term: "Comic language as a system",
                detail: "Halftone is texture, the ink outline is structure, the blue offset shadow is feedback. Each device has one job.",
              },
              {
                term: "The intro has a budget",
                detail: "The loader masks font loading, finishes in about two seconds, can be skipped, and plays once per session.",
              },
            ],
          },
          {
            kind: "compare",
            before: "Gallery grid. Role, scope and year hidden behind hover.",
            after: "Comic panel bento. Role, scope and year are always visible in the caption box.",
          },
        ],
      },
      {
        id: "system",
        title: "Design system",
        blocks: [
          { kind: "tokens" },
          {
            kind: "text",
            body: "Structure is sharp, radius zero. Only voices are round: speech bubbles, comment pins and cursor labels.",
          },
        ],
      },
      {
        id: "states",
        title: "States and edge cases",
        blocks: [
          {
            kind: "list",
            items: [
              "Loading: intro loader, halftone image placeholders.",
              "Empty: the Work filter explains what happened and offers a reset.",
              "Error: the contact form keeps your text and offers a retry; images fall back to a titled panel.",
              "Success: the contact form confirms and points to the next action.",
              "Protected: NDA case studies unlock with a password checked on the server.",
              "404 and reduced motion: both handled.",
            ],
          },
        ],
      },
      {
        id: "accessibility",
        title: "Accessibility",
        blocks: [
          {
            kind: "text",
            body: "Signal on Paper measures 3.65:1, so blue never carries small text. Ink on Paper measures 13.2:1. Every canvas tool has a keyboard shortcut, and the frame resizes with arrow keys.",
          },
        ],
      },
      {
        id: "impact",
        title: "Impact",
        blocks: [
          {
            kind: "metrics",
            note: "Pre-launch. These are the signals I will track, not results.",
            items: [
              { label: "Project click-through", value: "[Insert after launch]" },
              { label: "Case study completion", value: "[Insert after launch]" },
              { label: "Resume clicks", value: "[Insert after launch]" },
              { label: "Contact submissions", value: "[Insert after launch]" },
            ],
          },
        ],
      },
      {
        id: "reflection",
        title: "Reflection",
        blocks: [
          {
            kind: "list",
            items: [
              "Run a five second test on the first screen with recruiters.",
              "Check whether the canvas tools pull attention away from View work.",
              "Measure how often the intro is skipped.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "ai-copilot",
    name: "AI Copilot",
    title: "Designing an AI copilot people can correct",
    type: "AI product, B2B web app",
    summary: "Sample structure: an assistant that shows its sources, stays editable and always offers undo.",
    role: "[Insert your role]",
    scope: ["AI interaction", "UX", "UI", "Prototype"],
    year: "[Insert year]",
    categories: ["ai", "web"],
    cover: { src: "https://picsum.photos/seed/tezpi-ai-copilot/1600/1000", alt: "Sample cover for the AI copilot case study." },
    sample: true,
    meta: {
      timeline: "[Insert timeline]",
      team: ["[Insert team, e.g. 1 PM, 4 engineers]"],
      platform: "Web app",
      responsibilities: ["AI interaction", "User flows", "UI", "Prototype"],
    },
    scan: {
      problem: "People stop trusting an AI suggestion the first time it is confidently wrong and hard to fix.",
      solution: "Suggestions arrive as editable drafts with visible context, one-click undo and clear failure states.",
      impact: "[Insert measured outcome]",
    },
    sections: [
      {
        id: "context",
        title: "Context",
        blocks: [{ kind: "text", body: "[Insert product, company and user context]" }],
      },
      {
        id: "research",
        title: "Research",
        blocks: [
          {
            kind: "pairs",
            items: [
              { term: "Participants", detail: "[Insert participants]" },
              { term: "Method", detail: "[Insert method]" },
              { term: "Key finding", detail: "[Insert research result]" },
            ],
          },
          { kind: "insight", label: "Working hypothesis", body: "Trust grows from control, not from accuracy alone." },
        ],
      },
      {
        id: "flow",
        title: "AI states",
        blocks: [
          { kind: "flow", label: "Every suggestion moves through", steps: ["Trigger", "Processing", "Result", "Edit", "Accept or reject", "Feedback"] },
          { kind: "text", body: "Timeout, no result and rate limit each get their own state with a retry, so a failure never looks like a frozen screen." },
        ],
      },
      {
        id: "decisions",
        title: "Key decisions",
        blocks: [
          {
            kind: "pairs",
            items: [
              { term: "Show the why", detail: "Every suggestion links to the context it used." },
              { term: "Drafts, not actions", detail: "Suggestions land as editable drafts, never as sent messages." },
              { term: "Undo everywhere", detail: "Accepting is reversible for [Insert undo window]." },
              { term: "Fail visibly", detail: "Processing shows progress, so users never think the system stopped." },
            ],
          },
        ],
      },
      {
        id: "impact",
        title: "Impact",
        blocks: [
          {
            kind: "metrics",
            note: "Replace with measured results, or label outcomes as qualitative.",
            items: [
              { label: "Suggestion acceptance", value: "[Insert actual metric]" },
              { label: "Edits before send", value: "[Insert actual metric]" },
              { label: "Task time", value: "[Insert actual metric]" },
            ],
          },
        ],
      },
      {
        id: "reflection",
        title: "Reflection",
        blocks: [{ kind: "text", body: "[Insert what worked, what did not, and what you would test next]" }],
      },
    ],
  },
  {
    slug: "token-system",
    name: "Token System",
    title: "Building a token-first design system for web and mobile",
    type: "Design system",
    summary: "Sample structure: one token pipeline from Figma variables to code, with components that only consume tokens.",
    role: "[Insert your role]",
    scope: ["Design system", "Tokens", "Components", "Docs"],
    year: "[Insert year]",
    categories: ["system", "web", "mobile"],
    cover: { src: "https://picsum.photos/seed/tezpi-token-system/1600/1000", alt: "Sample cover for the token system case study." },
    sample: true,
    meta: {
      timeline: "[Insert timeline]",
      team: ["[Insert team]"],
      platform: "Web and mobile",
      responsibilities: ["Token architecture", "Component library", "Documentation", "Adoption"],
    },
    scan: {
      problem: "Design and code drifted apart. Each team rebuilt the same components with slightly different values.",
      solution: "Three token tiers exported from Figma variables, and components that read nothing else.",
      impact: "[Insert measured outcome]",
    },
    sections: [
      {
        id: "context",
        title: "Context",
        blocks: [{ kind: "text", body: "[Insert product, company and team context]" }],
      },
      {
        id: "structure",
        title: "Token pipeline",
        blocks: [
          { kind: "flow", label: "One source of truth", steps: ["Figma variables", "Token JSON", "Build step", "CSS variables", "Components"] },
          { kind: "text", body: "Primitive tokens hold raw values, semantic tokens hold intent, component tokens hold exceptions. Light and dark are variable modes, not duplicate files." },
        ],
      },
      {
        id: "decisions",
        title: "Key decisions",
        blocks: [
          {
            kind: "pairs",
            items: [
              { term: "Three tiers", detail: "Primitive, semantic, component. Components never read primitives." },
              { term: "Modes, not copies", detail: "Themes switch variable modes instead of forking components." },
              { term: "States as variants", detail: "Hover, focus, pressed, disabled, loading and error ship with every component." },
            ],
          },
        ],
      },
      {
        id: "impact",
        title: "Impact",
        blocks: [
          {
            kind: "metrics",
            note: "Replace with measured results, or label outcomes as qualitative.",
            items: [
              { label: "Components migrated", value: "[Insert actual metric]" },
              { label: "Hard-coded values removed", value: "[Insert actual metric]" },
              { label: "Design to dev handoff time", value: "[Insert actual metric]" },
            ],
          },
        ],
      },
      {
        id: "reflection",
        title: "Reflection",
        blocks: [{ kind: "text", body: "[Insert what worked, what did not, and what you would change]" }],
      },
    ],
  },
  {
    slug: "private-project",
    name: "Private project",
    title: "Private project under NDA",
    type: "[Insert product type]",
    summary: "Available with a password. Ask me for access and I will share it.",
    role: "[Insert your role]",
    scope: ["NDA"],
    year: "[Insert year]",
    categories: [],
    cover: null,
    protected: true,
    meta: {
      timeline: "[Insert timeline]",
      team: ["[Insert team]"],
      platform: "[Insert platform]",
      responsibilities: ["[Insert responsibilities]"],
    },
    scan: {
      problem: "[Insert problem]",
      solution: "[Insert solution]",
      impact: "[Insert outcome]",
    },
    sections: [
      {
        id: "overview",
        title: "Overview",
        blocks: [{ kind: "text", body: "[Insert case study. Anonymize data and recreate screens where needed.]" }],
      },
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);


export const getNextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};

/** Card-safe data only. Protected case study content never reaches the client. */
export type ProjectCard = Pick<
  Project,
  "slug" | "name" | "title" | "type" | "summary" | "role" | "scope" | "year" | "categories" | "cover" | "sample" | "protected"
>;

export const toCard = ({ slug, name, title, type, summary, role, scope, year, categories, cover, sample, protected: isProtected }: Project): ProjectCard => ({
  slug,
  name,
  title,
  type,
  summary,
  role,
  scope,
  year,
  categories,
  cover,
  sample,
  protected: isProtected,
});
