import type { SpecimenKey } from "@/content/types";
import { ConsoleSpecimen } from "./ConsoleSpecimen";
import { MotionSpecimen } from "./MotionSpecimen";
import { TokenSpecimen } from "./TokenSpecimen";

const map: Record<SpecimenKey, () => React.ReactElement> = {
  console: ConsoleSpecimen,
  tokens: TokenSpecimen,
  motion: MotionSpecimen,
};

export const specimenCaption: Record<SpecimenKey, string> = {
  console: "Console card anatomy, redrawn in this site's palette. One blue: the action that needs doing.",
  tokens: "Token sheet and control grammar. Every shape has one meaning.",
  motion: "The master easing curve, drawn live. x = time, y = progress.",
};

export function Specimen({ kind }: { kind: SpecimenKey }) {
  const Comp = map[kind];
  return <Comp />;
}
