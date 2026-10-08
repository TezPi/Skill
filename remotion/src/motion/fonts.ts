import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { tokens } from "./tokens.generated";

const { family, file, weight } = tokens.font.sans;

/** Same variable font file the HyperFrames films vendor (public/fonts/, synced by build-tokens). */
export const fontsReady = loadFont({ family, url: staticFile(`fonts/${file}`), weight });

export const fontFamily = `"${family}", ${tokens.font.sans.fallback}`;
