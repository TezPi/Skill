"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  /** Shown if the image fails: a titled halftone panel instead of a broken icon. */
  fallback: string;
  priority?: boolean;
  className?: string;
};

/** Placeholder (halftone) -> image fade-in -> error panel. Always tritone, so every photo speaks the palette. */
export function ComicImage({ src, alt, sizes, fallback, priority, className }: Props) {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
  const img = useRef<HTMLImageElement>(null);

  // The image may finish before hydration, when onLoad has no listener yet.
  useEffect(() => {
    const node = img.current;
    if (node?.complete) setState(node.naturalWidth ? "loaded" : "error");
  }, []);

  return (
    <div className={cn("relative overflow-hidden bg-bg-alt", className)}>
      <div
        aria-hidden="true"
        className={cn("halftone absolute inset-0 transition-opacity duration-500", state === "loaded" ? "opacity-0" : "opacity-30")}
      />
      {state === "error" ? (
        <div role="img" aria-label={alt} className="absolute inset-0 grid place-items-center p-6">
          <span className="text-center text-[clamp(2rem,5vw,4rem)] font-black leading-none tracking-tight text-fg/80">{fallback}</span>
        </div>
      ) : (
        <Image
          ref={img}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onLoad={() => setState("loaded")}
          onError={() => setState("error")}
          className={cn(
            "tritone object-cover transition-[opacity,scale] duration-700 ease-snap group-hover:scale-105",
            state === "loaded" ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
}
