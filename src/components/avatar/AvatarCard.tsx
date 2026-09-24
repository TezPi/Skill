"use client";

import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion, useTransform } from "motion/react";
import { HandWavingIcon } from "@phosphor-icons/react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { useIntro } from "@/components/intro/IntroProvider";
import { VIEWBOX } from "./avatar.config";
import { AvatarFigure } from "./AvatarFigure";
import { DialogueBox } from "./DialogueBox";
import { AVATAR_TITLE, CONTACT_LINE, HERO_SCRIPT } from "./script";
import { useAvatar } from "./use-avatar";
import { useConversation } from "./use-conversation";
import { useContactCue, useOnScreen } from "./use-cues";
import { useGaze } from "./use-gaze";

/**
 * Hero avatar card: a pixel-cut player card (brand pixel type, hard cobalt
 * shadow) holding the live character.
 *   - eyes, head and body follow the pointer anywhere on the page
 *   - click the portrait or "Say hi": greeting, then a question with answers
 *   - hover/focus a Contact control: smiles and says CONTACT_LINE
 */
export function AvatarCard() {
  const reduce = !!useReducedMotion();
  const { ready, cue } = useIntro();
  const root = useRef<HTMLElement>(null);
  const figure = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(root);
  const avatar = useAvatar({ reduce, active: onScreen });
  const gaze = useGaze(figure, VIEWBOX, avatar.look, { enabled: onScreen, reduce });
  const chat = useConversation(avatar, gaze);
  const busy = useRef(false);
  busy.current = chat.line !== null;

  // The halftone drifts against the gaze: a little depth behind the character
  const dotsX = useTransform(avatar.rig.gazeX, (v) => (reduce ? 0 : v * -8));
  const dotsY = useTransform(avatar.rig.gazeY, (v) => (reduce ? 0 : v * -6));

  // Arrival: he rises into the frame with the hero, then a quick happy beat
  useEffect(() => {
    if (!ready) return;
    const at = cue("hero");
    avatar.rig.bob.jump(reduce ? 0 : 460);
    const timers = [
      setTimeout(() => avatar.beat("rise"), (at + 0.2) * 1000),
      setTimeout(() => !busy.current && avatar.mood("happy"), (at + 0.8) * 1000),
      setTimeout(() => !busy.current && avatar.mood("neutral"), (at + 2.3) * 1000),
    ];
    return () => timers.forEach(clearTimeout);
    // once per page view
  }, [ready]);

  useContactCue({
    enabled: onScreen,
    onEnter: (el) => chat.react(el, CONTACT_LINE),
    onLeave: () => chat.release(),
  });

  const greet = (e: React.MouseEvent) => chat.greet(HERO_SCRIPT, e.detail === 0);
  const close = useCallback(() => {
    chat.close();
    root.current?.querySelector<HTMLElement>("[data-say-hi]")?.focus({ preventScroll: true });
  }, [chat]);

  return (
    <motion.figure
      ref={root}
      onKeyDown={(e) => {
        if (e.key === "Escape" && chat.line) close();
      }}
      className="relative w-full max-w-[21rem] pr-1.5 pb-1.5"
      initial={{ opacity: 0, y: 24 }}
      animate={ready ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay: cue("hero") + 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Always mounted, so screen readers announce every line (DialogueBox text is visual only) */}
      <p className="sr-only" aria-live="polite">
        {chat.line?.text ?? ""}
      </p>
      <div className="group/card relative">
        {/* Hard shadow stays put while the card lifts: the brand's "pressable" depth */}
        <div aria-hidden className="pixel-corners absolute inset-0 translate-x-1.5 translate-y-1.5 bg-cobalt-deep" />
        <div className="pixel-corners relative bg-ink p-[3px] transition-transform duration-200 ease-snap group-hover/card:-translate-x-0.5 group-hover/card:-translate-y-0.5">
          <div className="pixel-corners relative bg-snow p-2.5 [--pixel:3px]">
            <div className="pixel-corners bg-ink p-[3px] [--pixel:3px]">
              <div className="pixel-corners relative aspect-[5/6] overflow-hidden bg-sun [--pixel:2px]">
                <motion.div aria-hidden className="halftone absolute -inset-4" style={{ x: dotsX, y: dotsY }} />

                {/* Pointer/touch shortcut for "Say hi" (the button below is the keyboard path) */}
                <div ref={figure} onClick={greet} data-cursor="Say hi" className="absolute inset-0 cursor-pointer">
                  <AvatarFigure rig={avatar.rig} title={AVATAR_TITLE} />
                </div>

                <AnimatePresence>
                  {chat.line ? (
                    <motion.div
                      key="dialogue"
                      className="absolute inset-x-2 bottom-2"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    >
                      <DialogueBox
                        line={chat.line}
                        reduce={reduce}
                        focusChoices={chat.viaKeyboard}
                        onTalk={avatar.talking}
                        onTyped={chat.onTyped}
                        onChoose={chat.choose}
                        onClose={close}
                      />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>

            <figcaption className="flex items-end justify-between gap-3 px-1 pt-3.5 pb-1">
              <div className="min-w-0">
                <p className="font-mono text-[1.75rem] leading-none font-bold text-ink">{site.brandName}</p>
                <p className="label mt-2 text-putty-deep">{site.role}</p>
              </div>
              <Button data-say-hi onClick={greet} icon={<HandWavingIcon size={18} weight="bold" />}>
                Say hi
              </Button>
            </figcaption>
          </div>
        </div>
      </div>
    </motion.figure>
  );
}
