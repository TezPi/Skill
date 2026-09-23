"use client";

import { useId, useRef } from "react";
import { cn } from "@/lib/cn";

/** Binary mode switch (control grammar: segmented = binary mode). Arrow keys move selection. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: readonly [{ value: T; label: string }, { value: T; label: string }];
  value: T;
  onChange: (v: T) => void;
  label: string;
  className?: string;
}) {
  const name = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = options.findIndex((o) => o.value === value);

  const onKey = (e: React.KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    const next = active === 0 ? 1 : 0;
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKey}
      className={cn("relative inline-grid grid-cols-2 rounded-control border border-line p-0.5 text-xs font-medium", className)}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-[8px] bg-fg transition-transform duration-500 ease-expo"
        style={{ transform: `translateX(${active * 100}%)` }}
      />
      {options.map((o, i) => (
        <button
          key={o.value}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          role="radio"
          name={name}
          aria-checked={i === active}
          tabIndex={i === active ? 0 : -1}
          onClick={() => onChange(o.value)}
          className={cn(
            "relative z-10 min-h-8 rounded-[8px] px-3 transition-colors duration-300",
            i === active ? "text-bg" : "text-fg-mid hover:text-fg",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
