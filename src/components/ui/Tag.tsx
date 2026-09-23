import { cn } from "@/lib/cn";

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-chip border border-line px-2 py-0.5 text-xs font-medium tracking-tight text-fg-mid",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Live-status dot. The only place colour carries state. */
export function SignalDot({ className, breathe = false }: { className?: string; breathe?: boolean }) {
  return (
    <span aria-hidden="true" className={cn("relative inline-flex size-2 shrink-0", className)}>
      {breathe && <span className="animate-breathe absolute inset-0 rounded-full bg-signal/40 [transform-origin:center]" />}
      <span className="relative inline-flex size-2 rounded-full bg-signal" />
    </span>
  );
}
