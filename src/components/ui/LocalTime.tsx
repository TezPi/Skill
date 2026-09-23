"use client";

import { useSyncExternalStore } from "react";

function subscribe(cb: () => void) {
  const id = window.setInterval(cb, 10_000);
  return () => window.clearInterval(id);
}

/** Designer's local time — tells a recruiter abroad when a reply is likely. */
export function LocalTime({ timeZone }: { timeZone: string }) {
  const time = useSyncExternalStore(
    subscribe,
    () =>
      new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone, hour12: false }).format(
        new Date(),
      ),
    () => null,
  );
  return (
    <time suppressHydrationWarning className="tabular-nums">
      {time ?? "--:--"}
    </time>
  );
}
