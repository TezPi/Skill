/*
 * Drawn parts: only what the master bust does not show (forearms, hands, lower
 * shirt, pants, sneakers, mouth states, reaction marks). Same palette, same
 * line weight, same rounded bold outline as the traced master.
 */
import { BLUE, INK, LINE, WHITE } from "./character.config";

const stroke = { stroke: INK, strokeWidth: LINE, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" } as const;

export type HandPose = "rest" | "wave" | "point";
export type MouthPose = "none" | "smile" | "open" | "talk" | "sad" | "flat";

/* ---------- Lower shirt: continues the traced shirt under the sleeve hems ---------- */
export function LowerShirt() {
  return (
    <g>
      <path d="M440 1066 L853 1066 L866 1236 Q660 1254 446 1232 Z" fill={WHITE} />
      <path d="M848.5 1074 L864 1234 Q660 1252 447 1231 L452 1074" {...stroke} />
      {/* the master's shirt fold, carried down */}
      <path d="M561 1080 L548 1158" {...stroke} />
    </g>
  );
}

/* ---------- Forearms (open at the top: they emerge from the traced sleeves) ---------- */
export function ForearmFar({ hand }: { hand: HandPose }) {
  return (
    <g>
      <path d="M375 1050 L388 1294 L466 1294 L481 1050 Z" fill={WHITE} />
      <path d="M375 1058 L388 1292 M481 1058 L466 1292" {...stroke} />
      <Hand pose={hand} cx={427} cy={1290} w={82} mirror />
    </g>
  );
}

export function ForearmNear({ hand }: { hand: HandPose }) {
  return (
    <g>
      <path d="M848 1056 L855 1292 L903 1292 L912 1052 Z" fill={WHITE} />
      <path d="M848 1064 L855 1290 M912 1060 L903 1290" {...stroke} />
      <Hand pose={hand} cx={879} cy={1288} w={62} />
    </g>
  );
}

/** Hands point along the forearm (down in rest pose). `mirror` flips the thumb side. */
function Hand({ pose, cx, cy, w, mirror }: { pose: HandPose; cx: number; cy: number; w: number; mirror?: boolean }) {
  const h = w / 2;
  const flip = mirror ? `translate(${cx * 2} 0) scale(-1 1)` : undefined;
  if (pose === "point") {
    return (
      <g transform={flip}>
        <path d={`M${cx - h} ${cy - 2} C${cx - h - 4} ${cy + 26} ${cx - h + 6} ${cy + 46} ${cx} ${cy + 48} C${cx + h - 4} ${cy + 46} ${cx + h + 4} ${cy + 26} ${cx + h} ${cy - 2} Z`} fill={WHITE} {...{ stroke: INK, strokeWidth: LINE, strokeLinejoin: "round" }} />
        {/* index finger */}
        <path d={`M${cx + h * 0.15} ${cy + 40} L${cx + h * 0.2} ${cy + 104} Q${cx + h * 0.2 + 12} ${cy + 118} ${cx + h * 0.2 + 24} ${cy + 104} L${cx + h * 0.55} ${cy + 36}`} fill={WHITE} {...{ stroke: INK, strokeWidth: LINE, strokeLinejoin: "round", strokeLinecap: "round" }} />
      </g>
    );
  }
  if (pose === "wave") {
    // open palm, four fingertips
    const f = (w + 8) / 4;
    const tips = [0, 1, 2, 3].map((i) => `Q${cx - h - 4 + f * i + f / 2} ${cy + 96 - Math.abs(i - 1.5) * 10} ${cx - h - 4 + f * (i + 1)} ${cy + 64}`).join(" ");
    return (
      <g transform={flip}>
        <path d={`M${cx - h} ${cy - 2} L${cx - h - 4} ${cy + 64} ${tips} L${cx + h} ${cy - 2} Z`} fill={WHITE} {...{ stroke: INK, strokeWidth: LINE, strokeLinejoin: "round" }} />
        {/* thumb */}
        <path d={`M${cx + h} ${cy + 18} Q${cx + h + 30} ${cy + 22} ${cx + h + 26} ${cy + 46}`} {...stroke} />
      </g>
    );
  }
  return (
    <g transform={flip}>
      <path d={`M${cx - h} ${cy - 2} C${cx - h - 6} ${cy + 34} ${cx - h + 4} ${cy + 64} ${cx + 2} ${cy + 66} C${cx + h} ${cy + 64} ${cx + h + 8} ${cy + 32} ${cx + h} ${cy - 2} Z`} fill={WHITE} {...{ stroke: INK, strokeWidth: LINE, strokeLinejoin: "round" }} />
      <path d={`M${cx + h * 0.35} ${cy + 16} Q${cx + h * 0.55} ${cy + 34} ${cx + h * 0.3} ${cy + 46}`} {...stroke} />
    </g>
  );
}

/* ---------- Legs: baggy blue pants in two segments + white sneakers ---------- */
export function Thigh({ side }: { side: "far" | "near" }) {
  const [l, r, top, bot] = side === "far" ? [458, 656, 1188, 1522] : [644, 874, 1192, 1532];
  return (
    <g>
      {/* knee cap, under both segments: fills the wedge a bent knee opens, never covers an outline */}
      <circle cx={(l + r) / 2} cy={bot - 16} r={(r - l) / 2 + 2} fill={BLUE} />
      <path d={`M${l} ${top} L${r} ${top} L${r + 2} ${bot} L${l - 2} ${bot} Z`} fill={BLUE} />
      <path d={`M${l} ${top + 6} L${l - 2} ${bot} M${r} ${top + 6} L${r + 2} ${bot}`} {...stroke} />
      <path d={side === "far" ? "M512 1452 q22 -14 44 0" : "M704 1466 q24 -14 48 0"} {...stroke} strokeWidth={LINE * 0.8} />
    </g>
  );
}

export function Shin({ side }: { side: "far" | "near" }) {
  const far = side === "far";
  const [l, r, top, bot] = far ? [456, 658, 1500, 1792] : [642, 876, 1510, 1808];
  const mid = (l + r) / 2;
  return (
    <g>
      <Shoe side={side} />
      <path d={`M${l} ${top} L${r} ${top} L${r + 5} ${bot} Q${mid} ${bot + 16} ${l - 3} ${bot - 2} Z`} fill={BLUE} />
      <path d={`M${l} ${top} L${l - 3} ${bot - 2} Q${mid} ${bot + 16} ${r + 5} ${bot} L${r} ${top}`} {...stroke} />
      {/* pooled hem folds */}
      <path d={far ? "M492 1726 q20 -12 40 0 M580 1742 q18 -10 36 2" : "M676 1738 q22 -12 44 0 M770 1754 q20 -10 40 2"} {...stroke} strokeWidth={LINE * 0.8} />
    </g>
  );
}

function Shoe({ side }: { side: "far" | "near" }) {
  const [x, y, w] = side === "far" ? [440, 1764, 278] : [626, 1780, 300];
  const h = 86;
  return (
    <g>
      <path
        d={`M${x} ${y + 20} C${x} ${y - 4} ${x + w * 0.35} ${y - 8} ${x + w * 0.6} ${y + 2} C${x + w * 0.86} ${y + 12} ${x + w} ${y + 30} ${x + w} ${y + 56} C${x + w} ${y + h} ${x + w - 14} ${y + h + 2} ${x + w - 34} ${y + h + 2} L${x + 20} ${y + h + 2} C${x + 4} ${y + h + 2} ${x - 2} ${y + h - 12} ${x} ${y + 20} Z`}
        fill={WHITE}
        {...{ stroke: INK, strokeWidth: LINE, strokeLinejoin: "round" }}
      />
      {/* sole line + toe cap */}
      <path d={`M${x + 6} ${y + h - 16} L${x + w - 6} ${y + h - 16} M${x + w * 0.72} ${y + 14} Q${x + w * 0.8} ${y + 40} ${x + w - 4} ${y + 44}`} {...stroke} strokeWidth={LINE * 0.8} />
      {/* small blue accent (spec: white sneakers, blue/black accents) */}
      <path d={`M${x + w * 0.2} ${y + 42} Q${x + w * 0.4} ${y + 28} ${x + w * 0.58} ${y + 40}`} stroke={BLUE} strokeWidth={LINE * 1.1} strokeLinecap="round" fill="none" />
    </g>
  );
}

/* ---------- Face extras (all inside the head group) ---------- */
export function Mouth({ pose }: { pose: MouthPose }) {
  switch (pose) {
    case "smile":
      return <path d="M768 506 Q782 522 798 504" {...stroke} strokeWidth={9} />;
    case "open":
      return <ellipse cx={782} cy={514} rx={8} ry={11} fill={INK} />;
    case "talk":
      return <ellipse cx={782} cy={512} rx={9} ry={6} fill={INK} />;
    case "sad":
      return <path d="M768 520 Q782 506 798 520" {...stroke} strokeWidth={9} />;
    case "flat":
      return <path d="M771 512 L794 511" {...stroke} strokeWidth={9} />;
    default:
      return null;
  }
}

/** The master's blue "surprise" dashes, redrawn at their exact positions. */
export const MARKS = "M312 489 L358 510 M302 553 L358 547 M892 510 L938 482 M898 546 L956 547";

/** Sitting prop: a plain box in the palette (object interaction, spec section 12). */
export function Stool() {
  return (
    <g>
      <path d="M452 1420 L812 1420 L812 1872 L452 1872 Z" fill={WHITE} {...{ stroke: INK, strokeWidth: LINE, strokeLinejoin: "round" }} />
      <path d="M452 1420 L506 1378 L866 1378 L812 1420 M866 1378 L866 1830 L812 1872" {...stroke} fill={WHITE} />
      <path d="M506 1520 L758 1520" stroke={BLUE} strokeWidth={LINE * 1.4} strokeLinecap="round" />
    </g>
  );
}
