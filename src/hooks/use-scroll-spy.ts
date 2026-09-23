"use client";

import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently crossing the reading line
 * (a band ~40% down the viewport). IntersectionObserver only: no scroll listeners.
 */
export function useScrollSpy(ids: readonly string[], rootMargin = "-40% 0px -55% 0px") {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|");

  useEffect(() => {
    const targets = key
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key, rootMargin]);

  return active;
}
