"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageSquareIcon, WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";
import type { MediaSlot } from "@/content/types";
import { cn } from "@/lib/cn";

type Status = "loading" | "loaded" | "error";

/**
 * Media slot with the full state cycle:
 * empty (no src) -> loading (shimmer) -> loaded | error (fallback frame).
 * The ratio is reserved up front, so nothing shifts when the image arrives.
 */
export function ImageSlot({
  slot,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  className,
  imgClassName,
}: {
  slot: MediaSlot;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  const [status, setStatus] = useState<Status>("loading");
  const empty = !slot.src;

  return (
    <div
      className={cn("relative aspect-(--ratio) w-full overflow-hidden bg-placeholder", className)}
      style={{ "--ratio": slot.ratio } as React.CSSProperties}
    >
      {empty || status === "error" ? (
        <EmptyFrame label={slot.label} ratio={slot.ratio} failed={status === "error"} />
      ) : (
        <>
          {status === "loading" ? <span aria-hidden className="skeleton absolute inset-0" /> : null}
          <Image
            src={slot.src!}
            alt={slot.alt ?? ""}
            fill
            sizes={sizes}
            priority={priority}
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("error")}
            className={cn(
              "object-cover transition-opacity duration-500 ease-out-expo",
              status === "loaded" ? "opacity-100" : "opacity-0",
              imgClassName,
            )}
          />
        </>
      )}
    </div>
  );
}

function EmptyFrame({ label, ratio, failed }: { label: string; ratio: string; failed?: boolean }) {
  const Icon = failed ? WarningCircleIcon : ImageSquareIcon;
  return (
    <div
      role="img"
      aria-label={failed ? `Image "${label}" failed to load` : `Image placeholder: ${label}`}
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-fg-muted"
    >
      <Icon size={28} weight="bold" aria-hidden />
      <span className="font-mono text-[0.75rem] font-bold tracking-[0.08em]">
        {failed ? "Couldn't load image" : `${label} · ${ratio.replace(/\s/g, "")}`}
      </span>
    </div>
  );
}
