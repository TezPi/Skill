/**
 * Single source of truth for who you are.
 *
 * Anything wrapped in [Insert ...] renders as a dashed "missing property" slot,
 * so unfinished facts are visible instead of invented. Search the repo for
 * "[Insert" to find every one.
 */

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  summary: string;
  relatedProject?: string;
};

export type Expertise = {
  id: string;
  title: string;
  blurb: string;
  skills: string[];
};

export type Principle = {
  id: string;
  title: string;
  body: string;
  visual: "loop" | "tokens" | "easing" | "states";
};

export const profile = {
  handle: "TezPi",
  /** Shown in the hero intro and About page. Replace with your full name if you prefer. */
  name: "TezPi",
  initials: "TP",
  role: "Product Designer",
  /** Hero subtext. Keep it under 20 words. */
  intro:
    "a product designer shaping AI products and design systems where visual craft meets engineering logic.",
  bio: [
    "I work where interface, behavior and code overlap. I start from the habit loop and the friction point, not the screen.",
    "Then I design the system: tokens, components and every state, so what ships matches the file.",
  ],
  /** Leave empty to hide. The contact form works without it. */
  email: "",
  /** Optional PDF in /public, e.g. "/resume.pdf". Without it, the Resume page offers Save as PDF. */
  resumeUrl: "",
  /** Optional portrait in /public, 4:5. Without it, a monogram panel is shown. */
  portrait: "",
  responseTime: "[Insert typical reply time, e.g. 2 working days]",
  links: [
    { label: "GitHub", href: "https://github.com/TezPi" },
    { label: "LinkedIn", href: "" },
    { label: "Behance", href: "" },
    { label: "Dribbble", href: "" },
  ],
  experience: [
    {
      company: "[Insert company]",
      role: "[Insert role]",
      period: "[Insert years]",
      summary: "[Insert one line on scope, e.g. AI features for a B2B platform]",
    },
    {
      company: "[Insert company]",
      role: "[Insert role]",
      period: "[Insert years]",
      summary: "[Insert one line on scope]",
    },
    {
      company: "[Insert company]",
      role: "[Insert role]",
      period: "[Insert years]",
      summary: "[Insert one line on scope]",
    },
  ] satisfies ExperienceItem[],
  education: "[Insert education or certifications]",
  personal: "[Insert what you do outside the file: a hobby, a side project, a city you sketch]",
} as const;

export const expertise: Expertise[] = [
  {
    id: "product",
    title: "Product design",
    blurb: "I map flows, information architecture and every state before I choose a layout.",
    skills: ["User flows", "Information architecture", "UX research", "Usability testing"],
  },
  {
    id: "motion",
    title: "Interaction & motion",
    blurb: "Motion is feedback. Each transition shows what changed and where to look next.",
    skills: ["Micro-interactions", "Prototyping", "Easing systems", "GSAP, Framer Motion"],
  },
  {
    id: "systems",
    title: "Design systems",
    blurb: "Tokens, variables and components built so design and code stay one system.",
    skills: ["Design tokens", "Figma variables", "Auto Layout", "Component APIs"],
  },
  {
    id: "engineering",
    title: "Design engineering",
    blurb: "I prototype in React and Tailwind, so handoff carries real props, states and API hooks.",
    skills: ["React, Next.js", "Tailwind CSS", "TypeScript", "Loading, empty, error states"],
  },
];

export const principles: Principle[] = [
  {
    id: "behavior",
    title: "Behavior before screens",
    body: "I start with the habit loop and the exact point where people drop off. Layout comes after.",
    visual: "loop",
  },
  {
    id: "tokens",
    title: "Tokens before pixels",
    body: "Color, type, spacing and motion live as variables, so every screen inherits the same decisions.",
    visual: "tokens",
  },
  {
    id: "motion",
    title: "Motion earns its place",
    body: "Every transition answers one question: what changed, and where should you look?",
    visual: "easing",
  },
  {
    id: "states",
    title: "States are part of the design",
    body: "Loading, empty, error and success ship in the spec, with the props engineering needs to wire them.",
    visual: "states",
  },
];

export const skillGroups = [
  {
    title: "Product & UX",
    items: ["Product design", "UX research", "UX strategy", "Usability testing"],
  },
  {
    title: "Interface & motion",
    items: ["UI design", "Interaction design", "Micro-interactions", "Prototyping"],
  },
  {
    title: "Systems & build",
    items: ["Design systems", "Design tokens", "React + Tailwind", "Developer handoff"],
  },
];

/** Tool slugs map to simple-icons. Grounded in the stack you work in. */
export const tools = [
  { name: "Figma", icon: "siFigma" },
  { name: "React", icon: "siReact" },
  { name: "Next.js", icon: "siNextdotjs" },
  { name: "Tailwind CSS", icon: "siTailwindcss" },
  { name: "TypeScript", icon: "siTypescript" },
  { name: "Framer Motion", icon: "siFramer" },
  { name: "GSAP", icon: "siGreensock" },
] as const;

export const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/resume", label: "Resume" },
] as const;
