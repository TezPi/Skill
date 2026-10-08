import React from "react";
import { AbsoluteFill, Interactive, useCurrentFrame, useVideoConfig } from "remotion";
import { arrival, cursorPx, pressScale, tipTo, tokens, tween, waterfallSchedule } from "../../motion";

const C = tokens.color;
const T = tokens.type;
const M = tokens.motion;

// GEOMETRY — card 400,260 · 1120×560; Run button inset 64 · 280×88 (identical to the HF film)
const CARD = { x: 400, y: 260, w: 1120, h: 560 };
const RUN = { w: 280, h: 88, inset: 64 };
const RUN_CENTER = { x: CARD.x + CARD.w - RUN.inset - RUN.w / 2, y: CARD.y + CARD.h - RUN.inset - RUN.h / 2 };
const DRIFT_TIP = { x: 1600, y: 920 };

// beats (scene seconds)
const ENTER_AT = 0.2;
const ARRIVED = ENTER_AT + M.duration.cursorEnter;
const IGNITE = ARRIVED + 0.1; // the click: progress starts on this frame, never after
const PROGRESS = 0.75;
const STILLNESS = 0.45; // dramatic comma between the run and its result
const CHECKS = [0, 1, 2].map((i) => waterfallSchedule([{ weight: "light" }], IGNITE + 0.2 + i * 0.25)[0]);
const STATUS = waterfallSchedule([{ weight: "heavy" }], IGNITE + PROGRESS + STILLNESS)[0];

const Check: React.FC<{ children: React.ReactNode; style: React.CSSProperties }> = ({ children, style }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 16, ...style }}>
    <svg viewBox="0 0 36 36" width={36} height={36} aria-hidden>
      <circle cx="18" cy="18" r="18" fill={C.accent} />
      <path d="M11 18.5l4.6 4.6L25.5 13" fill="none" stroke={C.accentInk} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    {children}
  </span>
);

/** route: cursor-led action → sequenced UI life → stillness → result */
export const Claim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const size = cursorPx(width);
  const runTip = tipTo(size, RUN_CENTER.x, RUN_CENTER.y);
  const drift = tipTo(size, DRIFT_TIP.x, DRIFT_TIP.y);
  const t = frame / fps;

  // entry law: glide from off-screen below (power3.out), then drift aside while the UI performs
  const cursorX = t < IGNITE + 0.15 ? runTip.x : tween(frame, fps, IGNITE + 0.15, M.duration.cursorDrift, runTip.x, drift.x, M.ease.cursorDrift);
  const cursorY =
    t < IGNITE + 0.15
      ? tween(frame, fps, ENTER_AT, M.duration.cursorEnter, height * 1.15, runTip.y, M.ease.cursorEnter)
      : tween(frame, fps, IGNITE + 0.15, M.duration.cursorDrift, runTip.y, drift.y, M.ease.cursorDrift);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: CARD.x,
          top: CARD.y,
          width: CARD.w,
          height: CARD.h,
          background: C.surface,
          border: `1px solid ${C.surfaceLine}`,
          borderRadius: tokens.radius.card,
        }}
      >
        <Interactive.Div
          name="Eyebrow"
          style={{
            position: "absolute",
            left: 64,
            top: 64,
            fontSize: T.label.size,
            fontWeight: T.label.weight,
            letterSpacing: `${T.label.tracking}em`,
            textTransform: "uppercase",
            color: C.accent,
          }}
        >
          Seam gate
        </Interactive.Div>
        <Interactive.Div
          name="Title"
          style={{
            position: "absolute",
            left: 64,
            top: 108,
            fontSize: T.title.size,
            fontWeight: T.title.weight,
            letterSpacing: `${T.title.tracking}em`,
            lineHeight: T.title.leading,
          }}
        >
          Every cut, verified.
        </Interactive.Div>
        <div style={{ position: "absolute", left: 64, right: 64, top: 236, height: 12, borderRadius: 999, background: C.surfaceLine, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: C.accent,
              transformOrigin: "0% 50%",
              scale: `${tween(frame, fps, IGNITE, PROGRESS, 0, 1, "power2.out")} 1`,
            }}
          />
        </div>
        <div style={{ position: "absolute", left: 64, right: 64, top: 292, display: "flex", gap: 56, fontSize: T.body.size, fontWeight: T.body.weight }}>
          <Check style={arrival(frame, fps, CHECKS[0])}>Exit moving</Check>
          <Check style={arrival(frame, fps, CHECKS[1])}>Zero overlap</Check>
          <Check style={arrival(frame, fps, CHECKS[2])}>Z sign matched</Check>
        </div>
        <div
          style={{
            position: "absolute",
            left: 64,
            bottom: 64,
            height: 88,
            padding: "0 36px",
            borderRadius: 999,
            border: `2px solid ${C.accent}`,
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 32,
            fontWeight: 640,
            letterSpacing: "0.04em",
            ...arrival(frame, fps, STATUS),
          }}
        >
          PASSED <small style={{ fontSize: 28, fontWeight: 450, letterSpacing: 0, color: C.inkMuted }}>2 / 2 seams</small>
        </div>
        <div
          style={{
            position: "absolute",
            right: RUN.inset,
            bottom: RUN.inset,
            width: RUN.w,
            height: RUN.h,
            borderRadius: 999,
            background: C.accentStrong,
            color: C.ink,
            fontSize: 32,
            fontWeight: 640,
            letterSpacing: "-0.01em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            scale: String(pressScale(frame, fps, IGNITE, M.scale.targetPress)),
          }}
        >
          Run gate
        </div>
      </div>
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          translate: `${cursorX}px ${cursorY}px`,
          scale: String(pressScale(frame, fps, IGNITE)),
          transformOrigin: M.cursor.tipOrigin,
          filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))",
        }}
      >
        <path d="M5 3.36V20.4l4.3-3.9 2.8 6.2 2.9-1.3-2.75-6.1h6.05z" fill="#fff" stroke="#000" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </AbsoluteFill>
  );
};
