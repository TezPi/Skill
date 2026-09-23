"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { CheckIcon, CopyIcon } from "./icons";

/** Copies a value; confirms in place for 2s. Falls back to mailto if the clipboard is blocked. */
export function CopyButton({ value, label, className }: { value: string; label: string; className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
      window.location.href = `mailto:${value}`;
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "group/copy inline-flex min-h-11 items-center gap-2 rounded-control border border-line-strong px-3 text-sm font-medium text-fg transition-[border-color,background-color,transform] duration-300 ease-expo hover:border-fg hover:bg-fg/5 active:scale-[0.97]",
        className,
      )}
    >
      <span className="relative inline-grid size-4 place-items-center">
        <CopyIcon
          className={cn("[grid-area:1/1] transition-all duration-300 ease-expo", state === "copied" && "scale-50 opacity-0")}
        />
        <CheckIcon
          className={cn(
            "[grid-area:1/1] text-signal transition-all duration-300 ease-expo",
            state === "copied" ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        />
      </span>
      <span>{state === "copied" ? "Copied" : label}</span>
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? "Email address copied to clipboard" : ""}
      </span>
    </button>
  );
}
