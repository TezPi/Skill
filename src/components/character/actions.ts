/*
 * ACTION DEFINITIONS (spec section 10). Every action only moves pose values:
 * position, rotation, limbs, head angle, expression, props. The master
 * artwork is never touched.
 *
 * Sign conventions (CSS rotate, clockwise positive):
 *   armNear  negative = forearm swings up to the character's front (viewer right)
 *   armFar   positive = forearm swings up to the viewer's left
 *   hip*     negative = thigh swings forward (viewer right)
 *   knee*    positive = shin folds back under the knee
 */
import type { MotionValue } from "motion/react";
import type { HandPose, MouthPose } from "./parts";

export type ActionName = "idle" | "wave" | "point" | "talk" | "jump" | "walk" | "run" | "sit" | "sleep" | "wake" | "greet";
export type Fx = "none" | "zz" | "question";

export interface Pose {
  rootX: MotionValue<number>;
  rootY: MotionValue<number>;
  rootScaleY: MotionValue<number>;
  rootRotate: MotionValue<number>;
  upperRotate: MotionValue<number>;
  head: MotionValue<number>;
  headY: MotionValue<number>;
  eyeScale: MotionValue<number>;
  lids: MotionValue<number>;
  armFar: MotionValue<number>;
  armNear: MotionValue<number>;
  hipFar: MotionValue<number>;
  kneeFar: MotionValue<number>;
  hipNear: MotionValue<number>;
  kneeNear: MotionValue<number>;
  marks: MotionValue<number>;
  ground: MotionValue<number>;
}

export interface ActionApi {
  pose: Pose;
  to: (value: MotionValue<number>, target: number | number[], options?: Record<string, unknown>) => Promise<void>;
  wait: (ms: number) => Promise<void>;
  loop: (value: MotionValue<number>, keyframes: number[], duration: number) => void;
  set: {
    hands: (far: HandPose, near: HandPose) => void;
    mouth: (m: MouthPose) => void;
    fx: (fx: Fx) => void;
    say: (text: string | null) => void;
    stool: (on: boolean) => void;
  };
  /** Mouth flaps for `ms` (TALK: small movements, not exaggerated) */
  talkFor: (ms: number) => Promise<void>;
  /** Blocks until the action is cancelled (for looping actions) */
  hold: () => Promise<void>;
  args: { dir?: "left" | "right"; text?: string };
}

const SPRING = { type: "spring", stiffness: 260, damping: 20 } as const;
const SOFT = { type: "spring", stiffness: 140, damping: 18 } as const;

export const ACTIONS: Record<Exclude<ActionName, "idle">, (a: ActionApi) => Promise<void>> = {
  /* WAVE: one arm raises, hand moves side to side, body stable, friendly face */
  async wave({ pose, to, set }) {
    set.hands("rest", "wave");
    set.mouth("smile");
    to(pose.marks, 1, { duration: 0.2 });
    to(pose.head, 4, SOFT);
    await to(pose.armNear, -150, SPRING);
    await to(pose.armNear, [-150, -126, -156, -128, -152, -134], { duration: 1.3, ease: "easeInOut" });
    to(pose.marks, 0, { duration: 0.3 });
  },

  /* POINT: one arm extends, index finger points, head turns toward it */
  async point({ pose, to, set, hold, args }) {
    const left = args.dir === "left";
    set.hands(left ? "point" : "rest", left ? "rest" : "point");
    set.mouth("smile");
    if (args.text) set.say(args.text);
    to(pose.head, left ? -5 : 5, SOFT);
    to(pose.upperRotate, left ? -2 : 2, SOFT);
    await to(left ? pose.armFar : pose.armNear, left ? 84 : -86, SPRING);
    await hold();
  },

  /* TALK: small mouth movements, subtle head movement, small hand gestures */
  async talk({ pose, to, set, talkFor, args, wait }) {
    const text = args.text ?? "Hi, I'm Thịnh!";
    set.say(text);
    set.hands("rest", "rest");
    const ms = Math.max(1400, text.length * 70);
    to(pose.armNear, [0, -26, -14, -30, -10], { duration: ms / 1000, ease: "easeInOut" });
    to(pose.head, [0, 3, -1, 2, 0], { duration: ms / 1000, ease: "easeInOut" });
    await talkFor(ms);
    set.mouth("smile");
    await wait(900);
    set.say(null);
  },

  /* GREETING on arrival: wave while saying hello */
  async greet(api) {
    api.set.say(api.args.text ?? "Hi, I'm Thịnh!");
    await ACTIONS.wave(api);
    await api.wait(300);
    api.set.say(null);
  },

  /* JUMP: take-off crouch, air with arms raised, landing compress, back to idle */
  async jump({ pose, to, set }) {
    set.mouth("open");
    to(pose.armFar, -14, { duration: 0.16 });
    to(pose.armNear, 14, { duration: 0.16 });
    to(pose.kneeFar, 10, { duration: 0.16 });
    to(pose.kneeNear, 10, { duration: 0.16 });
    await Promise.all([to(pose.rootY, 36, { duration: 0.16, ease: "easeOut" }), to(pose.rootScaleY, 0.93, { duration: 0.16 })]);
    set.hands("wave", "wave");
    set.mouth("smile");
    to(pose.marks, 1, { duration: 0.15 });
    to(pose.armFar, 150, { duration: 0.28, ease: "easeOut" });
    to(pose.armNear, -150, { duration: 0.28, ease: "easeOut" });
    to(pose.kneeFar, 16, { duration: 0.28 });
    to(pose.kneeNear, 20, { duration: 0.28 });
    to(pose.rootScaleY, 1.03, { duration: 0.2 });
    await to(pose.rootY, -170, { duration: 0.32, ease: [0.2, 0.8, 0.3, 1] });
    to(pose.kneeFar, 4, { duration: 0.26 });
    to(pose.kneeNear, 4, { duration: 0.26 });
    await to(pose.rootY, 0, { duration: 0.28, ease: [0.55, 0, 1, 0.45] });
    to(pose.marks, 0, { duration: 0.3 });
    set.hands("rest", "rest");
    await Promise.all([to(pose.rootScaleY, 0.95, { duration: 0.08 }), to(pose.kneeFar, 12, { duration: 0.08 }), to(pose.kneeNear, 12, { duration: 0.08 })]);
    await to(pose.rootScaleY, 1, SPRING);
  },

  /* WALK: alternating legs and opposite arms, body passes through centre twice per cycle */
  async walk({ pose, loop, set, hold }) {
    set.mouth("none");
    const d = 0.9;
    loop(pose.hipFar, [16, 0, -16, 0, 16], d);
    loop(pose.hipNear, [-16, 0, 16, 0, -16], d);
    loop(pose.kneeFar, [0, 14, 4, 0, 0], d);
    loop(pose.kneeNear, [4, 0, 0, 14, 4], d);
    loop(pose.armFar, [-12, 0, 12, 0, -12], d);
    loop(pose.armNear, [12, 0, -12, 0, 12], d);
    loop(pose.rootY, [0, -14, 0, -14, 0], d);
    loop(pose.head, [0, 1.5, 0, 1.5, 0], d);
    loop(pose.ground, [0, -1], d);
    await hold();
  },

  /* RUN: slight forward lean, larger strides, faster cycle */
  async run({ pose, loop, set, to, hold }) {
    set.mouth("open");
    set.hands("rest", "rest");
    to(pose.rootRotate, 5, SOFT);
    const d = 0.56;
    loop(pose.hipFar, [28, 0, -26, 0, 28], d);
    loop(pose.hipNear, [-26, 0, 28, 0, -26], d);
    loop(pose.kneeFar, [6, 34, 10, 0, 6], d);
    loop(pose.kneeNear, [10, 0, 6, 34, 10], d);
    loop(pose.armFar, [-30, 0, 30, 0, -30], d);
    loop(pose.armNear, [30, 0, -30, 0, 30], d);
    loop(pose.rootY, [0, -30, 0, -30, 0], d);
    loop(pose.ground, [0, -1], d / 1.6);
    await hold();
  },

  /* SIT: knees bend, hips lower onto a stool, torso and glasses unchanged */
  async sit({ pose, to, set, hold }) {
    set.stool(true);
    set.mouth("none");
    to(pose.hipFar, -70, SOFT);
    to(pose.hipNear, -68, SOFT);
    to(pose.kneeFar, 70, SOFT);
    to(pose.kneeNear, 68, SOFT);
    to(pose.armFar, -20, SOFT);
    to(pose.armNear, -30, SOFT);
    await to(pose.rootY, 176, SOFT);
    await hold();
  },

  /* SLEEPY: half-closed then closed eyes, head droops, slow zZ */
  async sleep({ pose, to, set, hold }) {
    set.mouth("flat");
    await to(pose.lids, 0.45, { duration: 0.6 });
    set.fx("zz");
    to(pose.head, 9, { duration: 1.4, ease: "easeInOut" });
    to(pose.headY, 10, { duration: 1.4, ease: "easeInOut" });
    await to(pose.lids, 0.1, { duration: 0.8 });
    await hold();
  },

  /* SURPRISED -> HAPPY: waking up */
  async wake({ pose, to, set, wait }) {
    set.fx("none");
    set.mouth("open");
    to(pose.lids, 1, { duration: 0.12 });
    to(pose.eyeScale, 1.14, { duration: 0.12 });
    to(pose.marks, 1, { duration: 0.12 });
    await to(pose.headY, -18, { duration: 0.14, ease: "easeOut" });
    await to(pose.headY, 0, SPRING);
    await wait(420);
    set.mouth("smile");
    to(pose.eyeScale, 1, SOFT);
    await to(pose.marks, 0, { duration: 0.4 });
  },
};
