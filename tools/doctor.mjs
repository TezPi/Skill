#!/usr/bin/env node
// doctor.mjs — is this session ready to make motion? Exit 1 lists what to fix.
//   npm run doctor            human output
//   npm run doctor -- --json  machine output

import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const HOME = homedir();
const PIN = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).config.hyperframes;
const run = (cmd, args, cwd = ROOT) => spawnSync(cmd, args, { cwd, encoding: "utf8" });
const checks = [];
const check = (name, ok, fix) => checks.push({ name, ok: !!ok, fix: ok ? undefined : fix });

const [major] = process.versions.node.split(".").map(Number);
check(`node ${process.versions.node} (≥22)`, major >= 22, "install Node 22+");
check("ffmpeg + ffprobe", run("ffmpeg", ["-version"]).status === 0 && run("ffprobe", ["-version"]).status === 0, "install ffmpeg");

const hfChrome = join(HOME, ".cache", "hyperframes", "chrome", "chrome-headless-shell");
check("HyperFrames pinned Chrome", existsSync(hfChrome) && readdirSync(hfChrome).length > 0, `npx --yes hyperframes@${PIN} browser ensure`);

check("root deps (gsap, Inter)", existsSync(join(ROOT, "node_modules", "gsap", "dist", "gsap.min.js")), "npm install");
check("remotion deps", existsSync(join(ROOT, "remotion", "node_modules", "remotion")), "npm --prefix remotion install");

const HF_SKILLS = ["hyperframes", "hyperframes-core", "hyperframes-animation", "hyperframes-cli", "hyperframes-registry"];
const missing = HF_SKILLS.filter((s) => !existsSync(join(HOME, ".claude", "skills", s, "SKILL.md")));
check("official HyperFrames skills", !missing.length, `npx --yes hyperframes@${PIN} skills update   (missing: ${missing.join(", ")})`);

const plugin = run("sh", ["-c", `ls -d ${HOME}/.claude/plugins/*/*/tezpi-motion ${HOME}/.claude/plugins/*/tezpi-motion 2>/dev/null | head -1`]).stdout.trim();
check("tezpi-motion plugin", plugin, "install the tezpi-motion plugin (skills: motion-forge, motion-doctrine, cut-the-curve, …)");

check("tokens fresh", run(process.execPath, ["tools/build-tokens.mjs", "--check"]).status === 0, "npm run tokens");
check("film vendor/ fresh", run(process.execPath, ["tools/sync-film.mjs", "--check"]).status === 0, "npm run film:sync");

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ ok: checks.every((c) => c.ok), checks }, null, 2));
} else {
  for (const c of checks) console.log(`${c.ok ? "ok  " : "FIX "} ${c.name}${c.fix ? `\n       → ${c.fix}` : ""}`);
  console.log(checks.every((c) => c.ok) ? "\nready: npm run film:new -- <slug> · npm run film:qa -- <slug>" : "\nnot ready — run the fixes above (or: bash .claude/hooks/session-start.sh)");
}
process.exit(checks.every((c) => c.ok) ? 0 : 1);
