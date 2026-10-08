import React from "react";
import { AbsoluteFill, Interactive, useCurrentFrame, useVideoConfig } from "remotion";
import { arrival, scheduleEnd, tokens, tween, waterfallSchedule } from "../../motion";

const T = tokens.type;
const M = tokens.motion;
const LABEL = waterfallSchedule([{ weight: "light" }], M.duration.inverseZoom.entry + 0.05);
const RULE_AT = scheduleEnd(LABEL) + 0.08;

/** route: arrives COMPOSED inside the retracting wrapper (no grow-from-small in the Z seam
 *  window) → staged reveals after it settles → held end card */
export const Payoff: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 84 }}>
        <div style={{ position: "relative" }}>
          <Interactive.Div
            name="Payoff line"
            style={{
              fontSize: T.display.size,
              fontWeight: T.display.weight,
              letterSpacing: `${T.display.tracking}em`,
              lineHeight: T.display.leading,
              whiteSpace: "nowrap",
            }}
          >
            Cut the curve.
          </Interactive.Div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: -36,
              height: 10,
              borderRadius: 999,
              background: tokens.color.accent,
              transformOrigin: "0% 50%",
              scale: `${tween(frame, fps, RULE_AT, 0.5, 0, 1, M.ease.arrival)} 1`,
            }}
          />
        </div>
        <Interactive.Div
          name="Label"
          style={{
            fontSize: T.label.size,
            fontWeight: T.label.weight,
            letterSpacing: `${T.label.tracking}em`,
            lineHeight: T.label.leading,
            textTransform: "uppercase",
            color: tokens.color.inkMuted,
            ...arrival(frame, fps, LABEL[0]),
          }}
        >
          npm run seam:gate → passed
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};
