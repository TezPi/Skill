#!/usr/bin/env node
// new-film.mjs — scaffold a HyperFrames film that follows the tezpi-motion authoring order:
// spec → ledger → stamp → scenes → verify.
//
//   npm run film:new -- <slug> [--scenes open:3,body:4,close:3] [--arrival] [--current left]
//
//   --scenes   name:seconds, in order. Each becomes compositions/<name>.html (a sub-composition
//              mounted at #el-<name>, the seam carrier).
//   --arrival  spend the reserved Z-backward vector on the LAST seam (inverse zoom = payoff).
//              Every other seam is cut-the-curve in the film's current.
//   --current  left (default) | right | up | down — the film's one dominant direction.
//
// The scaffold lints clean and passes the Seam Gate. `film:qa` WILL report motion_frozen until
// each scene owns a sustained-motion route (motion-doctrine Part 2) — that is the point.

import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, rmSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { syncFilm } from "./sync-film.mjs";

const ROOT = join(import.meta.dirname, "..");
const args = process.argv.slice(2);
const flag = (n, d) => {
  const i = args.indexOf("--" + n);
  return i >= 0 ? args[i + 1] : d;
};
const slug = args.find((a, i) => !a.startsWith("--") && !args[i - 1]?.match(/^--(scenes|current)$/));
if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  console.error("usage: new-film.mjs <kebab-slug> [--scenes open:3,body:4,close:3] [--arrival] [--current left]");
  process.exit(2);
}
const film = join(ROOT, "films", slug);
if (existsSync(film)) {
  console.error(`films/${slug} already exists — edit it instead`);
  process.exit(1);
}

const tokens = JSON.parse(readFileSync(join(ROOT, "motion", "tokens.json"), "utf8"));
const PIN = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).config.hyperframes;
const { width: W, height: H, fps } = tokens.canvas;
const AXES = { left: ["x", -1], right: ["x", 1], up: ["y", -1], down: ["y", 1] };
const current = flag("current", "left");
if (!AXES[current]) throw new Error(`--current must be one of ${Object.keys(AXES).join(", ")}`);
const [axis, dir] = AXES[current];
const arrival = args.includes("--arrival");

const scenes = flag("scenes", "open:3,body:4,close:3").split(",").map((s) => {
  const [name, sec] = s.split(":");
  if (!/^[a-z][a-z0-9-]*$/.test(name) || !(Number(sec) > 0)) throw new Error(`bad scene "${s}" (want name:seconds)`);
  return { name, dur: Number(sec) };
});
let t = 0;
for (const s of scenes) {
  s.start = +t.toFixed(3);
  t += s.dur;
}
const total = +t.toFixed(3);
const seams = scenes.slice(1).map((s, i) => {
  const z = arrival && i === scenes.length - 2;
  return {
    id: `${scenes[i].name}→${s.name}`,
    cut: s.start,
    technique: z ? "inverse zoom-through (arrival)" : `cut-the-curve ${current.toUpperCase()}`,
    ...(z ? { blur: tokens.motion.blur.text } : {}),
    exit: { selector: `#el-${scenes[i].name}`, axis: z ? "z" : axis, dir: z ? -1 : dir },
    entry: { selector: `#el-${s.name}`, axis: z ? "z" : axis, dir: z ? -1 : dir, ...(z ? { scanRoot: `#el-${s.name}` } : {}) },
  };
});
const entryOf = (name) => seams.find((s) => s.entry.selector === `#el-${name}`);

// ── 1. real HyperFrames scaffold (package.json pins, hyperframes.json, meta.json) ──
const init = spawnSync("npx", ["--yes", `hyperframes@${PIN}`, "init", slug, "--non-interactive"], {
  cwd: join(ROOT, "films"),
  stdio: ["ignore", "ignore", "inherit"],
});
if (init.status !== 0) process.exit(init.status ?? 1);
for (const f of ["CLAUDE.md", "AGENTS.md"]) rmSync(join(film, f), { force: true }); // root CLAUDE.md governs
mkdirSync(join(film, "compositions"), { recursive: true });

// ── 2. motion spec (plan BEFORE code) ──
const title = slug.replace(/-/g, " ");
writeFileSync(
  join(film, "motion-spec.md"),
  `# ${title} — motion spec

> Fill this in before touching scene code. Template: films/tezpi-sting/motion-spec.md.

## Intent

| | |
| --- | --- |
| Deliverable | ${total}s ${W}×${H} @ ${fps}fps — TODO: narrated? captions? |
| Host | HyperFrames — TODO: confirm via motion-forge §4 (switch to Remotion for GPU effects / true motion blur / R3F / data batch) |
| Audience | TODO |
| Lives | TODO (social, app embed, launch film) |

## Behavioral insight — one focal point per beat

| Beat | Eye must… | Motion's job |
| --- | --- | --- |
${scenes.map((s) => `| \`${s.name}\` | TODO | TODO |`).join("\n")}

## Beats (master clock, seconds)

| Scene | In | Out | Sustained-motion route | Content |
| --- | --- | --- | --- | --- |
${scenes.map((s) => `| \`${s.name}\` | ${s.start.toFixed(2)} | ${(s.start + s.dur).toFixed(2)} | TODO: staged reveals · camera with intent · sequenced UI life · animated sequences · cursor-led action | TODO |`).join("\n")}

## The current

**${current.toUpperCase()}.**${arrival ? " Reserved vector spent: Z backward (inverse zoom) = arrival, on the last seam." : ""}

## Seam ledger (mirrors \`ledger.json\` — edit the JSON, then \`npm run seam:stamp -- ${slug}\`)

| Cut | Seam | Exit vector | Entry vector | Carrier | Technique |
| --- | --- | --- | --- | --- | --- |
${seams.map((s) => `| ${s.cut.toFixed(2)} | ${s.id} | \`${s.exit.selector}\` ${s.exit.axis}${s.exit.dir > 0 ? "+" : "−"} | \`${s.entry.selector}\` ${s.entry.axis}${s.entry.dir > 0 ? "+" : "−"} | scene heroes | ${s.technique} |`).join("\n")}

Transition budget: ≤ 3 types. No crossfades.

## Gate

\`npm run film:qa -- ${slug}\`
`,
);

// ── 3. ledger ──
writeFileSync(join(film, "ledger.json"), JSON.stringify({ fps, seams }, null, 2) + "\n");

// ── 4. orchestrator: master timeline owns only the seams ──
const slots = scenes
  .map(
    (s) => `      <div id="el-${s.name}" data-composition-id="${s.name}" data-composition-src="compositions/${s.name}.html"
           data-start="${s.start}" data-duration="${s.dur}" data-track-index="1" data-width="${W}" data-height="${H}"></div>`,
  )
  .join("\n");
writeFileSync(
  join(film, "index.html"),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <!-- vendored, never CDN: the egress proxy blocks jsDelivr and a failed timeline script blocks render -->
    <link rel="stylesheet" href="vendor/tokens.css" />
    <script src="vendor/gsap.min.js"></script>
    <script src="vendor/tokens.js"></script>
    <script src="vendor/tezpi-motion.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: var(--canvas-deep); }
      /* seam-craft: opaque stage ground — seams open summed-opacity < 1 windows that flash white otherwise */
      #root {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: var(--canvas-deep, var(--canvas));
        color: var(--ink);
        font-family: var(--font-sans);
      }
      #ground { position: absolute; inset: 0; background: var(--canvas); }
      /* scene slots are the seam carriers (#el-*): seam-stamp drives them on this master timeline */
      [data-composition-id="main"] > div[data-composition-src] { position: absolute; inset: 0; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="${W}" data-height="${H}">
      <div id="ground"></div>

${slots}
    </div>

    <script>
      // Master timeline owns ONLY the seams. Scene motion lives in each sub-composition.
      // Plan: motion-spec.md · Vectors: ledger.json · Regenerate: npm run seam:stamp -- ${slug}
      var tl = gsap.timeline({ paused: true });

      // <seams:auto>
      // </seams:auto>

      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`,
);

// ── 5. scene sub-compositions ──
const D = tokens.motion.duration;
for (const [i, s] of scenes.entries()) {
  const seam = entryOf(s.name);
  const settle = !seam ? 0 : seam.entry.axis === "z" ? D.inverseZoom.entry : D.cutTheCurve.entry;
  const word = s.name.charAt(0).toUpperCase() + s.name.slice(1).replace(/-/g, " ");
  // first scene: hero cascades in. Later scenes: hero arrives COMPOSED inside the entering wrapper
  // (it is the seam's carrier — an empty entry carries nothing), secondary line stages in after settle.
  const heroMotion =
    i === 0
      ? `var heroIn = TZM.waterfallEntry(tl, [{ el: "#${s.name}-hero", weight: "heavy" }], 0.25);`
      : `gsap.set("#${s.name}-hero", { opacity: 1 }); // composed at the cut: the seam's carrier\n          var heroIn = ${settle};`;
  writeFileSync(
    join(film, "compositions", `${s.name}.html`),
    `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
    <template>
      <style>
        #root { position: absolute; inset: 0; container-type: inline-size; }
        [data-composition-id="${s.name}"] .center { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
        [data-composition-id="${s.name}"] .group { display: flex; flex-direction: column; align-items: center; gap: 40px; }
        #${s.name}-hero {
          display: inline-block;
          opacity: 0;
          font-size: var(--type-headline-size);
          font-weight: var(--type-headline-weight);
          letter-spacing: var(--type-headline-tracking);
          line-height: var(--type-headline-leading);
          white-space: nowrap;
        }
        #${s.name}-sub {
          display: inline-block;
          opacity: 0;
          font-size: var(--type-label-size);
          font-weight: var(--type-label-weight);
          letter-spacing: var(--type-label-tracking);
          text-transform: uppercase;
          color: var(--ink-muted);
        }
      </style>

      <!-- route: TODO — pick one (motion-doctrine Part 2) and name it here -->
      <div id="root" data-composition-id="${s.name}" data-width="${W}" data-height="${H}" data-duration="${s.dur}">
        <div class="center">
          <div class="group">
            <h2 id="${s.name}-hero">${word}</h2>
            <p id="${s.name}-sub">Assign a sustained-motion route</p>
          </div>
        </div>
      </div>

      <script>
        (function () {
          var tl = gsap.timeline({ paused: true });
          ${heroMotion}
          TZM.waterfallEntry(tl, [{ el: "#${s.name}-sub", weight: "light" }], heroIn + 0.2);
          // TODO: the route's beats go here. Primitives: TZM.waterfallEntry · nudge · cursorEnter/click/
          // cursorDrift/cursorExit · waterfallCut · rackFocus. Search before hand-building:
          //   npx hyperframes catalog --query "<the beat, in plain English>"
          window.__timelines["${s.name}"] = tl;
        })();
      </script>
    </template>
  </body>
</html>
`,
  );
}

// ── 6. motion intent sidecar (check gates on it) ──
writeFileSync(
  join(film, "index.motion.json"),
  JSON.stringify(
    {
      duration: total,
      maxStaticSec: 1.2,
      assertions: [
        { kind: "appearsBy", selector: `#${scenes[0].name}-hero`, bySec: 0.6 },
        ...scenes.slice(1).map((s, i) => ({ kind: "before", a: `#${scenes[i].name}-hero`, b: `#${s.name}-hero` })),
        { kind: "keepsMoving" },
      ],
    },
    null,
    2,
  ) + "\n",
);

// ── 7. vendor + stamp ──
syncFilm(slug);
const stamp = spawnSync(process.execPath, [join(ROOT, "tools", "seam.mjs"), "stamp", slug], { stdio: "inherit" });
if (stamp.status !== 0) process.exit(stamp.status ?? 1);

console.log(`
films/${slug} ready — ${scenes.length} scenes, ${seams.length} seams, ${total}s.

Next (doctrine order):
  1. motion-spec.md   fill intent, focal points, one sustained-motion route per scene
  2. ledger.json      adjust cuts / techniques → npm run seam:stamp -- ${slug}
  3. compositions/    build each scene's route with TZM primitives (tokens only, no magic numbers)
  4. npm run film:qa -- ${slug}    (motion_frozen fails until every scene keeps performing)
  5. npx hyperframes preview --background   (from films/${slug}) → approval → render`);
