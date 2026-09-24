/*
 * MASTER CHARACTER SPECIFICATION (locked). The avatar is the artist's image,
 * traced 1:1 (see avatar-paths.ts). Animation may change pose, head angle,
 * gaze and expression only; nothing in this file is animatable.
 */
export const CHARACTER = Object.freeze({
  gender: "male",
  style: "minimal_2d_cartoon",
  rendering: "flat_2d",
  hair: { color: "black", style: "messy_short" },
  glasses: { enabled: true, color: "black" },
  shirt: { color: "white" },
  backpack: { color: "blue" },
  outline: { color: "black" },
} as const);

/** Palette sampled from the source image */
export const INK = "#0f0f11";
export const BLUE = "#1959bb";
export const WHITE = "#ffffff";

/** Portrait crop in source pixels (5:6). The bust is traced below the bottom edge so bobbing never shows the cut. */
export const VIEWBOX = { x: 190, y: 70, w: 880, h: 1056 } as const;

/** Joints in source pixels */
export const PIVOT = {
  /** on the neck split line: the head tilts here so the neck never kinks */
  neck: [645, 640],
  /** bottom centre of the crop: the whole bust leans and breathes from here */
  base: [630, 1126],
  /** between the lenses: gaze is measured from this point */
  eyes: [760, 430],
} as const;

/**
 * Pupil travel in source pixels. Kept inside the lens rims: the near lens is
 * narrower because the head is in three-quarter view.
 */
export const GAZE_RANGE = { x: 9, y: 7 } as const;

export const origin = ([x, y]: readonly [number, number]) => `${x}px ${y}px`;
