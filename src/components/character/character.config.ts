/*
 * MASTER CHARACTER SPECIFICATION (locked). Mirrors sections 6, 7 and 14 of the
 * developer's spec. Animations may change pose, position, rotation, limbs,
 * head angle and expression only; nothing in this file is animatable.
 */
export const CHARACTER = Object.freeze({
  gender: "male",
  style: "minimal_2d_cartoon",
  rendering: "flat_2d",
  shading: "minimal",
  bodyStyle: "slim_cartoon",
  hair: { color: "black", style: "messy_short" },
  glasses: { enabled: true, color: "black" },
  shirt: { color: "white" },
  pants: { color: "blue" },
  shoes: { color: "white" },
  backpack: { color: "blue" },
  outline: { color: "black" },
} as const);

/** Palette sampled from the master model image */
export const INK = "#0f0f11";
export const BLUE = "#1959bb";
export const WHITE = "#ffffff";

/** Master line weight (px in master-image space) */
export const LINE = 11;

/**
 * Joint pivots in master-image space. Every drawn part attaches at these points
 * so traced and drawn geometry stay aligned in every pose.
 */
export const PIVOT = {
  neck: [645, 640],
  waist: [656, 1228],
  elbowFar: [428, 1062],
  elbowNear: [880, 1066],
  hipFar: [560, 1215],
  kneeFar: [560, 1508],
  hipNear: [754, 1218],
  kneeNear: [757, 1518],
  ground: [680, 1872],
} as const;

export const origin = ([x, y]: readonly [number, number]) => `${x}px ${y}px`;
