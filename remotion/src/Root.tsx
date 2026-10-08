import React from "react";
import { AbsoluteFill, Composition, Folder } from "remotion";
import { Claim } from "./films/tezpi-sting/Claim";
import { Hook } from "./films/tezpi-sting/Hook";
import { Payoff } from "./films/tezpi-sting/Payoff";
import { TezpiSting } from "./films/tezpi-sting/TezpiSting";
import { fontFamily, tokens } from "./motion";

const { width, height, fps } = tokens.canvas;

// Standalone scene preview on the film's ground (connected-composition pattern).
const onGround = (Scene: React.FC) => {
  const Wrapped: React.FC = () => (
    <AbsoluteFill style={{ backgroundColor: tokens.color.canvas, color: tokens.color.ink, fontFamily }}>
      <Scene />
    </AbsoluteFill>
  );
  return Wrapped;
};

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="TezpiSting-Scenes">
      <Composition id="TezpiSting-Hook" component={onGround(Hook)} width={width} height={height} fps={fps} durationInFrames={78} />
      <Composition id="TezpiSting-Claim" component={onGround(Claim)} width={width} height={height} fps={fps} durationInFrames={99} />
      <Composition id="TezpiSting-Payoff" component={onGround(Payoff)} width={width} height={height} fps={fps} durationInFrames={66} />
    </Folder>
    <Composition id="TezpiSting" component={TezpiSting} width={width} height={height} fps={fps} durationInFrames={243} />
  </>
);
