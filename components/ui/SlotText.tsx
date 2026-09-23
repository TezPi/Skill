import { Fragment } from "react";

const SLOT = /(\[Insert[^\]]*\])/g;
const IS_SLOT = /^\[Insert[^\]]*\]$/;

/**
 * Renders content strings. Any "[Insert ...]" part shows as a dashed slot,
 * so missing facts stay visible instead of being invented.
 */
export function SlotText({ text }: { text: string }) {
  const parts = text.split(SLOT);
  return (
    <>
      {parts.map((part, i) =>
        IS_SLOT.test(part) ? (
          <em key={i} className="slot" title="Placeholder: replace in /content">
            {part.slice(1, -1).replace(/^Insert\s*/, "")}
          </em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

export const isSlot = (text: string) => IS_SLOT.test(text.trim());
