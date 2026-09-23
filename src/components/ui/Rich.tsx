import { Fragment } from "react";

/**
 * Renders content strings. Any [bracketed] segment is an unfilled fact and
 * shows as a dashed chip, so a placeholder can never ship unnoticed.
 */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("[") && part.endsWith("]") ? (
          <Placeholder key={i}>{part.slice(1, -1)}</Placeholder>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

export function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <span
      title="Placeholder. Replace with real content in src/content."
      className="mx-0.5 inline rounded-chip border border-dashed border-line-strong px-1.5 py-px align-baseline text-[0.85em] font-normal text-fg-lo not-italic [box-decoration-break:clone]"
    >
      {children}
    </span>
  );
}

export const isPlaceholder = (s: string) => /^\[[^\]]+\]$/.test(s.trim());
