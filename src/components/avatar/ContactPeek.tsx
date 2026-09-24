"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { AvatarFigure } from "./AvatarFigure";
import { DialogueBox } from "./DialogueBox";
import { AVATAR_TITLE, CONTACT_LINE, CONTACT_SCRIPT } from "./script";
import { useAvatar } from "./use-avatar";
import { useConversation } from "./use-conversation";
import { useOnScreen } from "./use-cues";
import { useGaze } from "./use-gaze";

/** Head and shoulders: the footer's base bar cuts him at the chest, so he peeks over it */
const PEEK_VIEWBOX = { x: 240, y: 70, w: 800, h: 800 };

/**
 * The avatar waiting in the Contact section. Rises over the base bar when the
 * section comes into view. Pointer or keyboard focus inside the section: he
 * smiles and says CONTACT_LINE. Touch screens (no hover) get the line once on
 * arrival instead. Click him for the greeting and question.
 */
export function ContactPeek({ className }: { className?: string }) {
  const reduce = !!useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const figure = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(root);
  const arrived = useOnScreen(root, 0.6);
  const avatar = useAvatar({ reduce, active: onScreen, parked: true });
  const gaze = useGaze(figure, PEEK_VIEWBOX, avatar.look, { enabled: onScreen, reduce });
  const chat = useConversation(avatar, gaze);
  const risen = useRef(false);
  const chatRef = useRef(chat);
  chatRef.current = chat;

  useEffect(() => {
    if (!arrived || risen.current) return;
    risen.current = true;
    avatar.beat("rise");
    if (window.matchMedia("(hover: none)").matches) {
      const t = setTimeout(() => {
        chatRef.current.react(null, CONTACT_LINE);
        chatRef.current.release(4200);
      }, 700);
      return () => clearTimeout(t);
    }
  }, [arrived, avatar]);

  // The whole Contact section is the cue: pointer inside or keyboard focus inside
  useEffect(() => {
    const section = root.current?.closest("footer");
    if (!section) return;
    const enter = (e: Event) => {
      // his own dialogue buttons take focus too: never interrupt the conversation with itself
      if (root.current?.contains(e.target as Node)) return;
      chatRef.current.react(null, CONTACT_LINE);
    };
    const leave = () => chatRef.current.release();
    const focusOut = (e: FocusEvent) => {
      if (!section.contains(e.relatedTarget as Node | null)) leave();
    };
    section.addEventListener("pointerenter", enter);
    section.addEventListener("pointerleave", leave);
    section.addEventListener("focusin", enter);
    section.addEventListener("focusout", focusOut);
    return () => {
      section.removeEventListener("pointerenter", enter);
      section.removeEventListener("pointerleave", leave);
      section.removeEventListener("focusin", enter);
      section.removeEventListener("focusout", focusOut);
    };
  }, []);

  return (
    <div ref={root} className={cn("relative", className)}>
      <p className="sr-only" aria-live="polite">
        {chat.line?.text ?? ""}
      </p>
      <div
        ref={figure}
        onClick={(e) => chat.greet(CONTACT_SCRIPT, e.detail === 0)}
        data-cursor="Say hi"
        className="relative aspect-square w-36 cursor-pointer overflow-hidden"
      >
        {/* Sun disc behind him, cut by the base bar: he rises like a sunrise, and his blue details read on it */}
        <span aria-hidden className="absolute top-[26%] left-1/2 size-[92%] -translate-x-1/2 rounded-full bg-sun" />
        <div className="relative h-full w-full">
          <AvatarFigure rig={avatar.rig} viewBox={PEEK_VIEWBOX} title={AVATAR_TITLE} />
        </div>
      </div>

      <AnimatePresence>
        {chat.line ? (
          <motion.div
            key="dialogue"
            className="absolute bottom-12 left-[9.25rem] right-0 max-w-[16rem]"
            style={{ transformOrigin: "0% 100%" }}
            initial={{ opacity: 0, scale: 0.92, x: -8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -4 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
          >
            <DialogueBox
              line={chat.line}
              reduce={reduce}
              focusChoices={chat.viaKeyboard}
              onTalk={avatar.talking}
              onTyped={chat.onTyped}
              onChoose={chat.choose}
              onClose={chat.close}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
