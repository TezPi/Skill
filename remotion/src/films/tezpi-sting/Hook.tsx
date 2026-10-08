import React from "react";
import { AbsoluteFill, Interactive, useCurrentFrame, useVideoConfig } from "remotion";
import { arrival, nudge, nudgeBurstAt, tokens, waterfallSchedule } from "../../motion";

const T = tokens.type;
const NUDGE_AT = 1.15;
const PARK = 34; // half the label block: headline starts on true center, nudges home as the label lands

const WORDS = waterfallSchedule(
  [
    { weight: "heavy" },
    { weight: "normal" },
    { weight: "light", offset: 70, duration: 0.16 }, // final word split into fragments → longer climax
    { weight: "light", offset: 70, duration: 0.15 },
    { weight: "light" },
  ],
  0.25,
);
const LABEL = waterfallSchedule(
  [{ weight: "light" }, { weight: "light" }, { weight: "light" }, { weight: "light" }],
  nudgeBurstAt(NUDGE_AT), // reveal during the nudge's linear burst
);

/** route: staged reveals — waterfall entry → nudge → label reveals in the burst */
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (i: number) => ({ display: "inline-block", ...arrival(frame, fps, WORDS[i]) });
  const l = (i: number) => ({ display: "inline-block", ...arrival(frame, fps, LABEL[i]) });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
          translate: `0px ${nudge(frame, fps, { at: NUDGE_AT, from: PARK, distance: -PARK })}px`,
        }}
      >
        <Interactive.Div
          name="Headline"
          style={{
            fontSize: T.display.size,
            fontWeight: T.display.weight,
            letterSpacing: `${T.display.tracking}em`,
            lineHeight: T.display.leading,
            whiteSpace: "nowrap",
          }}
        >
          <span style={w(0)}>Motion</span> <span style={w(1)}>that</span>{" "}
          <span style={w(2)}>mo</span>
          <span style={w(3)}>ves</span>
          <span style={w(4)}>.</span>
        </Interactive.Div>
        <Interactive.Div
          name="Label"
          style={{
            fontSize: T.label.size,
            fontWeight: T.label.weight,
            letterSpacing: `${T.label.tracking}em`,
            lineHeight: T.label.leading,
            textTransform: "uppercase",
            wordSpacing: "0.3em",
            color: tokens.color.inkMuted,
          }}
        >
          <span style={l(0)}>tezpi-motion</span> <span style={l(1)}>·</span> <span style={l(2)}>seam</span>{" "}
          <span style={l(3)}>doctrine</span>
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};
