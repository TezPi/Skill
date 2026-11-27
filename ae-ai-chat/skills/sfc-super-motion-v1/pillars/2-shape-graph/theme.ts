// src/theme.ts — Deterministic Shape & Motion Graph Token System
// Drop this file into any Remotion, React, Canvas, or Motion Graphics project.

export const SHAPE_CONSTANTS = {
  /** Magic Bezier tangent multiplier for circular arcs & ellipses (4*(sqrt(2)-1)/3) */
  ELLIPSE_CONSTANT: 0.5519,
  /** Default Group Transform origin to enforce The Rule of Zero */
  RULE_OF_ZERO_ORIGIN: [0, 0] as const,
  /** Lottie Shape Direction codes */
  DIRECTION_CLOCKWISE: 1,
  DIRECTION_REVERSED: 3,
  /** Lottie Merge Paths ('mm') Boolean Mode Enum */
  MERGE_MODE: {
    MERGE: 1,
    ADD: 2,
    SUBTRACT: 3,
    INTERSECT: 4,
    EXCLUDE_INTERSECTIONS: 5,
  },
  /** Lottie Trim Paths ('tm') Multiple Shapes Mode Enum */
  TRIM_MULTIPLE: {
    SIMULTANEOUS: 1,
    INDIVIDUALLY: 2,
  },
} as const;

/**
 * Canonical Cubic-Bezier Easing Tokens mapped to After Effects Speed/Value Graph Influence %
 * Format: [x1, y1, x2, y2]
 */
export const MOTION_CURVES = {
  // 1. Symmetric On-Screen Movement & Morphing (Out_Speed = 0, In_Speed = 0)
  EASE_IN_OUT_SINE: [0.445, 0.05, 0.55, 0.95] as const,     // Peak V: 1.56x @ t=0.50 (Idle / Ambient)
  SMOOTH_50_50: [0.5, 0.0, 0.5, 1.0] as const,              // Peak V: 2.00x @ t=0.50 (AE 50% / 50%)
  MEDIUM_DRAMA_66_66: [0.66, 0.0, 0.34, 1.0] as const,      // Peak V: 2.94x @ t=0.50 (AE 66% / 66%)
  PRO_STANDARD_75_75: [0.75, 0.0, 0.25, 1.0] as const,      // Peak V: 4.00x @ t=0.50 (AE 75% / 75% Gold Standard)
  HIGH_CONTRAST_80_80: [0.8, 0.0, 0.2, 1.0] as const,       // Peak V: 5.00x @ t=0.50 (AE 80% / 80% Mograph)
  EXTREME_SNAP_90_90: [0.9, 0.0, 0.1, 1.0] as const,        // Peak V: 10.0x @ t=0.50 (AE 90% / 90% Kinetic Whip)

  // 2. Asymmetric Entrances & Decelerations (Fast Launch -> Long Soft Landing)
  EASE_OUT_QUAD: [0.25, 0.46, 0.45, 0.94] as const,         // Subtle UI feedback
  EASE_OUT_CUBIC: [0.215, 0.61, 0.355, 1.0] as const,       // Standard micro-interaction
  SNAPPY_ENTER_20_80: [0.2, 0.0, 0.2, 1.0] as const,        // Peak V: 2.50x @ t=0.17 (AE 20% / 80%)
  PUNCHY_ENTER_15_85: [0.15, 0.0, 0.15, 1.0] as const,      // Peak V: 2.80x @ t=0.12 (AE 15% / 85% Hero Reveal)
  EXPLOSIVE_ENTER_10_90: [0.1, 0.0, 0.1, 1.0] as const,     // Peak V: 3.33x @ t=0.07 (AE 10% / 90% Impact Hit)
  APPLE_IOS_SHEET: [0.32, 0.72, 0.0, 1.0] as const,         // Peak V: 4.22x @ t=0.16 (Emil Kowalski Drawer Curve)
  M3_EMPHASIZED_DECEL: [0.05, 0.7, 0.1, 1.0] as const,      // Peak V: 14.0x @ t=0.00 (Google M3 Hero Enter)

  // 3. Asymmetric Exits & Accelerations (Build Momentum -> Cut at Peak Speed)
  EASE_IN_QUAD: [0.55, 0.085, 0.68, 0.53] as const,         // Spatial arc X-axis driver
  FAST_EXIT_80_20: [0.8, 0.0, 0.8, 1.0] as const,           // Peak V: 2.50x @ t=0.83 (AE 80% / 20%)
  WHIP_EXIT_85_15: [0.85, 0.0, 0.85, 1.0] as const,         // Peak V: 2.80x @ t=0.88 (AE 85% / 15%)
  M3_EMPHASIZED_ACCEL: [0.3, 0.0, 0.8, 0.15] as const,      // Peak V: 4.25x @ t=1.00 (Permanent Dismissal)

  // 4. Value Graph Overshoot & Anticipation (1D or Separated X/Y Axes)
  EASE_OUT_BACK_OVERSHOOT: [0.34, 1.56, 0.64, 1.0] as const,    // +9.8% Overshoot (y_max = 1.098)
  EASE_IN_BACK_ANTICIPATION: [0.36, 0.0, 0.66, -0.56] as const, // -9.8% Wind-up (y_min = -0.098)
  EASE_IN_OUT_BACK_FULL: [0.68, -0.6, 0.32, 1.6] as const,      // -10.5% Wind-up & +10.5% Overshoot
} as const;

/**
 * Paired Separate-Dimension Curves for 2D Spatial Arcs (Prevent 0% Straight-Line Diagonals)
 */
export const SPATIAL_ARC_PAIRS = {
  /** 31.4% Max Arc Bow — Ideal for FAB-to-Modal & natural toss trajectories */
  NATURAL_QUARTER_ARC: {
    xCurve: [0.47, 0.0, 0.745, 0.715] as const,
    yCurve: [0.39, 0.575, 0.565, 1.0] as const,
  },
  /** 36.5% Max Arc Bow — Ideal for parabolic jumps & expressive floating cards */
  PRONOUNCED_UPPER_ARC: {
    xCurve: MOTION_CURVES.EASE_IN_QUAD,
    yCurve: MOTION_CURVES.EASE_OUT_QUAD,
  },
  /** 44.4% Max Arc Bow — Fast horizontal launch with late vertical swoop */
  DEEP_PENDULUM_SWOOP: {
    xCurve: MOTION_CURVES.SNAPPY_ENTER_20_80,
    yCurve: MOTION_CURVES.FAST_EXIT_80_20,
  },
  /** 66.6% Max Arc Bow — Vertical overshoot hook into horizontal lock */
  J_CURVE_HOOK: {
    xCurve: MOTION_CURVES.WHIP_EXIT_85_15,
    yCurve: MOTION_CURVES.EASE_OUT_BACK_OVERSHOOT,
  },
} as const;

/**
 * Verified Spring Physics Presets (Remotion / Framer Motion / Reanimated / SwiftUI compatible)
 */
export const SPRING_PRESETS = {
  /** zeta=0.70 | Overshoot=4.6% | Settle=353ms (9f@24, 11f@30, 22f@60) */
  SNAPPY_UI: { mass: 1.0, stiffness: 400, damping: 28.0, overshootClamping: false },
  /** zeta=0.82 | Overshoot=1.1% | Settle=377ms (10f@24, 12f@30, 23f@60) */
  IOS_SHEET: { mass: 1.0, stiffness: 280, damping: 27.4, overshootClamping: false },
  /** zeta=0.69 | Overshoot=4.9% | Settle=411ms (10f@24, 13f@30, 25f@60) */
  SAAS_CARD: { mass: 1.0, stiffness: 300, damping: 24.0, overshootClamping: false },
  /** zeta=1.00 | Overshoot=0.0% | Settle=612ms (15f@24, 19f@30, 37f@60) — MANDATORY for Data & Opacity */
  CRITICALLY_DAMPED: { mass: 1.0, stiffness: 200, damping: 28.28, overshootClamping: true },
  /** zeta=0.44 | Overshoot=21.2% | Settle=673ms (17f@24, 21f@30, 41f@60) — Social hooks & stickers */
  PLAYFUL_POP: { mass: 1.0, stiffness: 250, damping: 14.0, overshootClamping: false },
  /** zeta=0.30 | Overshoot=37.5% | Settle=1163ms (28f@24, 35f@30, 70f@60) — Cartoon rubber boing */
  ELASTIC_CARTOON: { mass: 1.0, stiffness: 180, damping: 8.0, overshootClamping: false },
  /** zeta=0.89 | Overshoot=0.2% | Settle=902ms (22f@24, 28f@30, 55f@60) — Luxury & Cinema */
  HEAVY_CINEMATIC: { mass: 2.0, stiffness: 90, damping: 24.0, overshootClamping: false },
} as const;

/**
 * Utility Functions for Deterministic Timing, Staggering & Volume Conservation
 */
export const MotionMath = {
  /** Convert milliseconds to exact frames based on composition FPS */
  msToFrames(ms: number, fps: number = 30): number {
    return Math.max(1, Math.round((ms / 1000) * fps));
  },

  /** Convert After Effects Speed Graph Influence % (0-100) to normalized cubic-bezier */
  aeInfluenceToBezier(
    outInfPercent: number,
    inInfPercent: number,
    outSpeedRatio: number = 0,
    inSpeedRatio: number = 0
  ): readonly [number, number, number, number] {
    const x1 = Math.min(Math.max(outInfPercent / 100, 0), 1);
    const y1 = x1 * outSpeedRatio;
    const inInf = Math.min(Math.max(inInfPercent / 100, 0), 1);
    const x2 = 1 - inInf;
    const y2 = 1 - inInf * inSpeedRatio;
    return [x1, y1, x2, y2] as const;
  },

  /** Convert Apple/Emil perceptual (durationSec, bounce) to physical (mass, stiffness, damping) */
  appleSpringToPhysics(durationSec: number = 0.5, bounce: number = 0.15, mass: number = 1.0) {
    const stiffness = Math.pow((2 * Math.PI) / Math.max(durationSec, 0.05), 2) * mass;
    const dampingRatio = Math.max(0.05, 1 - bounce);
    const damping = 2 * dampingRatio * Math.sqrt(stiffness * mass);
    return { mass, stiffness: Number(stiffness.toFixed(2)), damping: Number(damping.toFixed(2)) };
  },

  /** Distance-scaled duration in ms: clamp(100ms, baseMs + distancePx * 0.8, 500ms) */
  calcTravelDurationMs(distancePx: number, baseMs: number = 150): number {
    return Math.min(Math.max(100, Math.round(baseMs + Math.abs(distancePx) * 0.8)), 500);
  },

  /** Enforce 1.5:1 Enter/Exit Asymmetry Ratio */
  calcExitDurationMs(enterDurationMs: number): number {
    return Math.max(80, Math.round(enterDurationMs * 0.6));
  },

  /** Decelerating Stagger in Frames capped at maxTotalDelayMs (default 350ms) */
  getDeceleratingStaggerFrames(
    index: number,
    fps: number = 30,
    baseIntervalMs: number = 15,
    exponent: number = 1.5,
    maxTotalDelayMs: number = 350
  ): number {
    const delayMs = Math.min(Math.pow(index, exponent) * baseIntervalMs, maxTotalDelayMs);
    return Math.round((delayMs / 1000) * fps);
  },

  /** 2D Squash & Stretch Volume Conservation: returns [scaleX, scaleY] where scaleX * scaleY = 1.0 */
  getVolumeConservedScale(primaryScaleFactor: number): readonly [number, number] {
    const safeX = Math.max(0.2, primaryScaleFactor);
    const conservedY = 1.0 / safeX;
    return [Number(safeX.toFixed(4)), Number(conservedY.toFixed(4))] as const;
  },
};
