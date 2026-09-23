"use client";

import { motion } from "motion/react";
import { profile } from "@/content/profile";
import { DURATION, EASE_EXPO, SPRING_POP, STAGGER } from "@/lib/motion";
import { ButtonLink } from "@/components/ui/Button";
import { SplitText } from "@/components/ui/SplitText";
import { TextRotator } from "@/components/ui/TextRotator";
import { SignalDot } from "@/components/ui/Tag";
import { MotionToggle } from "@/components/ui/MotionToggle";
import { SignalField } from "./SignalField";

// Name timeline: "Hồ Phú" then "Thịnh", each char 0.07s, a beat between words, then the dot pops.
const NAME_1 = "Hồ Phú";
const NAME_2 = "Thịnh";
const t0 = 0.25;
const t1 = t0 + NAME_1.replace(" ", "").length * STAGGER.char + STAGGER.wordGap * 2;
const tDot = t1 + NAME_2.length * STAGGER.char + 0.35;
const tRest = tDot + 0.1;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 20, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: DURATION.slow, ease: EASE_EXPO, delay },
});

export function Hero() {
  return (
    <section aria-labelledby="hero-name" className="relative isolate flex min-h-svh flex-col overflow-hidden pt-24 pb-8 md:pt-28">
      <div
        className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_75%_70%_at_70%_40%,black_35%,transparent_100%)]"
        aria-hidden="true"
      >
        <SignalField />
      </div>

      <div className="container-page flex flex-1 flex-col">
        {/* Meta strip — console grammar: breadcrumb left, live status right */}
        <motion.div
          {...rise(0.05)}
          className="text-overline flex items-center justify-between gap-4 border-b border-line pb-4 text-fg-lo"
        >
          <span>
            {profile.studio} / <span className="hidden sm:inline">Portfolio </span>2026
          </span>
          <span className="flex items-center gap-2.5 text-fg-mid">
            <SignalDot breathe />
            <span className="hidden xs:inline">{profile.availability}</span>
            <span className="xs:hidden">Available</span>
          </span>
        </motion.div>

        <div className="flex flex-1 flex-col justify-center py-12 md:py-16">
          <motion.p {...rise(0.1)} className="text-overline mb-6 text-fg-mid md:mb-8">
            {profile.heroLine}
          </motion.p>

          <h1 id="hero-name" className="text-mega">
            <span className="sr-only">
              {profile.name}, {profile.role}
            </span>
            <span aria-hidden="true" className="block">
              <SplitText as="span" text={NAME_1} by="char" trigger="mount" delay={t0} className="block" />
              <span className="block md:pl-[16vw]">
                <SplitText as="span" text={NAME_2} by="char" trigger="mount" delay={t1} className="inline" />
                <motion.span
                  className="inline-block text-signal"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ ...SPRING_POP, delay: tDot }}
                >
                  .
                </motion.span>
              </span>
            </span>
          </h1>

          <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-12 lg:items-end">
            <motion.p {...rise(tRest)} className="text-lead max-w-[36ch] text-fg lg:col-span-6">
              {profile.positioning}
            </motion.p>
            <motion.div
              {...rise(tRest + 0.12)}
              className="flex flex-wrap items-center gap-3 lg:col-span-6 lg:justify-end"
            >
              <ButtonLink href="#work" size="lg" runner>
                View selected work
              </ButtonLink>
              <ButtonLink href="/about" variant="secondary" size="lg" arrow={false}>
                About me
              </ButtonLink>
              <ButtonLink href="/resume" variant="ghost" size="lg" className="px-2">
                Résumé
              </ButtonLink>
            </motion.div>
          </div>
        </div>

        <motion.div
          {...rise(tRest + 0.3)}
          className="flex flex-col gap-3 border-t border-line pt-4 text-sm text-fg-mid sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="flex min-h-11 items-center gap-2">
            <span className="text-fg-lo">Now:</span>
            <TextRotator items={profile.now} className="text-fg" />
          </p>
          <div className="flex items-center gap-3 text-xs text-fg-lo">
            <span className="hidden md:inline">Fig. 01: One signal, many dots. Colour speaks once.</span>
            <MotionToggle className="-mr-2" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
