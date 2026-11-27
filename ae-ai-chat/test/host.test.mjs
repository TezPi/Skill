// Runs host/host.jsx in a Node VM with a mocked AE object model and drives it exactly the way
// the panel does: lit() builds the evalScript call, the host answers with JSON.
import assert from "node:assert/strict";
import fs, { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { lit, parseDescription } from "../src/agent.ts";

// Minimal ExtendScript File/Folder/$ backed by the real filesystem.
const isDir = (p) => fs.existsSync(p) && fs.statSync(p).isDirectory();
function File(p) {
  if (!new.target) return isDir(p) ? new Folder(p) : new File(p); // File() returns a Folder for folders
  this.fsName = path.resolve(p);
  this.name = encodeURIComponent(path.basename(p));
}
Object.defineProperty(File.prototype, "exists", { get() { return fs.existsSync(this.fsName) && !isDir(this.fsName); } });
File.prototype.open = function () { try { this.buf = readFileSync(this.fsName, "utf8"); this.pos = 0; return true; } catch { return false; } };
File.prototype.read = function (n) { const s = this.buf.slice(this.pos, n === undefined ? undefined : this.pos + n); this.pos += s.length; return s; };
File.prototype.close = function () { this.buf = null; };
File.decode = decodeURIComponent;
class Folder {
  constructor(p) { this.fsName = path.resolve(p); this.name = encodeURIComponent(path.basename(p)); }
  get exists() { return isDir(this.fsName); }
  getFiles() { return fs.readdirSync(this.fsName).map((n) => { const f = path.join(this.fsName, n); return isDir(f) ? new Folder(f) : new File(f); }); }
}

class CompItem {} class AVLayer {} class TextLayer extends AVLayer {} class ShapeLayer extends AVLayer {}
class CameraLayer {} class LightLayer {} class SolidSource {}
const undo = [];
const layer = (C, props) => Object.assign(new C(), { enabled: true, locked: false, inPoint: 0, outPoint: 5, parent: null, property: () => null, ...props });
const comp = Object.assign(new CompItem(), {
  name: "Main", width: 1920, height: 1080, pixelAspect: 1, frameRate: 30, duration: 10, time: 1.5,
  workAreaStart: 0, workAreaDuration: 10, numLayers: 3,
});
const layers = [
  layer(TextLayer, { index: 1, name: 'Title "quoted"\nline2' }),
  layer(ShapeLayer, { index: 2, name: "Shape", property: () => ({ numProperties: 1, property: () => ({ name: "Gaussian Blur" }) }) }),
  layer(CameraLayer, { index: 3, name: "Cam" }),
];
layers[0].parent = layers[2];
comp.layer = (i) => layers[i - 1];
comp.selectedLayers = [layers[1]];
const app = {
  project: { file: null, numItems: 1, item: () => comp, activeItem: comp },
  beginUndoGroup: (n) => undo.push(`begin:${n}`),
  endUndoGroup: () => undo.push("end"),
};

const ctx = vm.createContext({ app, CompItem, TextLayer, ShapeLayer, CameraLayer, LightLayer, SolidSource, File, Folder });
ctx.$ = { global: ctx, evalFile: (f) => vm.runInContext(readFileSync(f.fsName, "utf8"), ctx) };
vm.runInContext(readFileSync(new URL("../host/host.jsx", import.meta.url), "utf8"), ctx);
const call = (fn, ...args) => JSON.parse(vm.runInContext(`${fn}(${args.map(lit).join(",")})`, ctx));

// 1. Model code with every escaping hazard survives the trip and runs as one undo group.
const tricky = 'Tiêu đề "AI" \\ \t \u2028 \u2029 \u0001 \n end';
let r = call("aiRun", `var s = ${JSON.stringify(tricky)};\nreturn { s: s, n: [1, 2.5, NaN], ok: true, obj: app.project.activeItem };`, 'Rename "x"');
assert.equal(r.ok, true);
assert.equal(r.result.s, tricky);
assert.deepEqual(r.result.n, [1, 2.5, null]);
assert.equal(typeof r.result.obj, "string"); // AE objects become strings, never recurse
assert.deepEqual(undo, ['begin:AI: Rename "x"', "end"]);
// ES3 (AE) treats raw U+2028/2029 as line breaks: neither side may emit them unescaped.
assert.doesNotMatch(lit(tricky), /[\u2028\u2029]/);
assert.doesNotMatch(vm.runInContext(`aiQuote(${lit(tricky)})`, ctx), /[\u2028\u2029]/);

// 2. Runtime and syntax errors come back as ok:false and still close the undo group.
undo.length = 0;
r = call("aiRun", "throw new Error('boom');", "Fail");
assert.equal(r.ok, false);
assert.match(r.error, /boom/);
assert.deepEqual(undo, ["begin:AI: Fail", "end"]);
assert.equal(call("aiRun", "var = ;", "Syntax").ok, false);
assert.deepEqual(call("aiRun", "var x = 1;", "No return"), { ok: true, result: null });

// 3. Context snapshot describes the comp the way the system prompt promises.
const c = call("aiContext");
assert.equal(c.project, "(unsaved)");
assert.deepEqual(c.comps, ["Main"]);
assert.equal(c.activeComp.name, "Main");
assert.deepEqual(c.activeComp.selectedLayers, [2]);
assert.deepEqual(c.activeComp.workArea, [0, 10]);
assert.deepEqual(c.activeComp.layers.map((l) => l.type), ["text", "shape", "camera"]);
assert.equal(c.activeComp.layers[0].name, 'Title "quoted"\nline2');
assert.equal(c.activeComp.layers[0].parent, 3);
assert.deepEqual(c.activeComp.layers[1].effects, ["Gaussian Blur"]);

// 4. Skill library, against the real vendored skills/ folder.
const root = fileURLToPath(new URL("../skills", import.meta.url));
const idx = call("aiSkillIndex", root);
assert.equal(idx.ok, true);
assert.equal(idx.skills.length, 24);
for (const s of idx.skills) {
  const d = parseDescription(s.head);
  assert.ok(d.length > 50 && !d.startsWith('"'), `description of ${s.name} parses`);
}
let rd = call("aiSkillRead", root, "ae-automation-architect/SKILL.md");
assert.equal(rd.ok, true);
assert.match(rd.text, /AE-1/);
rd = call("aiSkillRead", root, "ae-automation-architect/");
assert.ok(rd.files.includes("scripts/sft_depth_soul.jsx"));
assert.equal(call("aiSkillRead", root, "code-remotion").truncated, true); // 1.3k files, capped
assert.equal(call("aiSkillRead", root, "../package.json").ok, false);
assert.equal(call("aiSkillRead", root, "motion-foundation-core/references/library/assets/Motion_Grid_20_Layouts.png").ok, false);
assert.equal(call("aiSkillRead", root, "nope/SKILL.md").ok, false);

// 5. The real Depth & Soul library loads into the global scope run_extendscript code sees.
assert.deepEqual(call("aiLoadLib", `${root}/ae-automation-architect/scripts/sft_depth_soul.jsx`), { ok: true });
assert.equal(call("aiRun", "return typeof SFT_DS.stagger;", "Probe").result, "function");

console.log("host bridge: all checks passed");
