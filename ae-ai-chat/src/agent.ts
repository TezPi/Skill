// Business logic: AE bridge + Claude tool-use loop. No DOM access here.
import Anthropic from "@anthropic-ai/sdk";

type Msg = Anthropic.Beta.BetaMessageParam;
type ToolUse = Anthropic.Beta.BetaToolUseBlock;
type ToolResult = Anthropic.Beta.BetaToolResultBlockParam;

export const MODELS = {
  "claude-opus-5-5": "Opus 5.5 — best results",
  "claude-sonnet-5-5": "Sonnet 5.5 — faster",
  "claude-haiku-5-5": "Haiku 5.5 — fastest",
} as const;
export type Model = keyof typeof MODELS;

/** A named preset: its own model plus optional role instructions added to the system prompt. */
export interface Agent { id: string; name: string; model: Model; instructions: string }
export interface Settings { apiKey: string; review: boolean; agents: Agent[]; activeAgent: string }

export interface AgentEvents {
  onText(delta: string): void;
  onStepStart(id: string, label: string, code: string): void;
  onStepEnd(id: string, ok: boolean, output: string): void;
  /** Only called when Settings.review is on. Resolve false to skip the code. */
  approve(id: string): Promise<boolean>;
}

/* ---------- After Effects bridge (CEP → ExtendScript in host/host.jsx) ---------- */

declare global {
  interface Window {
    __adobe_cep__?: {
      evalScript(script: string, cb: (result: string) => void): void;
      getHostEnvironment(): string;
      getSystemPath(type: "extension"): string;
    };
  }
}

// JSON string literal is a valid ES3 literal, except U+2028/2029 which ES3 treats as line breaks.
export const lit = (s: string) => JSON.stringify(s).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");

function host(fn: string, ...args: string[]): Promise<string> {
  const cep = window.__adobe_cep__;
  if (!cep) return Promise.resolve(JSON.stringify({ ok: false, error: "Not running inside After Effects." }));
  return new Promise((resolve) =>
    cep.evalScript(`${fn}(${args.map(lit).join(",")})`, (r) =>
      // CEP returns this literal string when the host script itself fails to evaluate
      resolve(r === "EvalScript error." ? JSON.stringify({ ok: false, error: "Host script failed to evaluate." }) : r),
    ),
  );
}

export const aeContext = () => host("aiContext");
export const aeUndo = () => host("aiUndo");

/* ---------- SFT Super Motion Studio V2 skill library (skills/ inside the extension) ---------- */

export interface Skills { root: string; index: { name: string; description: string }[]; sftDs: boolean }

// "file:///C:/x" → "C:/x" (Windows), "file:///Users/x" → "/Users/x" (macOS)
const fsPath = (url: string) => decodeURI(url).replace(/^file:\/\/\/?(?=[A-Za-z]:)|^file:\/\//, "");

export const parseDescription = (head: string) => {
  const raw = head.match(/^description:\s*(.*)$/m)?.[1].trim() ?? "";
  try { return raw.startsWith('"') ? JSON.parse(raw) : raw; } catch { return raw.replace(/^["']|["']$/g, ""); }
};

let skills: Promise<Skills | null> | null = null;
/** Indexes the skills and preloads the Depth & Soul rig library (SFT_DS) once per panel session. */
export function loadSkills() {
  return (skills ??= (async () => {
    const cep = window.__adobe_cep__;
    if (!cep) return null;
    const root = `${fsPath(cep.getSystemPath("extension"))}/skills`;
    const idx = JSON.parse(await host("aiSkillIndex", root));
    if (!idx.ok || !idx.skills.length) return null;
    const lib = JSON.parse(await host("aiLoadLib", `${root}/ae-automation-architect/scripts/sft_depth_soul.jsx`));
    const index = (idx.skills as { name: string; head: string }[])
      .map((s) => ({ name: s.name, description: parseDescription(s.head) }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return { root, index, sftDs: lib.ok === true };
  })().catch(() => null));
}

/* ---------- Claude ---------- */

const SYSTEM = `You are an After Effects assistant running in a panel inside Adobe After Effects. You edit the user's open project directly through tools.

How you work:
- Each user message ends with <ae_context>: a JSON snapshot of the project and active comp taken right before the message. It is newer than any earlier snapshot.
- Make edits with run_extendscript. Each call becomes one undo step named after its label, so do one logical change per call and keep labels short and specific ("Add wiggle to 3 layers").
- After a non-trivial edit, verify it: have the script return what it changed, or call get_project_context.
- If the request is ambiguous in a way that changes the result (which layers, which comp), ask one short question instead of guessing. If the request says "selected" and nothing is selected, say so.
- Reply in the user's language in 1-3 short sentences of plain text, no markdown. Say what changed, not how.

ExtendScript rules (After Effects runs ES3):
- No let/const, arrow functions, template literals, classes, spread, JSON, Object.keys, or Array forEach/map/filter/indexOf. Use var and for loops.
- Collections are 1-indexed: comp.layer(1), project.item(1), prop.property(1). comp.selectedLayers is a normal 0-indexed array.
- Get the comp with app.project.activeItem and check instanceof CompItem.
- Address properties by matchName: layer.property("ADBE Transform Group").property("ADBE Position"), "ADBE Scale", "ADBE Rotate Z", "ADBE Opacity", "ADBE Anchor Point". Effects: layer.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2").
- Time is in seconds; one frame is comp.frameDuration. Keyframes: prop.setValueAtTime(t, v); easing: prop.setTemporalEaseAtKey(k, [new KeyframeEase(0, 75)]) with one ease per dimension. Expressions: prop.expression = "wiggle(2, 10)".
- Text: var p = layer.property("ADBE Text Properties").property("ADBE Text Document"); var td = p.value; td.text = "Hi"; td.fontSize = 72; p.setValue(td). New text layer: comp.layers.addText("Hi").
- Shapes: var g = comp.layers.addShape().property("ADBE Root Vectors Group").addProperty("ADBE Vector Group").property("ADBE Vectors Group"); then g.addProperty("ADBE Vector Shape - Rect") and g.addProperty("ADBE Vector Graphic - Fill").
- Colors are [r, g, b] from 0 to 1.
- Use return to report a small plain value (string, number, or arrays/objects of those). Never return AE objects.
- Never call app.beginUndoGroup/endUndoGroup, alert, confirm or prompt: the panel handles undo and UI.
- Never use system.callSystem, delete or overwrite files, save, close or quit unless the user explicitly asks.`;

function skillsSection(sk: Skills) {
  const lib = sk.sftDs
    ? `The Depth & Soul rig library (ae-automation-architect/scripts/sft_depth_soul.jsx) is preloaded in After Effects as SFT_DS. Call its helpers directly inside run_extendscript; if you use SFT_DS.run, pass false as the third argument because the panel already owns the undo group.`
    : `The Depth & Soul rig library (SFT_DS) failed to preload, so don't call it; write the equivalent ES3 yourself.`;
  return `SFT Super Motion Studio V2 skills:
You have the studio's skill library. Read a skill with read_skill ("<name>/SKILL.md") before applying it; files a skill links to are at "<name>/<relative path>", and a folder path lists its files.
${lib}
Skills sometimes say to run Python scripts, write files such as motion_plan.json, or hand over .jsx files. Here you can't run Python, so apply those checks yourself; keep plans in the chat unless the user asks for a file; and execute through run_extendscript instead of handing over scripts. After Effects is the host, so code-video engines (Remotion, GSAP, three.js...) matter only when the user asks for them.

${sk.index.map((s) => `- ${s.name}: ${s.description}`).join("\n")}`;
}

function systemPrompt(agent: Agent, sk: Skills | null) {
  let s = SYSTEM;
  if (sk) s += `\n\n${skillsSection(sk)}`;
  if (agent.instructions.trim()) s += `\n\nYour role in this panel ("${agent.name}"):\n${agent.instructions.trim()}`;
  return s;
}

/* Agent presets built on the plugin's pipeline. Users can edit/add agents in Settings. */
export const DEFAULT_AGENTS: Agent[] = [
  {
    id: "director", name: "Motion Director", model: "claude-opus-5-5",
    instructions: "Run requests through the SFT Super Motion Studio V2 pipeline: read motion-director/SKILL.md first and load the layers it routes to (senior-editor, sfc-super-motion-v1, ae-automation-architect, motion-foundation-core) at the depth the request needs. A one-property tweak needs the AE rules, not the full pipeline.",
  },
  {
    id: "technical", name: "AE Technical", model: "claude-sonnet-5-5",
    instructions: "You are the Technical Motion Director of ae-automation-architect. Read that skill before writing any script, expression or rig, follow DS-1..3 and AE-1..5, and build with the preloaded SFT_DS helpers where one fits.",
  },
  {
    id: "quick", name: "Quick edits", model: "claude-haiku-5-5",
    instructions: "Make the smallest change that does what was asked, with sensible defaults and no questions. Still use eased curves, never linear (DS-1). Read a skill only when the request needs a rig or expression you don't know.",
  },
  {
    // After Effects version of the plugin's motion-reviewer agent (that one grades web CSS/JS code through the Motion+ MCP server).
    id: "reviewer", name: "Motion Reviewer", model: "claude-sonnet-5-5",
    instructions: `You review the animation in the open comp; you don't edit unless the user asks.
Read ae-automation-architect (DS-1..3, AE-1..5) and senior-editor (the ME- tells) first. Inspect with read-only run_extendscript calls: keyframe times and values, temporal ease and influence, expressions, stagger between layers, secondary motion.
Grade every animated property: pass, or the law or tell it breaks with layer, property and time. Give each finding a concrete fix (curve token, stagger in frames, SFT_DS helper) and offer to apply the fixes.
Voice: Decisive, give a verdict and never "this might be off". Specific, name the layer, property and time. Quantified, "linear ease on 6 position keys", not "could feel mechanical". No false positives: a clean comp gets one line, because a padded report trains the reader to skim.`,
  },
];

const PAGE = 40_000; // chars per read_skill page (~10K tokens); some references run to 360 KB

const TOOLS: Anthropic.Beta.BetaTool[] = [
  {
    name: "read_skill",
    description: "Read a file from the SFT Super Motion Studio V2 skill library. path is relative to the library, e.g. \"motion-director/SKILL.md\" or a file a skill links to such as \"ae-automation-architect/references/ae-engine.md\". A folder path returns its file list. Long files come back in pages; pass the offset given at the end of a page to continue.",
    eager_input_streaming: true,
    input_schema: {
      type: "object",
      properties: {
        path: { type: "string" },
        offset: { type: "integer", description: "Character offset to continue a long file from. Default 0." },
      },
      required: ["path"],
      additionalProperties: false,
    },
  },
  {
    name: "get_project_context",
    description: "Read the current After Effects state: project name, comp list, active comp settings, current time, selected layers and the layer list (index, name, type, timing, parent, effects). Use it to re-check state after edits.",
    eager_input_streaming: true,
    input_schema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "run_extendscript",
    description: "Run ExtendScript (ES3) inside After Effects to read or edit the project. The code is a function body; use return to send back a JSON-serializable result. The whole call is one undo step. Errors come back with the message and line.",
    eager_input_streaming: true, // code can be long; stream it instead of waiting for the server to buffer it
    input_schema: {
      type: "object",
      properties: {
        label: { type: "string", description: "Short name of the change, shown to the user and used as the undo step name, e.g. \"Stagger 5 layers by 4 frames\"." },
        code: { type: "string", description: "ExtendScript function body." },
      },
      required: ["label", "code"],
      additionalProperties: false,
    },
  },
];

let stepSeq = 0;

async function runTool(t: ToolUse, s: Settings, ev: AgentEvents): Promise<ToolResult> {
  const result = (content: string, is_error = false): ToolResult => ({ type: "tool_result", tool_use_id: t.id, content, is_error });
  const input = t.input as Record<string, unknown>;

  if (t.name === "get_project_context") return result(await aeContext());
  if (t.name === "read_skill") {
    const offset = input.offset ?? 0;
    if (typeof input.path !== "string" || !input.path.trim() || typeof offset !== "number" || !Number.isInteger(offset) || offset < 0) {
      return result(JSON.stringify({ INVALID_JSON: JSON.stringify(t.input) }), true);
    }
    const sk = await loadSkills();
    if (!sk) return result("The skill library is not available in this session.", true);
    const id = `step-${++stepSeq}`;
    ev.onStepStart(id, `Read ${input.path}${offset ? ` (from ${offset})` : ""}`, "");
    const r = JSON.parse(await host("aiSkillRead", sk.root, input.path));
    ev.onStepEnd(id, r.ok === true, r.ok ? "" : JSON.stringify(r));
    if (!r.ok) return result(r.error, true);
    if (r.files) return result(`${r.files.join("\n")}${r.truncated ? "\n[list truncated at 400 entries; list a subfolder]" : ""}`);
    const page = r.text.slice(offset, offset + PAGE);
    const next = offset + PAGE;
    return result(next < r.text.length ? `${page}\n\n[showing ${offset}-${next} of ${r.text.length} chars; call read_skill with offset=${next} for more]` : page);
  }
  if (t.name !== "run_extendscript") return result(`Unknown tool: ${t.name}`, true);

  // eager_input_streaming skips server-side validation, so validate before running anything
  if (typeof input.code !== "string" || !input.code.trim() || typeof input.label !== "string") {
    return result(JSON.stringify({ INVALID_JSON: JSON.stringify(t.input) }), true);
  }
  const id = `step-${++stepSeq}`;
  ev.onStepStart(id, input.label, input.code);
  if (s.review && !(await ev.approve(id))) {
    ev.onStepEnd(id, false, "Skipped by user");
    return result("The user declined to run this code.", true);
  }
  const out = await host("aiRun", input.code, input.label);
  let ok = false;
  try { ok = JSON.parse(out).ok === true; } catch { /* non-JSON = failure */ }
  ev.onStepEnd(id, ok, out);
  return result(out, !ok);
}

// After a mid-output server-side fallback, blocks other than text that precede the last
// fallback block must not be echoed back (and their tool calls must not run).
function echoable(content: Anthropic.Beta.BetaContentBlock[]) {
  const last = content.map((b) => b.type).lastIndexOf("fallback");
  return last < 0 ? content : content.filter((b, i) => i >= last || b.type === "text" || b.type === "fallback");
}

export class Chat {
  messages: Msg[] = [];

  /** One user turn: streams text, runs tools until Claude stops. Throws SDK errors (incl. abort). */
  // Switching agents mid-chat is safe: history is never edited, and the API drops (unbilled)
  // thinking blocks the new model can't read.
  async send(text: string, s: Settings, agent: Agent, ev: AgentEvents, signal: AbortSignal) {
    const client = new Anthropic({ apiKey: s.apiKey, dangerouslyAllowBrowser: true });
    const system = systemPrompt(agent, await loadSkills());
    this.messages.push({
      role: "user",
      content: [{ type: "text", text }, { type: "text", text: `<ae_context>\n${await aeContext()}\n</ae_context>` }],
    });
    // Haiku 5.5 has no server-side fallback; Opus/Sonnet 5.5 retry declined requests on Anthropic's recommended model.
    const fallback = agent.model === "claude-haiku-5-5" ? {} : { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const };
    let jsonRetries = 0;

    while (true) {
      const stream = client.beta.messages.stream(
        { model: agent.model, max_tokens: 64000, system, tools: TOOLS, messages: this.messages, cache_control: { type: "ephemeral" }, ...fallback },
        { signal },
      );
      stream.on("text", ev.onText);

      let msg: Anthropic.Beta.BetaMessage;
      try {
        msg = await stream.finalMessage();
        jsonRetries = 0;
      } catch (err) {
        // Unparseable tool JSON or a dropped connection: re-issue the turn. API errors (auth, rate limit, abort) bubble up.
        if (err instanceof Anthropic.APIError || jsonRetries++ >= 2) throw err;
        continue; // ponytail: text streamed before the failure shows twice in the UI; rare enough to accept
      }

      if (msg.stop_reason === "refusal") throw new Error("Claude declined this request. Try rephrasing it.");
      const content = echoable(msg.content);
      const toolUses = content.filter((b): b is ToolUse => b.type === "tool_use");
      if (toolUses.length && msg.stop_reason === "max_tokens") throw new Error("The response was cut off before the code finished. Try a smaller request.");

      this.messages.push({ role: "assistant", content });
      if (!toolUses.length) return;

      const results: ToolResult[] = [];
      for (const t of toolUses) {
        results.push(signal.aborted
          ? { type: "tool_result", tool_use_id: t.id, content: "Cancelled by the user.", is_error: true }
          : await runTool(t, s, ev));
      }
      this.messages.push({ role: "user", content: results }); // all results in one message, keeps history valid on abort too
      if (signal.aborted) throw new Anthropic.APIUserAbortError();
    }
  }
}
