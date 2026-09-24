"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useTransform } from "motion/react";
import {
  ArrowFatLineUpIcon,
  ChairIcon,
  ChatCircleDotsIcon,
  HandPointingIcon,
  HandWavingIcon,
  HashIcon,
  MoonStarsIcon,
  PersonSimpleRunIcon,
  PersonSimpleWalkIcon,
  type Icon,
} from "@phosphor-icons/react";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { useIntro } from "@/components/intro/IntroProvider";
import { CharacterRig, VIEWBOX } from "./CharacterRig";
import { useCharacter } from "./use-character";
import type { ActionName } from "./actions";

const LINES = ["Hi, I'm Thịnh!", "I design product interfaces.", "Want to see my work?", "Thanks for stopping by!"];

const STATE_LABEL: Record<ActionName, string> = {
  idle: "Idle", wave: "Waving", point: "Pointing", talk: "Talking", greet: "Greeting", jump: "Jumping",
  walk: "Walking", run: "Running", sit: "Sitting", sleep: "Sleeping", wake: "Waking up",
};

/** Master-space point the gaze is measured from (between the lenses) */
const HEAD_CENTER = { x: 760, y: 430 };

/**
 * Hero stage: the master character on a white Figma artboard ("thinh.character").
 * Interactions: follows the pointer with eyes + head, waves on hover, jumps on
 * click, points at anything marked data-character-cue, dozes off when ignored,
 * and exposes every action in the toolbar below (keyboard accessible).
 */
export function CharacterStage() {
  const reduce = !!useReducedMotion();
  const { ready, cue } = useIntro();
  const stage = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(true);
  const ctrl = useCharacter({ reduce, active: visible });
  const { play, look, poke, state, actionRef } = ctrl;
  const art = useRef<HTMLDivElement>(null);
  const lineIndex = useRef(0);
  const lastWave = useRef(0);
  const groundX = useTransform(ctrl.rig.ground, (g) => g * 100);

  // Arrival: greet once the hero is visible
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => play("greet", { text: LINES[0] }), (cue("hero") + 0.9) * 1000);
    return () => clearTimeout(t);
    // one-shot when the page becomes visible; play/cue intentionally not deps
  }, [ready]);

  // Idle loops only run while the stage is on screen
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Gaze follows the pointer anywhere on the page; pointing cues from the page
  useEffect(() => {
    let cueEl: Element | null = null;
    const toMaster = () => {
      const box = art.current?.getBoundingClientRect();
      if (!box) return null;
      const s = VIEWBOX.w / box.width;
      return { box, s, hx: box.left + (HEAD_CENTER.x - VIEWBOX.x) / s, hy: box.top + (HEAD_CENTER.y - VIEWBOX.y) / s };
    };
    const onMove = (e: PointerEvent) => {
      const m = toMaster();
      if (!m) return;
      look((e.clientX - m.hx) * m.s, (e.clientY - m.hy) * m.s);
      poke();
    };
    const onOver = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.("[data-character-cue]") ?? null;
      if (el === cueEl) return;
      cueEl = el;
      const m = toMaster();
      if (el && m) {
        const r = el.getBoundingClientRect();
        play("point", { dir: r.left + r.width / 2 < m.box.left + m.box.width / 2 ? "left" : "right", text: el.getAttribute("data-character-cue") || undefined });
      } else if (actionRef.current === "point") {
        play("idle");
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
    };
  }, [look, poke, play, actionRef]);

  const toggle = (name: ActionName) => play(state.action === name ? "idle" : name);
  const controls: { id: ActionName; label: string; icon: Icon; run: () => void; pressed?: boolean }[] = [
    { id: "wave", label: "Wave", icon: HandWavingIcon, run: () => play("wave") },
    { id: "point", label: "Point", icon: HandPointingIcon, run: () => play("point", { dir: "left", text: "My work is right there!" }) },
    {
      id: "talk",
      label: "Talk",
      icon: ChatCircleDotsIcon,
      run: () => {
        lineIndex.current = (lineIndex.current + 1) % LINES.length;
        play("talk", { text: LINES[lineIndex.current] });
      },
    },
    { id: "jump", label: "Jump", icon: ArrowFatLineUpIcon, run: () => play("jump") },
    { id: "walk", label: "Walk", icon: PersonSimpleWalkIcon, run: () => toggle("walk"), pressed: state.action === "walk" },
    { id: "run", label: "Run", icon: PersonSimpleRunIcon, run: () => toggle("run"), pressed: state.action === "run" },
    { id: "sit", label: "Sit", icon: ChairIcon, run: () => toggle("sit"), pressed: state.action === "sit" },
    {
      id: "sleep",
      label: "Sleep",
      icon: MoonStarsIcon,
      run: () => play(state.action === "sleep" ? "wake" : "sleep"),
      pressed: state.action === "sleep",
    },
  ];

  return (
    <figure ref={stage} className="w-[19.5rem] sm:w-[21rem]">
      <figcaption className="mb-2 flex items-center justify-between font-mono text-[0.75rem] font-bold text-cream">
        <span className="inline-flex items-center gap-1.5">
          <HashIcon size={13} weight="bold" aria-hidden />
          thinh.character
        </span>
        <span className="rounded-mark bg-snow/15 px-1.5 py-0.5 text-snow">{STATE_LABEL[state.action]}</span>
      </figcaption>

      <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-snow shadow-[0_28px_50px_-24px_rgb(11_11_12/0.6)] ring-1 ring-ink/10">
        <button
          type="button"
          data-cursor="Click me"
          aria-label={`Make ${site.brandName} jump`}
          onClick={() => play("jump")}
          onPointerEnter={() => {
            if (actionRef.current === "idle" && Date.now() - lastWave.current > 5000) {
              lastWave.current = Date.now();
              play("wave");
            }
          }}
          className="absolute inset-x-0 bottom-[3%] mx-auto block h-[86%] focus-visible:outline-offset-[-6px]"
          style={{ aspectRatio: `${VIEWBOX.w} / ${VIEWBOX.h}` }}
        >
          <div ref={art} className="h-full w-full">
            <CharacterRig ctrl={ctrl} groundX={groundX} title={`${site.brandName}, an animated cartoon of the designer: messy black hair, black glasses, white T-shirt, blue pants and a blue backpack`} />
          </div>
        </button>

        {/* Speech bubble */}
        <AnimatePresence>
          {state.say ? (
            <motion.p
              key={state.say}
              aria-live="polite"
              className="pointer-events-none absolute top-4 left-4 max-w-[62%] rounded-[14px] border-[3px] border-ink bg-snow px-3 py-2 font-mono text-[0.8125rem] leading-snug font-bold text-ink shadow-[3px_3px_0_rgb(25_89_187/0.9)]"
              style={{ transformOrigin: "85% 110%" }}
              initial={{ opacity: 0, scale: 0.7, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -4 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
            >
              {state.say}
              <span aria-hidden className="absolute -bottom-[11px] right-8 size-4 rotate-45 border-r-[3px] border-b-[3px] border-ink bg-snow" />
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>

      <div role="toolbar" aria-label="Character actions" className="mt-3 flex items-center justify-between gap-0.5 rounded-card bg-panel p-1.5 shadow-[0_14px_30px_-14px_rgb(11_11_12/0.6)] ring-1 ring-snow/10">
        {controls.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-label={c.label}
            aria-pressed={c.pressed}
            title={c.label}
            data-cursor={c.label}
            onClick={c.run}
            className={cn(
              "grid size-9 place-items-center rounded-control transition-colors duration-150",
              c.pressed || state.action === c.id ? "bg-cobalt text-snow" : "text-snow/75 hover:bg-snow/10 hover:text-snow",
            )}
          >
            <c.icon size={18} weight={c.pressed ? "fill" : "bold"} aria-hidden />
          </button>
        ))}
      </div>
    </figure>
  );
}
