import type { CaseSection, MediaSlot, Project } from "./types";

/*
 * 3 client projects + 4 personal projects.
 *
 * Every string below is a writing prompt, not content: replace it with the
 * real thing. Keep the structure, it is what makes the case study scannable.
 * Never invent metrics: leave a metric out, or use a qualitative outcome.
 *
 * Images: put files in /public/images/projects/<slug>/ and set `src`
 * on the matching slot. Empty `src` renders an empty-frame placeholder.
 */

const slot = (label: string, ratio = "16 / 10", src = ""): MediaSlot => ({
  label,
  ratio,
  src,
  alt: "",
});

/** Full evidence-led structure for work done for a business */
function clientCaseStudy(): CaseSection[] {
  return [
    {
      id: "overview",
      nav: "Overview",
      title: "Overview",
      blocks: [
        {
          type: "glance",
          items: [
            { label: "Problem", value: "One sentence: what was broken, and for whom." },
            { label: "Solution", value: "One sentence: what you designed to fix it." },
            { label: "My role", value: "What you owned vs. what the team owned." },
            { label: "Outcome", value: "A real result, or a clearly qualitative one." },
          ],
        },
      ],
    },
    {
      id: "context",
      nav: "Context",
      title: "Context and problem",
      blocks: [
        {
          type: "text",
          body: [
            "What the business does, who its users are, and why this project started now. Keep it to what a reader needs before they see any UI.",
            "Describe the real problem, not the task. Not \"redesign the dashboard\", but the moment where users fail and what that costs the business.",
          ],
        },
        {
          type: "statement",
          label: "Problem statement",
          text: "How might we help [user] do [job] without [pain point]?",
        },
      ],
    },
    {
      id: "research",
      nav: "Research",
      title: "Research",
      blocks: [
        { type: "chips", label: "Methods", items: ["Stakeholder interviews", "User interviews", "Competitor audit", "Analytics"] },
        {
          type: "text",
          body: ["Who you talked to (count and roles), what you asked, and what you looked at. Only list methods you actually used."],
        },
        {
          type: "insights",
          rows: [
            {
              finding: "What you observed, stated as fact.",
              insight: "Why it happens and why it matters.",
              opportunity: "What the design could change.",
            },
            {
              finding: "A second observation from research.",
              insight: "The pattern behind it.",
              opportunity: "The design direction it points to.",
            },
          ],
        },
      ],
    },
    {
      id: "process",
      nav: "Process",
      title: "Structure and iteration",
      blocks: [
        { type: "media", slot: slot("user-flow", "16 / 8"), caption: "User flow or information architecture. Show the primary path and the error path.", width: "wide" },
        {
          type: "beforeAfter",
          before: slot("before", "4 / 3"),
          after: slot("after", "4 / 3"),
          change: "What changed between versions, in one line.",
          evidence: "What told you to change it: a test result, a stakeholder constraint, a data point.",
        },
      ],
    },
    {
      id: "solution",
      nav: "Solution",
      title: "Final solution",
      blocks: [
        {
          type: "features",
          items: [
            {
              title: "Key feature 01",
              problem: "The friction this feature removes.",
              solution: "How the design removes it.",
              benefit: "What the user can now do.",
              media: slot("feature-01", "16 / 10"),
            },
            {
              title: "Key feature 02",
              problem: "The friction this feature removes.",
              solution: "How the design removes it.",
              benefit: "What the user can now do.",
              media: slot("feature-02", "4 / 3"),
            },
            {
              title: "Key feature 03",
              problem: "The friction this feature removes.",
              solution: "How the design removes it.",
              benefit: "What the user can now do.",
              media: slot("feature-03", "4 / 3"),
            },
          ],
        },
      ],
    },
    {
      id: "impact",
      nav: "Impact",
      title: "Impact",
      blocks: [
        {
          type: "metrics",
          items: [
            { value: "[Metric]", label: "Insert a real, measured result" },
            { value: "[Metric]", label: "Or delete this card" },
          ],
          qualitative: [
            "Qualitative outcome, labeled as such (e.g. unified three fragmented tools).",
            "Feedback from the client or users, attributed.",
          ],
        },
      ],
    },
    {
      id: "reflection",
      nav: "Reflection",
      title: "Reflection",
      blocks: [
        {
          type: "reflection",
          worked: ["A decision that held up, and why.", "A collaboration habit worth repeating."],
          change: ["What you would test earlier.", "What you would cut or do differently."],
        },
      ],
    },
  ];
}

/** Lighter structure for self-initiated work: motivation, exploration, craft */
function personalCaseStudy(): CaseSection[] {
  return [
    {
      id: "overview",
      nav: "Overview",
      title: "Overview",
      blocks: [
        {
          type: "glance",
          items: [
            { label: "Why", value: "The question or itch that started this project." },
            { label: "What", value: "What you made, in one sentence." },
            { label: "Scope", value: "UX, UI, brand, motion: what you covered." },
            { label: "Learned", value: "The one skill this project pushed." },
          ],
        },
      ],
    },
    {
      id: "motivation",
      nav: "Motivation",
      title: "Motivation",
      blocks: [
        {
          type: "text",
          body: [
            "Who this is for and what problem or curiosity it explores. Personal work is strongest when it answers a specific question.",
          ],
        },
        { type: "statement", label: "Design goal", text: "Make [experience] feel [quality] for [audience]." },
      ],
    },
    {
      id: "exploration",
      nav: "Exploration",
      title: "Exploration",
      blocks: [
        {
          type: "options",
          items: [
            { title: "Direction A", body: "What it tried and why it fell short.", media: slot("direction-a", "4 / 3") },
            { title: "Direction B", body: "Why this direction won.", media: slot("direction-b", "4 / 3"), chosen: true },
            { title: "Direction C", body: "What it taught you anyway.", media: slot("direction-c", "4 / 3") },
          ],
        },
      ],
    },
    {
      id: "solution",
      nav: "Solution",
      title: "Final design",
      blocks: [
        { type: "media", slot: slot("hero-screen", "16 / 9"), caption: "The strongest screen, large enough to inspect.", width: "wide" },
        {
          type: "features",
          items: [
            {
              title: "Detail 01",
              problem: "The moment this detail solves.",
              solution: "The interaction or visual decision.",
              benefit: "Why it matters to the user.",
              media: slot("detail-01", "4 / 3"),
            },
            {
              title: "Detail 02",
              problem: "The moment this detail solves.",
              solution: "The interaction or visual decision.",
              benefit: "Why it matters to the user.",
              media: slot("detail-02", "4 / 3"),
            },
          ],
        },
      ],
    },
    {
      id: "system",
      nav: "Visual system",
      title: "Visual system",
      blocks: [
        {
          type: "swatches",
          colors: [
            { name: "Primary", hex: "#3457DB" },
            { name: "Accent", hex: "#FECD50" },
            { name: "Surface", hex: "#FFF5E7" },
            { name: "Neutral", hex: "#898478" },
          ],
          type_: ["Display typeface", "Text typeface"],
        },
      ],
    },
    {
      id: "reflection",
      nav: "Reflection",
      title: "Reflection",
      blocks: [
        {
          type: "reflection",
          worked: ["What you would keep."],
          change: ["What you would do next with more time."],
        },
      ],
    },
  ];
}

function clientProject(n: number, tags: string[]): Project {
  const id = String(n).padStart(2, "0");
  return {
    slug: `client-${id}`,
    kind: "client",
    title: `Client Project ${id}`,
    shortName: `Client ${id}`,
    tagline: "One-line value proposition",
    summary:
      "Two or three lines: what the product is, who it serves, the problem you solved and the part you played.",
    tags,
    year: "20XX",
    role: "Your role",
    meta: [
      { label: "Client", value: "Company name" },
      { label: "Timeline", value: "X months" },
      { label: "Team", value: "PM, devs, you" },
      { label: "Platform", value: "Web / iOS" },
    ],
    cover: slot("cover", "16 / 10"),
    polaroids: [slot("key-screen", "5 / 4"), slot("detail", "5 / 4")],
    sections: clientCaseStudy(),
  };
}

function personalProject(n: number, tags: string[]): Project {
  const id = String(n).padStart(2, "0");
  return {
    slug: `personal-${id}`,
    kind: "personal",
    title: `Personal Project ${id}`,
    shortName: `Personal ${id}`,
    tagline: "What it explores",
    summary: "Two lines: the idea, who it is for, and what you set out to learn.",
    tags,
    year: "20XX",
    role: "Solo designer",
    meta: [
      { label: "Type", value: "Self-initiated" },
      { label: "Timeline", value: "X weeks" },
      { label: "Tools", value: "Figma" },
    ],
    cover: slot("cover", "16 / 10"),
    polaroids: [slot("key-screen", "5 / 4"), slot("detail", "5 / 4")],
    sections: personalCaseStudy(),
  };
}

export const projects: Project[] = [
  clientProject(1, ["Product UI", "Web"]),
  clientProject(2, ["Mobile", "UX"]),
  clientProject(3, ["Brand", "Graphic"]),
  personalProject(1, ["Concept", "Mobile"]),
  personalProject(2, ["UI", "Web"]),
  personalProject(3, ["Brand", "Identity"]),
  personalProject(4, ["Motion", "Interaction"]),
];

export const clientProjects = projects.filter((p) => p.kind === "client");
export const personalProjects = projects.filter((p) => p.kind === "personal");

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** Position inside its own group, e.g. 02 / 03 */
export function groupIndex(project: Project) {
  const group = project.kind === "client" ? clientProjects : personalProjects;
  return { index: group.indexOf(project) + 1, total: group.length };
}

export function getAdjacent(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? projects[i - 1] : undefined,
    next: projects[(i + 1) % projects.length],
  };
}
