import type { AuditStat, Capability, Experience, Principle, Profile } from "./types";

export const profile: Profile = {
  name: "Hồ Phú Thịnh",
  shortName: "Thịnh",
  studio: "TezPi Studio",
  role: "Product Designer",
  heroLine: "Product Designer — AI products & design systems",
  positioning:
    "I design AI workforce products for Vietnamese small businesses: interfaces where agents do the work and people keep the final say.",
  availability: "Open to product design roles",
  location: "Vietnam",
  timezone: "Asia/Ho_Chi_Minh",
  email: "hophuthinh0609@gmail.com",
  phone: "+84 378 721 294",
  resumePdf: null,
  socials: [
    { label: "LinkedIn", href: null },
    { label: "Email", href: "mailto:hophuthinh0609@gmail.com" },
  ],
  now: [
    "rewriting warnings into consequences",
    "auditing 344 Figma variables",
    "drawing a logo with 33 trim paths",
    "teaching a border to bend light round corners",
    "renaming “ánh xạ” to “ghép cột”",
  ],
  bio: [
    "I'm a product designer at TezPi Studio, working on Agent-X: an AI workforce platform that lets Vietnamese shops hand customer conversations, orders and follow-ups to AI agents.",
    "My users sell on Shopee and TikTok Shop, answer customers on Zalo and ship with GHN. They aren't engineers, and they're deciding whether a machine can be trusted with their customers. So I design for that trust: agents draft, people approve, and every status line says what happens next.",
    "I care about the parts most people skip: the word on a disabled button, the difference between “paused” and “off-shift”, the 0.2 seconds between two words in a logo reveal.",
  ],
};

export const experience: Experience[] = [
  {
    period: "[Start year] — Now",
    role: "Product Designer",
    org: "Agent-X · TezPi Studio",
    summary:
      "Designing the Console, the product language behind XWorkspace, XOmnichannel and XRetention.",
    highlights: [
      "Designed 60+ Console screens across conversations, customers, orders, appointments, settings and data sources.",
      "Extended a 344-variable Figma token system with agent-state, surface and text tokens.",
      "Wrote the copy doctrine: lead with what the agent did, then the gap, and give every warning a one-tap fix.",
      "Mapped the IA (10 epics, 57 features, ~83 screens) from 334 API routes.",
      "Built the motion grammar used across banners, logo reveals and chat sequences.",
    ],
    projects: ["agent-x-console", "console-design-system", "motion-grammar"],
  },
  {
    period: "[Years]",
    role: "[Previous role]",
    org: "[Company]",
    summary: "[One line on scope and outcome. Add earlier experience here.]",
    highlights: [],
  },
];

export const capabilities: Capability[] = [
  {
    title: "AI product UX",
    summary:
      "Human-in-the-loop by design. AI drafts, people approve. Review gates, handoffs and state names that never lie.",
    evidence: ["“Chờ duyệt” review gate", "Off-shift ≠ Paused ≠ Error", "Write-access approval for tools"],
  },
  {
    title: "Design systems",
    summary:
      "Tokens with roles instead of raw hex. Every component state is designed before anyone needs it.",
    evidence: ["344 variables · 10 collections", "Control grammar as law", "Plugin API audits"],
  },
  {
    title: "UX writing",
    summary:
      "Vietnamese-first microcopy for shop owners, not engineers. I state the consequence, not the metric.",
    evidence: ["“ánh xạ” → “ghép cột”", "Warnings with one-tap fixes", "Dialogs that name casualties"],
  },
  {
    title: "Motion",
    summary: "Four verbs and one easing curve. Motion should explain a change of state.",
    evidence: ["expo-out (0.16, 1, 0.3, 1)", "Trim-path logo draws", "Rolling odometers"],
  },
];

export const tools = [
  "Figma",
  "Figma Variables",
  "Figma Plugin API",
  "FigJam",
  "Figma motion",
  "HTML & CSS",
  "AI agents in the design workflow",
];

export const principles: Principle[] = [
  {
    id: "consequence",
    title: "Say the consequence, not the metric.",
    rule: "A number on its own doesn't tell anyone what to do. Say what happens if they don't act.",
    before: { label: "Metric", text: "Mô tả *  ·  0%", translation: "Description (required) · 0%" },
    after: {
      label: "Consequence",
      text: "thiếu mô tả — agent sẽ bỏ qua tệp này",
      translation: "no description, so the agent will skip this file",
    },
    source: "Agent-X · Data sources",
  },
  {
    id: "order",
    title: "Lead with what works, then the gap.",
    rule: "Same numbers, nothing hidden. The order decides whether it reads as “broken” or as “two things left”.",
    before: {
      label: "Warning first",
      text: "2 khách chưa có tên · agent không nhắn lại được",
      translation: "2 customers have no name · the agent can't message back",
    },
    after: {
      label: "Work first",
      text: "Agent tự ghi nhận 128 khách từ 5 kênh · 2 người chưa có liên hệ",
      translation: "The agent logged 128 customers from 5 channels · 2 still have no contact",
    },
    source: "Agent-X · Card footers (9 of 11 opened with a warning)",
  },
  {
    id: "loop",
    title: "AI drafts. People approve.",
    rule: "Human-in-the-loop has to exist in the UI, not only in the marketing. Nothing touches real data without a nod.",
    before: {
      label: "Auto-write",
      text: "Đã cập nhật 18 mục kiến thức.",
      translation: "18 knowledge entries updated.",
    },
    after: {
      label: "Review gate",
      text: "chưa lưu — agent chưa dùng bản này  ·  Duyệt",
      translation: "not saved: the agent isn't using this version yet · Approve",
    },
    source: "Agent-X · AI suggestions",
  },
  {
    id: "casualties",
    title: "Destructive dialogs name the casualties.",
    rule: "Skip “are you sure?”. List what breaks, say what survives, and label the buttons with what they do.",
    before: { label: "Generic", text: "Bạn có chắc không?  ·  Huỷ  ·  OK", translation: "Are you sure? · Cancel · OK" },
    after: {
      label: "Specific",
      text: "Kỹ năng Chốt đơn từ bình luận đang dùng kỹ năng này. Lịch sử hội thoại vẫn giữ.  ·  Giữ lại  ·  Vẫn gỡ",
      translation:
        "The “Close orders from comments” skill uses this. Conversation history stays. · Keep it · Remove anyway",
    },
    source: "Agent-X · Remove skill dialog",
  },
  {
    id: "jargon",
    title: "No jargon. The user sells clothes on Shopee.",
    rule: "If the person who commissioned the design has to ask what a word means, a shop owner won't know either.",
    before: { label: "Engineer", text: "Ánh xạ cột", translation: "Column mapping (the mathematical term)" },
    after: { label: "Shop owner", text: "Ghép cột", translation: "Match columns" },
    source: "Agent-X · Data import",
  },
];

export const auditStats: AuditStat[] = [
  {
    label: "Saturated colour patches across nine cards",
    before: 40,
    after: 9,
    context: "Status moved into a 6px dot. Text, icons and buttons went neutral.",
  },
  {
    label: "Characters per table row",
    before: 95,
    after: 34,
    context: "Repeated units moved up into the column headers.",
  },
  {
    label: "Card-to-page separation",
    before: 2.6,
    after: 7,
    unit: "%",
    context: "Three planes and one shadow fixed what extra colour couldn't.",
  },
  {
    label: "Percent chips with threshold colouring",
    before: 192,
    after: 0,
    context: "Unified across 7 pages. Status already had its own column.",
  },
];
