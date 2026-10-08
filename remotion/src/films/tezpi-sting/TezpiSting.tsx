import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { fontFamily, SeamScene, tokens } from "../../motion";
import { Claim } from "./Claim";
import { Hook } from "./Hook";
import { Payoff } from "./Payoff";

/**
 * Remotion port of films/tezpi-sting (HyperFrames). Same beats, same seams, same 243 frames.
 * <Series> = hard cuts with zero overlap; each SeamScene performs its own exit/entry so the
 * cut lands mid-motion on both sides (vector law). Ledger: films/tezpi-sting/ledger.json.
 *   2.6s hook → claim     cut-the-curve LEFT
 *   5.9s claim → payoff   inverse zoom (arrival), 10px text-scale blur
 */
export const TezpiSting: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: tokens.color.canvas, color: tokens.color.ink, fontFamily }}>
    <Series>
      <Series.Sequence name="Hook" durationInFrames={78}>
        <SeamScene durationInFrames={78} exit="cut-the-curve">
          <Hook />
        </SeamScene>
      </Series.Sequence>
      <Series.Sequence name="Claim" durationInFrames={99}>
        <SeamScene durationInFrames={99} enter="cut-the-curve" exit="inverse-zoom" blur={tokens.motion.blur.text}>
          <Claim />
        </SeamScene>
      </Series.Sequence>
      <Series.Sequence name="Payoff" durationInFrames={66}>
        <SeamScene durationInFrames={66} enter="inverse-zoom" blur={tokens.motion.blur.text}>
          <Payoff />
        </SeamScene>
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
