/**
 * Content model. Pages render from these types only — swapping the data
 * (or sourcing it from a CMS later) never touches a component.
 *
 * Any string wrapped in [square brackets] is a placeholder for a fact that
 * isn't on record yet. <Text> renders those as dashed chips so they're
 * impossible to ship by accident.
 */

export type Link = {
  label: string;
  href: string | null; // null = not provided yet
};

export type Profile = {
  name: string;
  shortName: string;
  studio: string;
  role: string;
  positioning: string;
  heroLine: string;
  availability: string;
  location: string;
  timezone: string;
  email: string;
  phone: string | null;
  resumePdf: string | null;
  socials: Link[];
  now: string[];
  bio: string[];
};

export type Experience = {
  period: string;
  role: string;
  org: string;
  summary: string;
  highlights: string[];
  projects?: string[]; // case-study slugs
};

export type Capability = {
  title: string;
  summary: string;
  evidence: string[];
};

export type Principle = {
  id: string;
  title: string;
  rule: string;
  before: { label: string; text: string; translation?: string };
  after: { label: string; text: string; translation?: string };
  source: string;
};

export type AuditStat = {
  label: string;
  before: number;
  after: number;
  unit?: string;
  context: string;
};

export type SpecimenKey = "console" | "tokens" | "motion";

export type ProjectCategory = "Product UX" | "AI Product" | "Design Systems" | "UX Writing" | "Motion";

/* ---------------- Case-study building blocks ---------------- */

type SectionBase = { id: string; nav: string; eyebrow: string; title: string; intro?: string };

export type TextSection = SectionBase & { kind: "text"; body: string[]; aside?: string };

export type InsightSection = SectionBase & {
  kind: "insight";
  finding: string;
  insight: string;
  opportunity: string;
};

export type BeforeAfterSection = SectionBase & {
  kind: "beforeAfter";
  beforeLabel: string;
  afterLabel: string;
  rows: { before: string; after: string; note?: string }[];
};

export type DecisionsSection = SectionBase & {
  kind: "decisions";
  items: { title: string; problem: string; decision: string; why: string }[];
};

export type FlowSection = SectionBase & {
  kind: "flow";
  flows: {
    name: string;
    meta: string;
    steps?: { label: string; flagged?: boolean }[];
    flag: string;
    response: string;
  }[];
};

export type TableSection = SectionBase & {
  kind: "table";
  columns: [string, string] | [string, string, string];
  rows: string[][];
  caption?: string;
};

export type StatsSection = SectionBase & {
  kind: "stats";
  stats: { value: string; label: string; note?: string }[];
  disclaimer: string;
};

export type ListSection = SectionBase & {
  kind: "list";
  groups: { title: string; items: string[] }[];
};

export type PlaygroundSection = SectionBase & { kind: "playground" };

export type ReflectionSection = SectionBase & {
  kind: "reflection";
  worked: string[];
  learned: string[];
  next: string[];
};

export type CaseSection =
  | TextSection
  | InsightSection
  | BeforeAfterSection
  | DecisionsSection
  | FlowSection
  | TableSection
  | StatsSection
  | ListSection
  | PlaygroundSection
  | ReflectionSection;

export type Project = {
  slug: string;
  index: string;
  title: string;
  headline: string;
  summary: string;
  productType: string;
  year: string;
  role: string;
  team: string;
  timeline: string;
  platform: string;
  responsibilities: string[];
  categories: ProjectCategory[];
  specimen: SpecimenKey;
  scan: { problem: string; solution: string; impact: string };
  sections: CaseSection[];
};
