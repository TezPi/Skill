import type { Project, ProjectCategory } from "./types";

export const projects: Project[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: "agent-x-console",
    index: "01",
    title: "Agent-X Console",
    headline: "Making AI agents read as manageable, not broken.",
    summary:
      "Agent-X is an AI workforce platform for Vietnamese small businesses. I designed the Console, where shop owners hand work to agents, review what they drafted and fix what's missing.",
    productType: "AI workforce platform · Web console",
    year: "2026",
    role: "Product Designer",
    team: "[Insert team, e.g. 1 PM · n engineers · AI team]",
    timeline: "[Insert duration]",
    platform: "Desktop web · 1440 console",
    responsibilities: ["UX flows & IA", "UI design", "UX writing (Vietnamese)", "Component states", "Design audits"],
    categories: ["Product UX", "AI Product", "UX Writing"],
    specimen: "console",
    scan: {
      problem:
        "Read in sequence, the status copy made healthy agents look broken. 9 of 11 card footers opened with a warning.",
      solution:
        "A copy and colour doctrine: lead with what the agent did, close with the gap, give every warning a one-tap fix and let colour speak once.",
      impact:
        "Qualitative: same numbers, nothing hidden, and the screens now make the product's case. Measured in the file: saturated patches ~40 → 9, row copy ~95 → 34 characters.",
    },
    sections: [
      {
        kind: "text",
        id: "context",
        nav: "Context",
        eyebrow: "01 · Context",
        title: "The product's pitch lives in its status lines.",
        body: [
          "Agent-X has three products. XWorkspace gives each department an AI assistant. XOmnichannel puts Zalo, Facebook, Instagram, TikTok Shop, WhatsApp and Shopee into one inbox. XRetention segments customers and re-engages them over Zalo ZNS, email and SMS.",
          "The people using it run shops. They sell on Shopee and TikTok Shop, keep stock in KiotViet or Haravan and ship with GHN. They aren't engineers, and they're deciding whether an AI agent can be trusted with their customers.",
          "The product's thesis is that AI agents are easier to manage than human staff. Every card, badge and footer on screen either backs that up or quietly works against it.",
        ],
        aside:
          "Voice: AI as a colleague, not a tool. The verbs are giao việc (assign), duyệt (approve) and trực (be on duty). Never generate, submit or execute.",
      },
      {
        kind: "stats",
        id: "structure",
        nav: "Structure",
        eyebrow: "02 · Structure",
        title: "Map the product before touching a pixel.",
        intro: "I built the module tree from the API surface, then read it for imbalances.",
        stats: [
          { value: "10", label: "epics" },
          { value: "57", label: "features" },
          { value: "~83", label: "screens (estimate)" },
          { value: "334", label: "API routes read" },
        ],
        disclaimer:
          "The screen count was inferred from the API, not from frontend code, so it's flagged as an estimate until engineering signs off. The imbalance was the finding: Omnichannel had 5 features but 20 screens, and Knowledge had 10 features and 11 screens. Something inside Omnichannel was bloated.",
      },
      {
        kind: "flow",
        id: "flows",
        nav: "Flows",
        eyebrow: "03 · User flows",
        title: "Four journeys, and the point where each one breaks.",
        flows: [
          {
            name: "Shop owner builds a first agent",
            meta: "7 steps · target under 30 min",
            flag: "Loading data and connecting channels both force people out of the Console.",
            response: "That's where people abandon, so both steps were flagged to be pulled inside.",
          },
          {
            name: "Customer messages → agent replies → order closes",
            meta: "The daily loop",
            steps: [
              { label: "Customer messages" },
              { label: "Agent reads the thread" },
              { label: "Enough information?", flagged: true },
              { label: "Agent replies" },
              { label: "Order closes" },
            ],
            flag: "The “enough information?” branch is where the Handler Switch lives.",
            response: "When the answer is no, a person takes over without the customer noticing a seam.",
          },
          {
            name: "Staff picks up a hard case",
            meta: "6 steps",
            flag: "Everything depends on the context handoff.",
            response: "If the context gets lost, the customer has to start over.",
          },
          {
            name: "Manager tracks cost and quality",
            meta: "Weekly",
            flag: "The eval runner and the kill-switch panel are almost never opened.",
            response: "Both need pulling into the main flow instead of waiting to be found.",
          },
        ],
      },
      {
        kind: "insight",
        id: "insight",
        nav: "Insight",
        eyebrow: "04 · Insight",
        title: "Every warning was true, but the order gave the wrong picture.",
        finding: "An audit of the agent cards found that 9 of 11 footers opened with a warning.",
        insight:
          "Read in sequence, warnings-first copy made the agent look permanently broken, which is the opposite of “easier to manage than staff”. The fair comparison is agent vs. human, not agent vs. perfect.",
        opportunity:
          "Reorder, don't hide. A shop owner still needs to know which files the agent is ignoring, because hiding that costs money and trust. So each line opens with what the agent did and closes with the gap.",
      },
      {
        kind: "beforeAfter",
        id: "rewrite",
        nav: "Rewrite",
        eyebrow: "05 · Rewrite",
        title: "Same numbers, nothing hidden, opposite feeling.",
        beforeLabel: "Undermines",
        afterLabel: "Supports",
        rows: [
          {
            before: "2 khách chưa có tên · agent không nhắn lại được",
            after: "Agent tự ghi nhận 128 khách từ 5 kênh · 2 người chưa có liên hệ",
            note: "“2 customers have no name” → “The agent logged 128 customers from 5 channels · 2 still have no contact”",
          },
          {
            before: "2 mốc chưa có nội dung · khách sẽ không nhận được tin",
            after: "Agent tự báo khách ở 4/6 mốc đơn · còn 2 mốc cần soạn",
            note: "“2 milestones are empty” → “The agent updates customers at 4 of 6 order milestones · 2 left to write”",
          },
          {
            before: "1 khách chờ hơn 20 phút",
            after: "Agent giữ 4 khách không để rơi · 1 người chờ hơn 20 phút",
            note: "“1 customer waiting 20+ min” → “The agent is holding 4 customers · 1 has waited 20+ min”",
          },
          {
            before: "18 mục · 3 agent chưa dùng",
            after: "Agent dùng 15/18 mục để trả lời khách · 3 mục chưa dùng",
            note: "“18 entries · 3 unused” → “The agent answers from 15 of 18 entries · 3 unused”",
          },
        ],
      },
      {
        kind: "decisions",
        id: "decisions",
        nav: "Decisions",
        eyebrow: "06 · Decisions",
        title: "Six rules that came out of the rewrite.",
        items: [
          {
            title: "Say the consequence, not the metric",
            problem:
              "Fields showed 100% / 0%, character counts and a required asterisk. None of them told anyone what to do.",
            decision:
              "I replaced metrics with outcomes. “thiếu mô tả — agent sẽ bỏ qua tệp này” (no description, so the agent will skip this file). A bare “Lỗi” (Error) became “Mất kết nối OA từ 07:05” (OA disconnected since 07:05).",
            why: "A yes/no field doesn't need a percentage, and a character count doesn't help anyone decide what to do next.",
          },
          {
            title: "Colour speaks once",
            problem:
              "Status tinted the dot, the text, the icon and the button all at once, which added up to about 40 saturated patches across nine cards.",
            decision:
              "Status lives in the dot. Text, icons and buttons stay neutral unless they're the one action to take. Six of the nine cards turned out to need no button.",
            why: "Measured: ~40 saturated patches → 9. Buttons now rank by weight, not hue.",
          },
          {
            title: "Add depth, not colour",
            problem: "White cards on a white page looked lifeless, and the first instinct was to add colour.",
            decision: "I used three planes (rail, body, card) and one soft card shadow.",
            why: "Card-to-page separation went from 2.6% to 7%. Extra colour couldn't have done that.",
          },
          {
            title: "Put human-in-the-loop into the UI",
            problem:
              "“We never send a message you haven't approved” was a landing-page promise with no screen behind it.",
            decision:
              "The “Chờ duyệt” (awaiting approval) card became the only dashboard mini-card with an action button. AI suggestions arrive as blue drafts behind a Duyệt (Approve) button. External tools with write access arrive unchecked, with amber labels.",
            why: "A promise needs a screen where it's kept. Otherwise it's just marketing copy.",
          },
          {
            title: "One word, one meaning",
            problem: "Off-shift, paused and broken agents all looked alike, so a healthy agent could look dead.",
            decision:
              "One shared set of state names. Off-shift ≠ Paused, because one restarts itself and the other waits for you. Needs setup ≠ Error. Paused ≠ Disconnected, because pausing keeps the login.",
            why: "State names are a contract: a word means the same thing on every screen.",
          },
          {
            title: "No jargon, no markdown",
            problem:
              "Column matching was labelled “ánh xạ” (the mathematical term for mapping), and knowledge entries expected ## headings.",
            decision:
              "“Ánh xạ” became “ghép cột” (match columns). Markdown was replaced by one card per piece of knowledge with two plain fields, a title and an answer.",
            why: "Asking a shop owner to learn syntax so the system can split sections makes the user do the system's job.",
          },
        ],
      },
      {
        kind: "text",
        id: "model",
        nav: "Model",
        eyebrow: "07 · Model-level fix",
        title: "Two buttons for one intention.",
        body: [
          "Loading data asked people to press “chuẩn hoá” (standardise) and then “train”. That's two manual gates for one intention. Chatbase has a single verb: Retrain.",
          "Reordering the buttons wouldn't have fixed it. I demoted standardising from a verb to a state that runs automatically when data comes in, so people only step in where the machine gives up, at missing fields.",
          "Raw and standardised data also stopped being two views taking turns in the same slot. Raw data became an action (＋ Nạp dữ liệu, which opens a drawer), and a queue strip links input to output.",
        ],
      },
      {
        kind: "reflection",
        id: "reflection",
        nav: "Reflection",
        eyebrow: "08 · Reflection",
        title: "What I'd carry forward.",
        worked: [
          "Reordering instead of hiding. The honest version turned out to be the persuasive one.",
          "Naming states before drawing screens removed whole categories of ambiguity.",
        ],
        learned: [
          "Scope is a promise. I fix the screen I was pointed at and ask before spreading a change, even an improvement.",
          "Measure the shipped product, not the spec. The spec said Plus Jakarta Sans, but production ran Inter.",
        ],
        next: [
          "Put the human comparison on screen: “Agent xử lý 128 hội thoại tuần này — bằng 3 người trực toàn thời gian” (128 conversations this week, the same as 3 full-time staff). No screen says it yet.",
          "Usability-test the review gate with shop owners. [Insert test results]",
          "[Insert shipped outcome metrics once available]",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "console-design-system",
    index: "02",
    title: "Console Design System",
    headline: "344 variables. One action colour.",
    summary:
      "The Agent-X Figma file held three visual systems from three design eras. I moved product screens onto one Console language, added tokens for states it had no words for, and audited it with scripts instead of by eye.",
    productType: "Design system · Figma variables & components",
    year: "2026",
    role: "Product Designer, design system",
    team: "[Insert collaborators]",
    timeline: "[Insert duration]",
    platform: "Figma · Console (light-first)",
    responsibilities: ["Token architecture", "Component states", "Accessibility audits", "Plugin API scripting", "Documentation"],
    categories: ["Design Systems"],
    specimen: "tokens",
    scan: {
      problem:
        "Three parallel palettes, raw hex in the brand collections, four different radius/md values and the number 16 stored under three names.",
      solution:
        "Console as the single product language, with semantic tokens that have roles, a locked control grammar and state names shared by every component.",
      impact:
        "Measured in the file: 192 percent chips unified across 7 pages, 415 hard-coded nodes rebound to tokens, and a WCAG failure caught by splitting dot colours from text colours.",
    },
    sections: [
      {
        kind: "table",
        id: "context",
        nav: "Context",
        eyebrow: "01 · Context",
        title: "Three palettes from three eras, all in one product.",
        intro:
          "The file had grown to 344 variables across 10 collections. The bigger problem was three parallel visual systems, each with its own accent and radius scale.",
        columns: ["System", "Character", "Used by"],
        rows: [
          ["Tokens · warm/bone", "Warm canvas, indigo accent, radius 16–28", "App shell “AI Workforce”"],
          ["Console", "Neutral, one blue action colour, radius 6 · 10 · 14", "All product screens (the active language)"],
          ["Liquid", "Slate ink, blue → violet → magenta gradient, glass", "Marketing landings"],
        ],
        caption: "Decision: Console became the product language. Liquid stays in marketing, and Tokens is legacy.",
      },
      {
        kind: "table",
        id: "grammar",
        nav: "Grammar",
        eyebrow: "02 · Control grammar",
        title: "One shape, one meaning, no exceptions.",
        columns: ["Shape", "Means"],
        rows: [
          ["Pill, radius 10", "Navigation"],
          ["Radio", "Choose one"],
          ["Checkbox", "On / off"],
          ["Blue solid button", "The action to take"],
          ["Black chip", "Numeric data"],
          ["Coloured dot", "Live status"],
          ["Segmented control", "Binary mode switch"],
          ["Drawer / side sheet", "Keeps context visible behind"],
          ["Modal", "Blocks context. Destructive or focused tasks only"],
        ],
        caption:
          "Selected state = tinted fill + blue border and text at radius 10, not a pill. Someone proposed green for selection. I rejected it because brand blue already means “chosen”.",
      },
      {
        kind: "insight",
        id: "contrast",
        nav: "Insight",
        eyebrow: "03 · Insight",
        title: "A colour that works as a dot can fail as text.",
        finding:
          "signal/live, the green that means “running”, measured 4.2:1 as text on white. That fails WCAG AA, even though it looked fine as a 6px dot.",
        insight:
          "Signal colours and text colours do different jobs and need different contrast. One token can't do both.",
        opportunity:
          "I split them: signal/* for dots and solid fills, text/* for type. I added text/success (#3F7300, 5.7:1) and text/warning (#8A4F00) for copy that carries state.",
      },
      {
        kind: "table",
        id: "tokens",
        nav: "Tokens",
        eyebrow: "04 · Tokens added",
        title: "Words the system didn't have yet.",
        columns: ["Token", "Why"],
        rows: [
          [
            "state/running · pending · paused · error · scheduled",
            "The system had no words for agent status. “Scheduled” (off-shift) ≠ “paused by you”.",
          ],
          ["surface/inverse", "The navy button had no token, and using text/hi as a fill is semantically wrong."],
          ["surface/success · error · warning", "Console had solid signal colours but no tinted backgrounds."],
          ["text/success · text/warning", "Signal colours fail as small text (see above)."],
          ["radius/xl = 18", "The scale jumped 6 → 10 → 14 → 999, with no step for ticket-style cards."],
          [
            "Elevation/Drop Target",
            "A shadow tinted with the brand colour. I made a new style instead of editing Command Bar, which three screens depend on.",
          ],
        ],
      },
      {
        kind: "decisions",
        id: "patterns",
        nav: "Patterns",
        eyebrow: "05 · Patterns",
        title: "Components built around the states people miss.",
        items: [
          {
            title: "The header row becomes the bulk bar",
            problem: "Selecting rows usually pops up a new toolbar, and the table jumps.",
            decision:
              "The header row turns into the action bar: same 1238px width, 36 → 48px tall, and nothing new appears. There's one bulk-bar component per table layout, because column widths differ.",
            why: "Nothing shifts, and the selection controls stay where the eye already is.",
          },
          {
            title: "Selecting the page ≠ selecting every result",
            problem: "5 visible rows and 128 mostly hidden ones looked identical once selected.",
            decision:
              "An escalation link, “Chọn tất cả 128 sản phẩm khớp bộ lọc” (select all 128 matching products), turns the bar amber, and the button shows the number: Chuẩn hoá 128.",
            why: "Acting on things you can't see shouldn't look the same as acting on things you can.",
          },
          {
            title: "Disabled buttons say why",
            problem: "A silently greyed-out button leaves people guessing what's wrong.",
            decision: "“2 mục đang đồng bộ — không xoá được” (2 items are syncing, so they can't be deleted).",
            why: "Every blocked action also tells you what to do.",
          },
          {
            title: "Menus adapt to state",
            problem: "A fixed ⋯ menu offered “Pause” on things already off and “Re-sync” on broken channels.",
            decision:
              "The first item follows the state. Active → Pause. Inactive → Turn on. Needs setup → Connect now. Error → View log + Retry. Items that are installing get no menu.",
            why: "A menu should only offer what makes sense right now.",
          },
        ],
      },
      {
        kind: "list",
        id: "audit",
        nav: "Audit",
        eyebrow: "06 · Verify, don't assume",
        title: "Every build ends with the same audit.",
        intro:
          "I script checks through the Figma Plugin API instead of trusting a visual pass. Each of these has caught a real bug.",
        groups: [
          {
            title: "What gets checked",
            items: [
              "Token bindings, including which collection they come from, not just whether they're bound",
              "Contrast against the background the text actually sits on",
              "Text overflow: clone the node, free it, compare its true height to its box",
              "Structural diff between variants. A missing node is a silent bug",
              "Column geometry: header edges vs. cell edges",
              "componentProperties vs. mainComponent, to catch a label and a button that disagree",
            ],
          },
          {
            title: "Debt it surfaced",
            items: [
              "Brand collections held raw hex instead of aliasing primitives, so a brand colour change wouldn't cascade",
              "Four different radius/md values, and the number 16 under three names",
              "Two component sets both called Button, with different properties",
              "An icon page with ~7,106 components, of which ~36 are used",
              "Screens imported from code carried Tailwind's red-500. I rebound 415 nodes and flagged the root cause in the codebase",
            ],
          },
        ],
      },
      {
        kind: "stats",
        id: "numbers",
        nav: "Numbers",
        eyebrow: "07 · In the file",
        title: "What changed, measured.",
        stats: [
          { value: "344", label: "variables across 10 collections, audited" },
          { value: "192", label: "percent chips moved to one neutral style across 7 pages" },
          { value: "415", label: "hard-coded nodes rebound to tokens" },
          { value: "4.2 → 5.7", label: "contrast ratio of success text on white after the dot/text split" },
        ],
        disclaimer:
          "These are file-level measurements from design audits, not product KPIs. [Insert adoption or handoff metrics if available.]",
      },
      {
        kind: "reflection",
        id: "reflection",
        nav: "Reflection",
        eyebrow: "08 · Reflection",
        title: "What I'd carry forward.",
        worked: [
          "Treating the control grammar as law. Once each shape had one meaning, the debates stopped.",
          "Creating new tokens instead of repurposing ones that other screens depend on.",
        ],
        learned: [
          "Fix by role, never by category. Screens legitimately mix collections by role, so a blanket rule like “anything outside collection X is wrong” breaks more than it fixes.",
          "Tinted fills don't survive the Plugin API. Opacity isn't kept, so a 14% tint gets written as a solid. Use real neutral tokens.",
        ],
        next: [
          "Alias the brand collections to primitives so a brand change cascades everywhere.",
          "Add trend/up and trend/down. Deltas still borrow signal/live, which means “on duty”, not “increasing”.",
          "Move the icon library into its own file.",
          "Move the codebase's CSS onto variables mapped to the Color collection, so imports stop bringing hex back.",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "motion-grammar",
    index: "03",
    title: "Motion Grammar",
    headline: "Four verbs: rise, fade, draw, pop.",
    summary:
      "Banners, logo reveals, chat sequences and title packs for Agent-X, all built in Figma on one grammar so every piece moves like the same brand.",
    productType: "Brand motion system · Figma",
    year: "2026",
    role: "Designer, motion system",
    team: "[Insert collaborators]",
    timeline: "[Insert duration]",
    platform: "Figma motion · 720px / 30fps previews",
    responsibilities: ["Motion principles", "Choreography", "Logo animation", "Banner & social motion", "Technique R&D"],
    categories: ["Motion"],
    specimen: "motion",
    scan: {
      problem:
        "The brief never changed (modern, smooth, simple, synchronised, no excess effects), but without rules every piece made up its own timing.",
      solution:
        "A grammar: one easing curve, four verbs, a fixed scale of rise distances and a stagger rhythm, plus reusable structures like the float-group and the rolling odometer.",
      impact:
        "Qualitative: everything from a 5.6s banner to a 17s chat sequence shares one rhythm, and static frames export exactly like the design. [Insert engagement data if available]",
    },
    sections: [
      {
        kind: "table",
        id: "grammar",
        nav: "Grammar",
        eyebrow: "01 · The grammar",
        title: "Fewer choices, more rhythm.",
        columns: ["Rule", "Value"],
        rows: [
          ["Master easing", "expo-out · cubic-bezier(0.16, 1, 0.3, 1) on every entry"],
          ["Pop easing", "Gentle spring on every pop"],
          ["Verbs", "Only four: rise, fade, draw, pop. No rotation, no bounce for its own sake"],
          ["Rise distances", "10 · 14 · 20 · 24 px"],
          ["Duration", "0.45–0.75s per element"],
          ["Phase overlap", "~0.3s, so nothing ever freezes"],
          ["Element stagger", "0.2–0.35s"],
          ["Character stagger", "0.07s, with a 0.12–0.24s pause between words"],
        ],
      },
      {
        kind: "playground",
        id: "playground",
        nav: "Try it",
        eyebrow: "02 · Try it",
        title: "The grammar, running live.",
        intro: "This site runs on the same rules. Replay each verb.",
      },
      {
        kind: "insight",
        id: "word-gap",
        nav: "Insight",
        eyebrow: "03 · Insight",
        title: "People read brand names as words, not letters.",
        finding: "With an even 0.07s stagger per character, a 14-letter name fired off like a typewriter.",
        insight: "The eye needs a beat between words to read them. Motion rhythm is reading rhythm.",
        opportunity:
          "Add a 0.12–0.24s pause between words. The same letters then read as two words, which is how people read a brand name. The name on this site's home page uses it.",
      },
      {
        kind: "list",
        id: "techniques",
        nav: "Techniques",
        eyebrow: "04 · Techniques",
        title: "A small kit, used on purpose.",
        groups: [
          {
            title: "Entrances",
            items: [
              "Blur-to-focus: blur 8–16 → 0 while rising. My headline signature.",
              "Masked text rise: copy climbing out from behind a mask.",
              "Line draw: connectors and borders drawing themselves with trim paths.",
              "Overshoot spring: 0.8 → 1.03 → 1.0 for pops.",
            ],
          },
          {
            title: "Emphasis & transitions",
            items: [
              "CTA pulse: a gentle 1.03 breath late in the timeline.",
              "Rolling odometer: a Stripe/Linear-style count-up built from clipped digit columns.",
              "Squash & stretch on impact: stretch X 1.08, squash Y 0.85, sink 3px, spring back.",
              "Camera push-in: 0.82 → 1.0 over 2.8s, landing as the content finishes assembling.",
              "Defocus exit: blur up while fading out between scenes.",
            ],
          },
        ],
      },
      {
        kind: "decisions",
        id: "architecture",
        nav: "Architecture",
        eyebrow: "05 · Architecture",
        title: "Structures that keep motion in sync.",
        items: [
          {
            title: "Float-group",
            problem: "Syncing a floating bob by hand across text and decoration drifts out of phase.",
            decision:
              "One wrapper carries the shared bob (±4–5px over 3.2–3.4s) and holds everything that breathes together. Individual transitions happen inside it.",
            why: "Transforms compound, so nothing drifts by even a frame. The structure keeps things in sync, not manual timing.",
          },
          {
            title: "Rolling odometer",
            problem: "Figma can't tween text, so +0% → +53% can't simply count up.",
            decision:
              "Each digit gets its own clipped 28×48 column holding a 0–9 stack 480px tall. All columns start and land together but travel different distances.",
            why: "They move at different speeds, like a mechanical counter, while staying in sync. The numbers on this site's home page work the same way.",
          },
          {
            title: "Static state is sacred",
            problem: "Motion layers can alter the design when the timeline isn't playing.",
            decision: "Every added node sits at opacity 0 at rest. Undoing it is always “delete the fx/* nodes”.",
            why: "The design exports exactly the same, and motion never costs the static frame a pixel.",
          },
          {
            title: "Target by label, not by ID",
            problem: "Node IDs change when a file gets restructured, which breaks automated sweeps.",
            decision:
              "Find cards by their text label instead of hard-coded IDs. Always clone originals into a sequence instead of moving them.",
            why: "Automations survive rebuilds, and the original frame stays usable on its own.",
          },
        ],
      },
      {
        kind: "stats",
        id: "pieces",
        nav: "Pieces",
        eyebrow: "06 · Choreographies",
        title: "From a three-act logo to a 17-second chat.",
        stats: [
          {
            value: "5.6s",
            label: "banner reveal",
            note: "Header → masked title → chips → 3 cards → mock UI wakes up → stats → CTA",
          },
          {
            value: "91",
            label: "animation tracks over ~70 nodes",
            note: "A two-act 15s banner with a dissolve bridge between the acts",
          },
          {
            value: "33",
            label: "trim paths in a draw-on logo",
            note: "Strokes ink in, fills bleed in after, sketch lines dissolve",
          },
          {
            value: "17s",
            label: "Messenger chat · 3 scenes",
            note: "Typing dots, spring-in bubbles, a celebration wave, a finger tap",
          },
        ],
        disclaimer:
          "These are production facts about the pieces, not performance metrics. [Insert view or engagement data if available.]",
      },
      {
        kind: "text",
        id: "runner",
        nav: "Detail",
        eyebrow: "07 · Detail",
        title: "Light that bends around corners.",
        body: [
          "A single segment, 10–12% of the perimeter, runs around a frame's edge every 5 seconds. A blurred halo sits under a bright core, and both ride the same trim window.",
          "The corners are what sell it. They're rebuilt as arcs, and for a path inset N px the arc radius is the frame radius minus N. The moment the light bends is what makes it look like a neon tube and not a sliding line.",
          "The effect reads the frame's real corner radius when it's built, so it refits if the design changes. The main button on this site's home page uses the same idea.",
        ],
      },
      {
        kind: "reflection",
        id: "reflection",
        nav: "Reflection",
        eyebrow: "08 · Reflection",
        title: "What I'd carry forward.",
        worked: ["Limiting the verbs. Four covered everything, and the limit is why the pieces feel related."],
        learned: [
          "For a title and subtitle, mirrored motion works better than matched motion. One exhales, the other inhales, and they share one rhythm.",
        ],
        next: [
          "Bring the grammar into product UI state changes. This portfolio is the first test.",
          "[Insert performance or engagement data for published pieces.]",
        ],
      },
    ],
  },
];

export const categories: ProjectCategory[] = ["Product UX", "AI Product", "Design Systems", "UX Writing", "Motion"];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  const n = projects.length;
  return { prev: projects[(i - 1 + n) % n], next: projects[(i + 1) % n] };
}
