#!/usr/bin/env node
// sync-film.mjs — snapshot shared runtime assets into a film's vendor/ folder.
//
//   node tools/sync-film.mjs                 # every film under films/
//   node tools/sync-film.mjs <slug> [...]    # specific films
//   node tools/sync-film.mjs --check         # exit 1 if any film's vendor/ drifted
//
// Films never load from a CDN: the agent egress proxy blocks jsDelivr, and HyperFrames
// blocks a render whose timeline script fails to load. Each film carries its own copy
// (like its pinned CLI) so it re-renders identically after the shared tokens move on.

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const FILMS = join(ROOT, "films");
const tokens = JSON.parse(readFileSync(join(ROOT, "motion", "tokens.json"), "utf8"));

export const VENDOR_FILES = [
  ["gsap.min.js", join(ROOT, "node_modules", "gsap", "dist", "gsap.min.js")],
  ["tokens.css", join(ROOT, "motion", "dist", "tokens.css")],
  ["tokens.js", join(ROOT, "motion", "dist", "tokens.js")],
  ["tezpi-motion.js", join(ROOT, "motion", "hf", "tezpi-motion.js")],
  [`fonts/${tokens.font.sans.file}`, join(ROOT, "node_modules", "@fontsource-variable", "inter", "files", tokens.font.sans.file)],
];

export function listFilms() {
  if (!existsSync(FILMS)) return [];
  return readdirSync(FILMS).filter((d) => existsSync(join(FILMS, d, "index.html")) && statSync(join(FILMS, d)).isDirectory());
}

export function syncFilm(slug, { check = false } = {}) {
  let drift = 0;
  for (const [rel, src] of VENDOR_FILES) {
    if (!existsSync(src)) throw new Error(`missing ${src.slice(ROOT.length + 1)} — run: npm install && npm run tokens`);
    const dest = join(FILMS, slug, "vendor", rel);
    const body = readFileSync(src);
    const same = existsSync(dest) && Buffer.compare(readFileSync(dest), body) === 0;
    if (same) continue;
    drift++;
    if (check) console.log(`STALE films/${slug}/vendor/${rel}`);
    else {
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, body);
      console.log(`synced films/${slug}/vendor/${rel}`);
    }
  }
  return drift;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  const slugs = args.filter((a) => !a.startsWith("--"));
  const targets = slugs.length ? slugs : listFilms();
  let drift = 0;
  for (const slug of targets) drift += syncFilm(slug, { check });
  if (check && drift) {
    console.error(`\n${drift} vendored file(s) stale — run: npm run film:sync`);
    process.exit(1);
  }
  if (!drift) console.log(`vendor/ up to date for ${targets.length} film(s)`);
}
