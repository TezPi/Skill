"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRightIcon, ArrowUpRightIcon, XIcon } from "@phosphor-icons/react";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import type { Choice } from "./script";
import type { Line } from "./use-conversation";

const TYPE_MS = 30;

/**
 * Game-style dialogue box (pixel frame, like the brand's pixel type). Lines
 * type out while the avatar's mouth moves; click the text to finish a line.
 * The typed text is visual only: the parent's live region announces full lines.
 */
export function DialogueBox({
  line,
  reduce,
  focusChoices,
  onTalk,
  onTyped,
  onChoose,
  onClose,
  className,
}: {
  line: Line;
  reduce: boolean;
  focusChoices: boolean;
  onTalk: (on: boolean) => void;
  onTyped: () => void;
  onChoose: (c: Choice) => void;
  onClose: () => void;
  className?: string;
}) {
  const [typed, setTyped] = useState(0);
  const cursor = useRef(0);
  const firstChoice = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const done = typed >= line.text.length;

  // Typewriter, restarted for every new line
  useEffect(() => {
    const full = line.text.length;
    if (reduce) {
      setTyped(full);
      onTyped();
      return;
    }
    cursor.current = 0;
    setTyped(0);
    onTalk(true);
    const id = setInterval(() => {
      cursor.current = Math.min(full, cursor.current + 1);
      setTyped(cursor.current);
      if (cursor.current >= full) {
        clearInterval(id);
        onTalk(false);
        onTyped();
      }
    }, TYPE_MS);
    return () => {
      clearInterval(id);
      onTalk(false);
    };
    // one run per line; the callbacks are stable
  }, [line.id]);

  // Keyboard users who opened the chat land on the first answer
  useEffect(() => {
    if (done && focusChoices && line.choices) firstChoice.current?.focus({ preventScroll: true });
  }, [done, focusChoices, line.choices]);

  return (
    <div className={cn("pixel-corners bg-ink p-[3px] [--pixel:3px]", className)}>
      <div className="pixel-corners bg-panel px-3 pt-2 pb-3 [--pixel:2px]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.6875rem] leading-none font-bold tracking-[0.16em] text-sun uppercase">{site.brandName}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close conversation"
            data-cursor="Close"
            className="-mr-1.5 grid size-7 place-items-center rounded-control text-snow/70 transition-colors hover:bg-snow/10 hover:text-snow"
          >
            <XIcon size={14} weight="bold" aria-hidden />
          </button>
        </div>

        {/* Click to finish typing, like skipping a line in a game */}
        <p
          aria-hidden
          onClick={() => (cursor.current = line.text.length - 1)}
          className="mt-0.5 font-mono text-[0.875rem] leading-snug font-bold text-balance text-snow"
        >
          {line.text.slice(0, typed)}
          {!done ? <span className="ml-px inline-block h-[1em] w-[0.5em] translate-y-[0.15em] animate-[caret_0.8s_steps(1)_infinite] bg-sun" /> : null}
        </p>

        <AnimatePresence>
          {done && line.choices ? (
            <motion.div
              key={line.id}
              className="mt-2.5 flex flex-wrap gap-2"
              initial="hidden"
              animate="shown"
              variants={{ shown: { transition: { staggerChildren: 0.06 } } }}
            >
              {line.choices.map((c, i) => (
                <motion.div
                  key={c.id}
                  variants={{ hidden: { opacity: 0, y: 6 }, shown: { opacity: 1, y: 0 } }}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                >
                  <ChoiceButton choice={c} primary={i === 0} ref={i === 0 ? firstChoice : undefined} onChoose={onChoose} />
                </motion.div>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ChoiceButton({
  choice,
  primary,
  ref,
  onChoose,
}: {
  choice: Choice;
  primary: boolean;
  ref?: React.Ref<HTMLAnchorElement & HTMLButtonElement>;
  onChoose: (c: Choice) => void;
}) {
  const cls = cn(
    "inline-flex h-8 items-center gap-1.5 rounded-control px-3 font-mono text-[0.8125rem] font-bold whitespace-nowrap",
    "transition-[transform,background-color] duration-150 ease-snap active:translate-y-px",
    primary ? "bg-sun text-ink hover:bg-amber" : "text-snow ring-1 ring-snow/40 ring-inset hover:bg-snow/10",
  );
  if (!choice.href) {
    return (
      <button ref={ref} type="button" className={cls} onClick={() => onChoose(choice)}>
        {choice.label}
      </button>
    );
  }
  const mail = choice.href.startsWith("mailto:");
  const Icon = mail ? ArrowUpRightIcon : ArrowRightIcon;
  const content = (
    <>
      {choice.label}
      <Icon size={14} weight="bold" aria-hidden />
    </>
  );
  return mail ? (
    <a ref={ref} href={choice.href} className={cls} onClick={() => onChoose(choice)}>
      {content}
    </a>
  ) : (
    <Link ref={ref} href={choice.href} className={cls} onClick={() => onChoose(choice)}>
      {content}
    </Link>
  );
}
