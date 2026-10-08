#!/usr/bin/env node
// film-qa.mjs — the motion-forge §10 validation gate for one HyperFrames film, in order.
//
//   npm run film:qa -- <slug>              # all gates; exit 0 = ready to show for approval
//   npm run film:qa -- <slug> --no-sheet   # skip the seam contact sheet
//
// 1. tokens  — motion/dist + remotion tokens match motion/tokens.json
// 2. vendor  — the film's vendor/ snapshot matches the shared sources
// 3. check   — hyperframes check --strict (lint, runtime, layout, *.motion.json, WCAG)
// 4. seams   — Seam Gate numeric verify against ledger.json
// 5. sheet   — snapshots at cut−2f / cut / cut+2f per seam → films/<slug>/.qa/contact-sheet.jpg
//
// Rendering is NOT part of QA: preview for approval first, then render.

import { spawnSync } from "node:child_process";
import { readFileSync, existsSync, rmSync, mkdirSync, renameSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--"));
if (!slug) {
  console.error("usage: film-qa.mjs <film-slug> [--no-sheet]");
  process.exit(2);
}
const film = join(ROOT, "films", slug);
const pkg = JSON.parse(readFileSync(join(film, "package.json"), "utf8"));
const pin = (pkg.scripts?.check || "").match(/hyperframes@([\w.-]+)/)?.[1] ?? "latest";
const hf = (...a) => ["npx", ["--yes", `hyperframes@${pin}`, ...a]];

const results = [];
function gate(name, [cmd, argv], cwd = ROOT) {
  process.stdout.write(`\n━━ ${name} ━━\n`);
  const r = spawnSync(cmd, argv, { cwd, stdio: "inherit" });
  const ok = r.status === 0;
  results.push([name, ok]);
  return ok;
}

gate("tokens", [process.execPath, ["tools/build-tokens.mjs", "--check"]]);
gate("vendor", [process.execPath, ["tools/sync-film.mjs", slug, "--check"]]);
gate("check --strict", hf("check", "--strict"), film);
gate("seam gate", [process.execPath, ["tools/seam.mjs", "gate", slug]]);

if (!args.includes("--no-sheet")) {
  const { fps = 30, seams = [] } = JSON.parse(readFileSync(join(film, "ledger.json"), "utf8"));
  const f2 = 2 / fps;
  const at = seams.flatMap((s) => [s.cut - f2, s.cut, s.cut + f2]).map((t) => +t.toFixed(3));
  if (at.length) {
    rmSync(join(film, "snapshots"), { recursive: true, force: true });
    const ok = gate("seam contact sheet", hf("snapshot", "--at", at.join(",")), film);
    if (ok) {
      const qa = join(film, ".qa");
      rmSync(qa, { recursive: true, force: true });
      mkdirSync(qa, { recursive: true });
      for (const f of readdirSync(join(film, "snapshots"))) renameSync(join(film, "snapshots", f), join(qa, f));
      rmSync(join(film, "snapshots"), { recursive: true, force: true });
      console.log(`\nsheet: films/${slug}/.qa/contact-sheet.jpg — per seam, in ledger order: cut−2f · cut · cut+2f`);
      console.log("look for: exit still moving · entry mid-flight · one side per frame · Z sign matched · no white flash");
    }
  }
}

console.log("\n━━ summary ━━");
for (const [name, ok] of results) console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
const failed = results.filter(([, ok]) => !ok).length;
console.log(failed ? `\nFILM QA: FAILED (${failed})` : "\nFILM QA: PASSED — open the Studio preview for approval before rendering");
process.exit(failed ? 1 : 0);
