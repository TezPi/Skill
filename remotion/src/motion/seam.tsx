import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { tween } from "./primitives";
import { tokens } from "./tokens.generated";

/**
 * Doctrine seams for Remotion: scenes sit in a <Series> (hard cuts, zero overlap — one side
 * visible per frame) and each scene's wrapper performs its own exit before the cut and entry
 * after it. Curves mirror tools/tezpi/seam-stamp.mjs exactly, so a seam renders identically
 * in HyperFrames (stamped + Seam-Gate verified) and here.
 *
 * Do NOT use <TransitionSeries> presentations for ordinary seams: they overlap scenes
 * (crossfade-class, no carrier). Reserve them for chapter breaks.
 */
export type SeamTechnique = "cut-the-curve" | "zoom-through" | "inverse-zoom";
type Current = "left" | "right" | "up" | "down";

const M = tokens.motion;
// seam-stamp.mjs constants (the executable reference the Seam Gate verifies)
const STAMP = {
  ctc: { exit: 0.34, entry: 0.42, exitTravel: 12, entryTravel: 10, exitEase: "power3.in" },
  z: { exit: 0.21, entry: 0.5, pushOut: 1.18, pushIn: 0.78, pullOut: M.scale.pull.exit, pullIn: M.scale.pull.entry },
} as const;
const VEC: Record<Current, ["x" | "y", 1 | -1]> = { left: ["x", -1], right: ["x", 1], up: ["y", -1], down: ["y", 1] };

type Props = {
  /** Same value as the enclosing <Series.Sequence durationInFrames>. */
  durationInFrames: number;
  enter?: SeamTechnique;
  exit?: SeamTechnique;
  current?: Current;
  /** Z-seam peak blur: 10 text-scale, 18 full-frame surfaces (default). */
  blur?: number;
  name?: string;
  children: React.ReactNode;
};

export const SeamScene: React.FC<Props> = ({
  durationInFrames,
  enter,
  exit,
  current = M.current as Current,
  blur = M.blur.surface,
  name,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const [axis, dir] = VEC[current];
  const extent = axis === "x" ? width : height;
  const end = durationInFrames / fps; // the cut, in scene seconds

  let shift = 0;
  let scale = 1;
  let opacity = 1;
  let blurPx = 0;

  // ── entry (scene starts AT the cut, already moving) ──
  if (enter === "cut-the-curve") {
    const { entry, entryTravel } = STAMP.ctc;
    shift += tween(frame, fps, 0, entry, (-entryTravel * dir * extent) / 100, 0, M.ease.seamEntry);
    opacity *= tween(frame, fps, 0, entry, M.opacity.seamIgnite, 1, M.ease.seamEntry);
  } else if (enter === "zoom-through" || enter === "inverse-zoom") {
    const from = enter === "inverse-zoom" ? STAMP.z.pullIn : STAMP.z.pushIn;
    scale *= tween(frame, fps, 0, STAMP.z.entry, from, 1, M.ease.zoomEntry);
    blurPx = Math.max(blurPx, tween(frame, fps, 0, STAMP.z.entry, blur, 0, M.ease.zoomEntry));
    opacity *= tween(frame, fps, 0, STAMP.z.entry, M.opacity.zoomFloor, 1, M.ease.zoomEntry);
  }

  // ── exit (ends AT the cut, still accelerating) ──
  if (exit === "cut-the-curve") {
    const { exit: d, exitTravel, exitEase } = STAMP.ctc;
    shift += tween(frame, fps, end - d, d, 0, (exitTravel * dir * extent) / 100, exitEase);
    opacity *= tween(frame, fps, end - d, d, 1, 0, exitEase);
  } else if (exit === "zoom-through" || exit === "inverse-zoom") {
    const to = exit === "inverse-zoom" ? STAMP.z.pullOut : STAMP.z.pushOut;
    const d = STAMP.z.exit;
    scale *= tween(frame, fps, end - d, d, 1, to, M.ease.zoomExit);
    blurPx = Math.max(blurPx, tween(frame, fps, end - d, d, 0, blur, M.ease.zoomExit));
    opacity *= tween(frame, fps, end - d, d, 1, 0, "none"); // exit opacity: its own linear ramp
  }

  return (
    <AbsoluteFill
      name={name}
      style={{
        translate: axis === "x" ? `${shift}px 0px` : `0px ${shift}px`,
        scale: String(scale),
        opacity,
        filter: blurPx > 0.01 ? `blur(${blurPx}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
