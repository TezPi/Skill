// Verifies the Remotion ease Rosetta against GSAP itself. Run: npm run eases:verify
// Every ease referenced by motion/tokens.json must match within tolerance (expo.out: 0.8%).
import gsap from "gsap";
import { ease } from "../src/motion/eases.ts";
import tokensJson from "../../motion/tokens.json" with { type: "json" };

const names = [
  ...new Set([
    ...Object.entries(tokensJson.motion.ease)
      .filter(([k]) => !k.startsWith("$"))
      .map(([, v]) => v as string),
    "power1.out",
    "power2.inOut",
    "power4.inOut",
    "sine.inOut",
    "circ.out",
    "back.out(1.7)",
  ]),
];

let fail = 0;
for (const name of names) {
  const g = gsap.parseEase(name);
  const r = ease(name);
  let max = 0;
  for (let i = 0; i <= 200; i++) {
    const t = i / 200;
    max = Math.max(max, Math.abs(g(t) - r(t)));
  }
  const tol = name.startsWith("expo") ? 0.008 : 1e-9;
  const ok = max <= tol;
  if (!ok) fail++;
  console.log(`${ok ? "ok  " : "FAIL"} ${name.padEnd(14)} max |Δ| = ${max.toExponential(2)}`);
}
if (fail) {
  console.error(`\n${fail} ease(s) diverge from GSAP — fix src/motion/eases.ts`);
  process.exit(1);
}
console.log(`\nRosetta verified: ${names.length} eases match GSAP`);
