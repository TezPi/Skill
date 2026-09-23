"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type CopyState = "idle" | "copied" | "error";

export function useCopyToClipboard(resetAfter = 2000) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      clearTimeout(timer.current);
      try {
        await navigator.clipboard.writeText(text);
        setState("copied");
      } catch {
        setState("error");
      }
      timer.current = setTimeout(() => setState("idle"), resetAfter);
    },
    [resetAfter],
  );

  return { state, copy };
}
