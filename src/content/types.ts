export type ProjectKind = "client" | "personal";

/**
 * An image slot. Leave `src` empty to render a branded "empty frame"
 * placeholder; drop a file in /public/images and set `src` to fill it.
 */
export interface MediaSlot {
  /** Frame name shown on the placeholder, e.g. "cover" or "user-flow" */
  label: string;
  /** CSS aspect ratio, e.g. "16 / 10" */
  ratio: string;
  src?: string;
  alt?: string;
}

export interface MetaItem {
  label: string;
  value: string;
}

export interface ExternalLink {
  label: string;
  url: string;
}

export type CaseBlock =
  | { type: "text"; body: string[] }
  | { type: "glance"; items: MetaItem[] }
  | { type: "statement"; label: string; text: string }
  | { type: "chips"; label: string; items: string[] }
  | {
      type: "insights";
      rows: { finding: string; insight: string; opportunity: string }[];
    }
  | { type: "media"; slot: MediaSlot; caption?: string; width?: "text" | "wide" }
  | {
      type: "beforeAfter";
      before: MediaSlot;
      after: MediaSlot;
      change: string;
      evidence: string;
    }
  | {
      type: "options";
      items: { title: string; body: string; media: MediaSlot; chosen?: boolean }[];
    }
  | {
      type: "features";
      items: {
        title: string;
        problem: string;
        solution: string;
        benefit: string;
        media: MediaSlot;
      }[];
    }
  | {
      type: "metrics";
      items: { value: string; label: string }[];
      qualitative?: string[];
    }
  | { type: "swatches"; colors: { name: string; hex: string }[]; type_: string[] }
  | { type: "reflection"; worked: string[]; change: string[] };

export interface CaseSection {
  /** Anchor id, also used by the table of contents */
  id: string;
  /** Short label for the table of contents */
  nav: string;
  title: string;
  blocks: CaseBlock[];
}

export interface Project {
  slug: string;
  kind: ProjectKind;
  /** Display name (Jersey 10, Latin only) */
  title: string;
  /** Short name for the vertical cobalt rail, ideally 8 characters or fewer (e.g. "INKLAB") */
  shortName: string;
  /** One-line value proposition */
  tagline: string;
  /** 2-3 lines for cards and the case-study hero */
  summary: string;
  tags: string[];
  year: string;
  role: string;
  /** Extra hero metadata (Client, Timeline, Team, Platform...) */
  meta: MetaItem[];
  cover: MediaSlot;
  /** Two tilted "polaroid" frames on the case-study hero */
  polaroids: [MediaSlot, MediaSlot];
  links?: ExternalLink[];
  /** NDA work: hides the case study body behind a request-access state */
  confidential?: boolean;
  sections: CaseSection[];
}

export interface PlaygroundItem {
  id: string;
  title: string;
  discipline: string;
  media: MediaSlot;
}

export interface TimelineItem {
  org: string;
  period: string;
  type: string;
  title: string;
  detail?: string;
  current?: boolean;
}
