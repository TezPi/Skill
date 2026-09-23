/**
 * Motion grammar — mirrors the Agent-X motion system.
 * Four verbs only: rise, fade, draw, pop. Expo-out on every entry.
 */

export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_QUART = [0.76, 0, 0.24, 1] as const;

export const DURATION = { fast: 0.45, base: 0.6, slow: 0.75 } as const;

/** Rise distances in px: 10 / 14 / 20 / 24. */
export const RISE = { xs: 10, sm: 14, md: 20, lg: 24 } as const;

export const STAGGER = {
  element: 0.2,
  char: 0.07,
  /** Pause between words so a name reads as words, not a typewriter. */
  wordGap: 0.18,
  word: 0.06,
} as const;

/** Overshoot spring for pops: 0.8 → 1.03 → 1.0. */
export const SPRING_POP = { type: "spring", stiffness: 260, damping: 18, mass: 0.9 } as const;

export const BLUR_FROM = "blur(10px)";
