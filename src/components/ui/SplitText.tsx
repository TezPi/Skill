"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { DURATION, EASE_EXPO, STAGGER } from "@/lib/motion";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

/**
 * Masked rise with blur-to-focus.
 * - by="char": 0.07s per character plus a pause between words, so names read as words.
 * - by="word": for longer headlines.
 * The mask is padded vertically so Vietnamese stacked diacritics (ồ, ị, ữ) never clip.
 */
export function SplitText({
  text,
  as = "h2",
  by = "word",
  className,
  delay = 0,
  trigger = "inView",
  wordClassName,
  id,
  lang,
}: {
  id?: string;
  lang?: string;
  text: string;
  as?: Tag;
  by?: "char" | "word";
  className?: string;
  delay?: number;
  trigger?: "mount" | "inView";
  wordClassName?: string;
}) {
  const Comp = motion[as] as typeof motion.h2;
  const words = text.normalize("NFC").split(" ");

  // Start time per word: chars accumulate, plus a beat between words in char mode.
  const timeline = words.reduce<number[]>((acc, _word, i) => {
    if (i === 0) return [delay];
    const prev = words[i - 1];
    const step = by === "char" ? prev.length * STAGGER.char + STAGGER.wordGap : STAGGER.word;
    return [...acc, acc[i - 1] + step];
  }, []);

  const play = trigger === "mount" ? { animate: "shown" } : { whileInView: "shown", viewport: { once: true, amount: 0.6 } };

  return (
    <Comp id={id} lang={lang} className={className} initial="hidden" {...play}>
      <span className="sr-only">{text}</span>
      {words.map((word, wi) => (
        <span key={wi} aria-hidden="true">
          <span
            className={cn(
              "inline-block overflow-hidden align-top",
              "-mt-[0.3em] pt-[0.3em] -mb-[0.34em] pb-[0.34em] -mx-[0.04em] px-[0.04em]",
              wordClassName,
            )}
          >
            {by === "char" ? (
              Array.from(word).map((ch, ci) => (
                <Piece key={ci} delay={timeline[wi] + ci * STAGGER.char}>
                  {ch}
                </Piece>
              ))
            ) : (
              <Piece delay={timeline[wi]}>{word}</Piece>
            )}
          </span>
          {wi < words.length - 1 && " "}
        </span>
      ))}
    </Comp>
  );
}

function Piece({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.span
      className="inline-block will-change-transform"
      variants={{
        hidden: { y: "110%", opacity: 0, filter: "blur(8px)" },
        shown: { y: "0%", opacity: 1, filter: "blur(0px)" },
      }}
      transition={{ duration: DURATION.slow, ease: EASE_EXPO, delay }}
    >
      {children}
    </motion.span>
  );
}
