import { Easing } from "remotion";
import type { GsapEase } from "./tokens.generated";

type EasingFn = (t: number) => number;

// motion-forge §6 Ease Rosetta: GSAP powerN = polynomial of degree N+1.
// Verified numerically against gsap.parseEase by scripts/verify-eases.ts (npm run eases:verify).
const CURVES: Record<string, EasingFn> = {
  power1: Easing.quad,
  power2: Easing.cubic,
  power3: Easing.poly(4),
  power4: Easing.poly(5),
  expo: Easing.exp, // .out within 0.8% of GSAP
  sine: Easing.sin,
  circ: Easing.circle,
};

const BANNED = /^(bounce|elastic)/;

/**
 * Map a GSAP ease name (the token vocabulary shared with HyperFrames) to a Remotion easing,
 * so a beat feels identical whichever engine renders it.
 *   ease("power4.out") · ease("expo.out") · ease("back.out(1.6)") · ease("none")
 */
export function ease(name: GsapEase | (string & {})): EasingFn {
  if (name === "none" || name === "linear") return Easing.linear;
  if (BANNED.test(name)) throw new Error(`ease "${name}" is banned by the motion doctrine`);

  const m = /^(\w+)\.(in|out|inOut)(?:\(([\d.]+)\))?$/.exec(name);
  if (!m) throw new Error(`unknown ease "${name}"`);
  const [, family, dir, arg] = m;

  const curve = family === "back" ? Easing.back(arg ? Number(arg) : 1.70158) : CURVES[family];
  if (!curve) throw new Error(`no Rosetta mapping for ease family "${family}"`);
  return dir === "in" ? Easing.in(curve) : dir === "out" ? Easing.out(curve) : Easing.inOut(curve);
}
