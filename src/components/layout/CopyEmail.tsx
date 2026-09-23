"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckIcon, CopyIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

const label = { idle: "Copy email", copied: "Copied", error: "Copy failed" } as const;

/** Recruiters copy addresses more than they click mailto; confirm it worked. */
export function CopyEmail({ email }: { email: string }) {
  const { state, copy } = useCopyToClipboard();
  const Icon = state === "copied" ? CheckIcon : state === "error" ? WarningCircleIcon : CopyIcon;

  return (
    <button
      type="button"
      onClick={() => copy(email)}
      className="inline-flex h-10 items-center gap-2 rounded-control px-3 font-mono text-nav font-bold text-snow ring-1 ring-inset ring-snow/40 transition-colors duration-150 hover:bg-snow/10 hover:ring-snow/70 active:bg-snow/15"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={state}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={state === "copied" ? "text-sun" : undefined}
        >
          <Icon size={18} weight="bold" aria-hidden />
        </motion.span>
      </AnimatePresence>
      <span aria-live="polite">{label[state]}</span>
    </button>
  );
}
