// UI layer: DOM rendering + settings. All AE/Claude logic lives in agent.ts.
import Anthropic from "@anthropic-ai/sdk";
import { Chat, DEFAULT_AGENTS, MODELS, aeContext, aeUndo, loadSkills, type Agent, type AgentEvents, type Model, type Settings } from "./agent";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const log = $<HTMLElement>("log");
const empty = $<HTMLElement>("empty");
const form = $<HTMLFormElement>("composer");
const input = $<HTMLTextAreaElement>("input");
const send = $<HTMLButtonElement>("send");
const ctxChip = $<HTMLElement>("ctx");
const dialog = $<HTMLDialogElement>("settings");

/* ---------- settings (localStorage can throw in locked-down hosts) ---------- */

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6); // randomUUID needs Chromium 92+
function loadSettings(): Settings {
  let saved: Partial<Settings> = {};
  try { saved = JSON.parse(localStorage.getItem("ae-ai-chat") || "{}"); } catch { /* defaults */ }
  const agents = saved.agents?.length ? saved.agents : DEFAULT_AGENTS;
  return { apiKey: saved.apiKey ?? "", review: saved.review ?? false, agents, activeAgent: saved.activeAgent ?? agents[0].id };
}
let settings = loadSettings();
const activeAgent = () => settings.agents.find((a) => a.id === settings.activeAgent) ?? settings.agents[0];

function persist() {
  try { localStorage.setItem("ae-ai-chat", JSON.stringify(settings)); } catch { /* session-only */ }
}

/* agent picker in the composer */
const agentSelect = $<HTMLSelectElement>("agent");
const modelShort = (m: Model) => MODELS[m].split(" — ")[0];
function renderAgentSelect() {
  agentSelect.replaceChildren(...settings.agents.map((a) => new Option(`${a.name} · ${modelShort(a.model)}`, a.id)));
  agentSelect.value = activeAgent().id;
}
agentSelect.addEventListener("change", () => { settings.activeAgent = agentSelect.value; persist(); });
renderAgentSelect();

/* settings dialog: API key, review toggle, agent list */
const agentList = $<HTMLElement>("agent-list");
const rowTpl = $<HTMLTemplateElement>("agent-row");
const modelOptions = () => (Object.keys(MODELS) as Model[]).map((m) => new Option(MODELS[m], m));
const syncDeleteButtons = () =>
  agentList.querySelectorAll<HTMLButtonElement>(".a-del").forEach((b) => (b.disabled = agentList.children.length === 1));

function addAgentRow(a: Agent) {
  const row = (rowTpl.content.cloneNode(true) as DocumentFragment).firstElementChild as HTMLElement;
  row.dataset.id = a.id;
  row.querySelector<HTMLInputElement>(".a-name")!.value = a.name;
  const model = row.querySelector<HTMLSelectElement>(".a-model")!;
  model.append(...modelOptions());
  model.value = a.model;
  row.querySelector<HTMLTextAreaElement>(".a-instr")!.value = a.instructions;
  row.querySelector(".a-del")!.addEventListener("click", () => { row.remove(); syncDeleteButtons(); });
  agentList.append(row);
  syncDeleteButtons();
  return row;
}
$("add-agent").addEventListener("click", () => {
  addAgentRow({ id: newId(), name: "", model: "claude-sonnet-5-5", instructions: "" }).querySelector<HTMLInputElement>(".a-name")!.focus();
});

function openSettings() {
  $<HTMLInputElement>("key").value = settings.apiKey;
  $<HTMLInputElement>("review").checked = settings.review;
  agentList.replaceChildren();
  settings.agents.forEach(addAgentRow);
  dialog.showModal();
}
dialog.addEventListener("close", () => {
  if (dialog.returnValue !== "save") return;
  const agents = [...agentList.children].map((row, i): Agent => ({
    id: (row as HTMLElement).dataset.id!,
    name: row.querySelector<HTMLInputElement>(".a-name")!.value.trim() || `Agent ${i + 1}`,
    model: row.querySelector<HTMLSelectElement>(".a-model")!.value as Model,
    instructions: row.querySelector<HTMLTextAreaElement>(".a-instr")!.value,
  }));
  settings = { ...settings, apiKey: $<HTMLInputElement>("key").value.trim(), review: $<HTMLInputElement>("review").checked, agents };
  settings.activeAgent = activeAgent().id; // falls back to the first agent if the active one was deleted
  persist();
  renderAgentSelect();
});
$("open-settings").addEventListener("click", openSettings);

/* ---------- match AE's panel color so the panel feels native ---------- */

try {
  const c = JSON.parse(window.__adobe_cep__!.getHostEnvironment()).appSkinInfo.panelBackgroundColor.color;
  if (c.red + c.green + c.blue < 3 * 90) document.documentElement.style.setProperty("--bg", `rgb(${c.red | 0},${c.green | 0},${c.blue | 0})`);
} catch { /* browser preview: keep CSS default */ }

/* ---------- active comp chip: tells the user what the AI will act on ---------- */

async function refreshContext() {
  let c; // object = comp, null = AE but no comp, undefined = no AE
  try { c = window.__adobe_cep__ ? JSON.parse(await aeContext()).activeComp : undefined; } catch { c = undefined; }
  ctxChip.classList.toggle("off", !c);
  ctxChip.textContent = c ? `${c.name} · ${c.selectedLayers.length ? `${c.selectedLayers.length} selected` : "no selection"}`
    : c === null ? "No active comp — open a composition" : "Not connected to After Effects";
}
window.addEventListener("focus", refreshContext);
refreshContext();

// Index skills + preload SFT_DS now, so the first message doesn't wait on it.
loadSkills().then((sk) => {
  if (!sk) return;
  const hint = $<HTMLElement>("skills-hint");
  hint.textContent = `${sk.index.length} SFT Motion skills ready${sk.sftDs ? " · SFT_DS rig loaded" : ""}`;
  hint.hidden = false;
});

/* ---------- rendering ---------- */

const typing = Object.assign(document.createElement("div"), { className: "typing", ariaLabel: "Claude is working" });
typing.innerHTML = "<span></span><span></span><span></span>";

function append(el: HTMLElement) {
  const atBottom = log.scrollHeight - log.scrollTop - log.clientHeight < 48; // don't yank users who scrolled up
  log.append(el);
  if (typing.isConnected) log.append(typing); // keep the indicator last
  if (atBottom) log.scrollTop = log.scrollHeight;
  return el;
}
function bubble(cls: string, text = "") {
  return append(Object.assign(document.createElement("div"), { className: `msg ${cls}`, textContent: text }));
}

const approvals = new Map<string, (ok: boolean) => void>();
let text: HTMLElement | null = null;

const events: AgentEvents = {
  onText(delta) {
    text ??= bubble("ai");
    text.textContent += delta;
    if (log.scrollHeight - log.scrollTop - log.clientHeight < 96) log.scrollTop = log.scrollHeight;
  },
  onStepStart(id, label, code) {
    text = null; // text after a step goes in a new bubble, keeping order readable
    const step = document.createElement("details");
    step.className = "step running";
    step.id = id;
    step.innerHTML = `<summary><span class="status" aria-hidden="true"></span><span class="label"></span></summary><pre class="code"></pre>`;
    step.querySelector(".label")!.textContent = label;
    step.querySelector(".code")!.textContent = code;
    if (!code) step.classList.add("plain"); // skill reads: nothing to expand
    append(step);
  },
  onStepEnd(id, ok, output) {
    const step = $(id);
    step.classList.remove("running", "pending");
    step.classList.add(ok ? "ok" : "fail");
    step.querySelector(".review")?.remove();
    if (!ok) {
      let msg = output;
      try { const r = JSON.parse(output); msg = r.error + (r.line ? ` (line ${r.line})` : ""); } catch { /* raw */ }
      const out = Object.assign(document.createElement("pre"), { className: "out", textContent: msg });
      step.append(out);
    }
  },
  approve(id) {
    const step = $(id) as HTMLDetailsElement;
    step.classList.replace("running", "pending");
    step.open = true;
    const bar = Object.assign(document.createElement("div"), { className: "review" });
    bar.innerHTML = `<button type="button" class="btn ghost" data-ok="0">Skip</button><button type="button" class="btn primary" data-ok="1">Run</button>`;
    step.append(bar);
    typing.remove(); // waiting on the user, not on Claude
    (bar.lastElementChild as HTMLButtonElement).focus();
    return new Promise((resolve) => {
      approvals.set(id, resolve);
      bar.addEventListener("click", (e) => {
        const ok = (e.target as HTMLElement).dataset.ok;
        if (ok === undefined) return;
        approvals.delete(id);
        step.classList.replace("pending", "running");
        append(typing);
        resolve(ok === "1");
      });
    });
  },
};

function errorMessage(err: unknown) {
  if (err instanceof Anthropic.APIUserAbortError) return "Stopped.";
  if (err instanceof Anthropic.AuthenticationError) return "Invalid API key. Check Settings.";
  if (err instanceof Anthropic.RateLimitError) return "Rate limited. Try again in a moment.";
  if (err instanceof Anthropic.APIConnectionError) return "Can't reach the Anthropic API. Check your connection.";
  if (err instanceof Anthropic.APIError) {
    // show the API's own sentence, not "400 {json}"
    const msg = (err.error as { error?: { message?: string } } | undefined)?.error?.message;
    return msg ?? `API error ${err.status ?? ""}: ${err.message}`;
  }
  return err instanceof Error ? err.message : String(err);
}

/* ---------- send / stop ---------- */

let chat = new Chat();
let running: AbortController | null = null;

function setRunning(on: boolean) {
  send.classList.toggle("stop", on);
  send.setAttribute("aria-label", on ? "Stop" : "Send");
  send.title = on ? "Stop" : "Send (Enter)";
  if (on) append(typing); else typing.remove();
}

async function submit(prompt: string) {
  if (!prompt.trim() || running) return;
  if (!settings.apiKey) { openSettings(); $("key").focus(); return; }
  empty.hidden = true;
  const agent = activeAgent();
  // label which agent/model handled the turn once there's a choice to make
  if (settings.agents.length > 1) bubble("user", prompt).dataset.agent = `${agent.name} · ${modelShort(agent.model)}`;
  else bubble("user", prompt);
  input.value = "";
  autosize();
  text = null;
  running = new AbortController();
  setRunning(true);
  try {
    await chat.send(prompt, settings, agent, events, running.signal);
  } catch (err) {
    bubble(err instanceof Anthropic.APIUserAbortError ? "note" : "error", errorMessage(err));
  } finally {
    running = null;
    setRunning(false);
    refreshContext();
    input.focus();
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (running) {
    running.abort();
    approvals.forEach((resolve) => resolve(false)); // unblock a pending review so the loop can exit
    approvals.clear();
  } else submit(input.value);
});

input.addEventListener("keydown", (e) => {
  // isComposing: don't send mid-IME (Vietnamese/CJK input methods confirm with Enter)
  if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); }
});
function autosize() {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 160)}px`;
}
input.addEventListener("input", autosize);

empty.addEventListener("click", (e) => {
  const chip = (e.target as HTMLElement).closest<HTMLButtonElement>(".chip");
  if (chip) submit(chip.textContent!);
});

$("new").addEventListener("click", () => {
  if (running) return;
  chat = new Chat();
  log.replaceChildren(empty);
  empty.hidden = false;
  input.focus();
});

$("undo").addEventListener("click", async () => {
  await aeUndo();
  refreshContext();
});

input.focus();
