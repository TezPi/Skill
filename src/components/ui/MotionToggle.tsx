"use client";

import { useMotionPreference } from "@/components/providers/MotionPreference";
import { cn } from "@/lib/cn";
import { PauseIcon, PlayIcon } from "./icons";

export function MotionToggle({ className }: { className?: string }) {
  const { paused, toggle } = useMotionPreference();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={paused}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-control px-2 text-xs font-medium text-fg-mid transition-colors hover:text-fg",
        className,
      )}
    >
      {paused ? <PlayIcon size={14} /> : <PauseIcon size={14} />}
      {paused ? "Play motion" : "Pause motion"}
    </button>
  );
}
