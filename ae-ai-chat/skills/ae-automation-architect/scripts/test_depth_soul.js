// node test_depth_soul.js - checks the pure maths of sft_depth_soul.jsx outside After Effects:
// bezier -> KeyframeEase conversion, the 2-4 frame stagger window, and the expression strings
// (run in V8 against a minimal mock of the expression globals). It does not exercise the AE DOM.
const fs = require("fs");
const path = require("path");
const assert = require("assert");

global.$ = { global: global };
(0, eval)(fs.readFileSync(path.join(__dirname, "sft_depth_soul.jsx"), "utf8"));
const DS = global.SFT_DS;
const near = (a, b, tol) => Math.abs(a - b) <= tol;

// 1. cubic-bezier(0.16, 1, 0.3, 1): out 16% at 6.25x average speed, in 70% at rest.
let e = DS.bezierToEase(DS.CURVES.EXPO_OUT_PREMIUM);
assert(near(e.outInfluence, 16, 1e-9) && near(e.outRatio, 6.25, 1e-9));
assert(near(e.inInfluence, 70, 1e-9) && near(e.inRatio, 0, 1e-9));
e = DS.bezierToEase(DS.CURVES.SPRING_APPROACH);
assert(near(e.inRatio, 0.75, 1e-9), "spring approach must arrive with velocity");

// 2. Stagger: every gap inside 2-4 frames (4-8 at 60 fps), deterministic, not one interval by rule.
for (let seed = 0; seed < 50; seed++) {
  const g30 = DS.staggerGaps(8, 30, seed);
  assert(g30.every((g) => g >= 2 && g <= 4), "gap outside 2-4 f");
  assert.deepStrictEqual(g30, DS.staggerGaps(8, 30, seed));
  assert(DS.staggerGaps(8, 60, seed).every((g) => g >= 4 && g <= 8));
}
assert(new Set(DS.staggerGaps(8, 30, 7)).size > 1, "default seed must vary the interval");

// 3. Expressions: evaluate the strings the rig writes, with mocked expression globals.
const vec = (f) => (a, b) => (Array.isArray(a) ? a.map((x, i) => f(x, Array.isArray(b) ? b[i] : b)) : f(a, b));
const add = vec((x, y) => x + y);
const sub = vec((x, y) => x - y);
const mul = vec((x, y) => x * y);
const length = (v) => Math.hypot(...v);
function evalExpr(lines, env) {
  const names = Object.keys(env);
  return new Function(...names, "return eval(" + JSON.stringify(lines.join("\n")) + ");")(...names.map((n) => env[n]));
}
const sliders = (table) => (name) => () => ({ value: table[name] });

// 3a. DHO: starts on the key value, leaves with the measured velocity, overshoots, settles.
const dhoEnv = (time, value, v0) => ({
  time, value, numKeys: 2, add, mul,
  nearestKey: () => ({ index: 2 }),
  key: (k) => ({ time: k === 1 ? 0 : 0.5 }),
  velocityAtTime: (t) => (t < 0 ? (Array.isArray(v0) ? v0.map(() => 0) : 0) : v0),   // at rest before the first key
  thisComp: { frameDuration: 1 / 30 },
  thisLayer: { effect: sliders({ "SFT DHO Frequency": 2.76, "SFT DHO Damping": 0.69 }) },
});
const dho = DS.EXPR.dho("thisLayer");
const x = (t) => evalExpr(dho, dhoEnv(0.5 + t, 100, 300));
assert(near(x(0), 100, 1e-9), "DHO must start on the key value");
assert(near((x(1e-4) - x(0)) / 1e-4, 300, 1), "DHO must continue the arrival velocity");
let peak = 0;
for (let t = 0; t < 1; t += 0.002) peak = Math.max(peak, x(t));
assert(peak > 105 && peak < 115, "underdamped overshoot expected, got " + peak);
assert(near(x(1.5), 100, 0.01), "DHO must settle");
assert(near(evalExpr(dho, dhoEnv(0.3, 100, 300)), 100, 1e-9), "no effect before the key");
const v3 = evalExpr(dho, dhoEnv(0.55, [10, 20, 30], [300, 0, -300]));
assert(v3[0] > 10 && v3[1] === 20 && v3[2] < 30, "vector properties use add/mul");

// 3b. Camera drift: starts at zero, never reverses, speed is not constant.
const driftEnv = (time, value) => ({
  time, value, inPoint: 0, index: 3, add,
  seedRandom: () => {}, random: () => 1.3,
  thisComp: { layer: () => ({ effect: sliders({ "SFT Drift Rate": 10, "SFT Drift Hz": 0.12, "SFT Drift Breath": 0.3 }) }) },
});
const drift = DS.EXPR.cameraDrift('thisComp.layer("SFT CTRL")', false);
const z = (t) => evalExpr(drift, driftEnv(t, [960, 540, -2666]))[2];
assert(near(z(0), -2666, 1e-9));
const steps = [];
for (let t = 0; t < 10; t += 0.1) steps.push(z(t + 0.1) - z(t));
assert(steps.every((s) => s > 0), "drift must be monotonic");
assert(Math.max(...steps) / Math.min(...steps) > 1.3, "drift speed must breathe, not run linear");
assert(near(evalExpr(DS.EXPR.cameraDrift('thisComp.layer("SFT CTRL")', true), driftEnv(0, -2666)), -2666, 1e-9));

// 3c. Chromatic aberration: zero at rest and below the floor, capped at the maximum.
const chromaEnv = (speed) => ({
  time: 1, length, sub,
  effect: sliders({ "SFT CA Max": 4, "SFT CA Speed Floor": 600, "SFT CA Speed Ref": 3000 }),
  thisComp: { frameDuration: 1 / 30, layer: () => ({ anchorPoint: [0, 0, 0], toWorld: (p, t) => [speed * t, 0, 0] }) },
});
const chroma = DS.EXPR.chroma('"Title"', 1);
assert.strictEqual(evalExpr(chroma, chromaEnv(0)), 0);
assert.strictEqual(evalExpr(chroma, chromaEnv(500)), 0);
assert(near(evalExpr(chroma, chromaEnv(1800)), 1, 1e-6));
assert(near(evalExpr(chroma, chromaEnv(9000)), 4, 1e-6));

// 3d. Shadow: opacity falls with the inverse square of height; distance and softness grow.
const shadowEnv = (z, value) => ({
  value, anchorPoint: [0, 0, 0], toWorld: () => [0, 0, z],
  effect: sliders({ "SFT Shadow Ref Height": 200, "SFT Shadow Ground Z": 200 }),
});
assert(near(evalExpr(DS.EXPR.shadow(true, "value / (1 + (h / h0) * (h / h0));"), shadowEnv(0, 50)), 25, 1e-9));
assert(near(evalExpr(DS.EXPR.shadow(true, "value / (1 + (h / h0) * (h / h0));"), shadowEnv(200, 50)), 50, 1e-9));
assert(near(evalExpr(DS.EXPR.shadow(true, "value * (1 + h / h0);"), shadowEnv(0, 6)), 12, 1e-9));

// 3e. Glow by distance: twice as far = a quarter of the intensity, half the radius.
const glowEnv = (dist, value) => ({
  value, time: 1, inPoint: 0, length, sub, anchorPoint: [0, 0, 0],
  toWorld: () => [0, 0, 0],
  effect: sliders({ "SFT Glow Ref Distance": 1000 }),
  thisComp: { activeCamera: { toWorld: () => [0, 0, -dist] } },
});
assert(near(evalExpr(DS.EXPR.glowByDistance(2), glowEnv(2000, 1)), 0.25, 1e-9));
assert(near(evalExpr(DS.EXPR.glowByDistance(1), glowEnv(2000, 30)), 15, 1e-9));
assert(near(evalExpr(DS.EXPR.glowByDistance(2), glowEnv(1000, 1)), 1, 1e-9));

console.log("test_depth_soul: all checks passed (DS " + DS.VERSION + ")");
