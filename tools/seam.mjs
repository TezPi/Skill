#!/usr/bin/env node
// seam.mjs — run the vendored Seam Gate pair against a film, pinned to that film's CLI.
//
//   npm run seam:stamp -- <slug>            # ledger.json → <seams:auto> block in index.html
//   npm run seam:gate  -- <slug> [--json]   # numeric verify; exit 0 = gate passed
//   npm run seam:probe -- <slug> --t 2.6    # list movers around a cut (author ledger rows)

import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const [mode, slug, ...rest] = process.argv.slice(2);
if (!["stamp", "gate", "probe"].includes(mode) || !slug) {
  console.error("usage: seam.mjs <stamp|gate|probe> <film-slug> [extra args]");
  process.exit(2);
}
const film = join(ROOT, "films", slug);
if (!existsSync(join(film, "index.html"))) {
  console.error(`no film at films/${slug}`);
  process.exit(2);
}

// The film's package.json pins hyperframes@X.Y.Z; the gate must measure that runtime.
const pkg = JSON.parse(readFileSync(join(film, "package.json"), "utf8"));
const pin = (pkg.scripts?.check || "").match(/hyperframes@([\w.-]+)/)?.[1] ?? "latest";
const serverCmd = `npx --yes hyperframes@${pin} preview --foreground --no-open --port {port}`;

const tool = (name) => join(ROOT, "tools", "tezpi", name);
const ledger = join(film, "ledger.json");
const argv =
  mode === "stamp"
    ? [tool("seam-stamp.mjs"), "--ledger", ledger, "--write", join(film, "index.html"), ...rest]
    : [tool("seam-gate.mjs"), mode === "gate" ? "verify" : "probe", ...(mode === "gate" ? ["--ledger", ledger] : []),
       "--project", film, "--server-cmd", serverCmd, ...rest];

const r = spawnSync(process.execPath, argv, { stdio: "inherit", cwd: film });
process.exit(r.status ?? 1);
