"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AvatarController } from "./use-avatar";
import type { GazeController } from "./use-gaze";
import type { Choice, Script } from "./script";

export interface Line {
  id: number;
  text: string;
  choices?: readonly Choice[];
}

type Mode = "idle" | "chat" | "cue";

/**
 * Conversation runner shared by every avatar placement. One flow at a time:
 * a new flow cancels the previous one (token), so a Contact hover can cut in
 * on the greeting without two scripts fighting over the mouth and gaze.
 */
export function useConversation(avatar: AvatarController, gaze: GazeController) {
  const [line, setLine] = useState<Line | null>(null);
  const [viaKeyboard, setViaKeyboard] = useState(false);
  const token = useRef(0);
  const seq = useRef(0);
  const mode = useRef<Mode>("idle");
  const asking = useRef(false);
  const typed = useRef<(() => void) | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const lit = useRef<HTMLElement | null>(null);

  const later = (ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  };
  const pause = (ms: number) => new Promise<void>((resolve) => later(ms, resolve));
  const say = (text: string, choices?: readonly Choice[]) =>
    new Promise<void>((resolve) => {
      typed.current = resolve;
      setLine({ id: ++seq.current, text, choices });
    });

  const unlight = () => {
    if (lit.current) delete lit.current.dataset.attention;
    lit.current = null;
  };

  const close = useCallback(() => {
    token.current++;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    typed.current = null;
    mode.current = "idle";
    asking.current = false;
    unlight();
    setLine(null);
    avatar.talking(false);
    avatar.mood("neutral");
    avatar.settle();
    gaze.hold(null);
  }, [avatar, gaze]);

  const begin = (next: Mode) => {
    close();
    mode.current = next;
    return token.current;
  };

  /** GREETING + QUESTION (click / "Say hi") */
  const greet = useCallback(
    async (script: Script, keyboard = false) => {
      // Already waiting on an answer: acknowledge the click, keep the question up
      if (asking.current) {
        avatar.beat("pop");
        return;
      }
      const t = begin("chat");
      setViaKeyboard(keyboard);
      avatar.mood("surprised");
      avatar.beat("pop");
      await pause(360);
      if (t !== token.current) return;
      avatar.mood("happy");
      await say(script.greeting);
      if (t !== token.current) return;
      await pause(520);
      if (t !== token.current) return;
      avatar.beat("tilt");
      asking.current = true;
      await say(script.question.text, script.question.choices);
      if (t !== token.current) return;
      later(16000, close); // unanswered questions fold away
    },
    // begin/say/pause only touch refs and stable setters
    [avatar, close],
  );

  /** An answer that stays on the page: reply, look at the target, highlight it */
  const choose = useCallback(
    async (choice: Choice) => {
      if (choice.href) {
        close();
        return;
      }
      const t = begin("chat");
      avatar.mood("happy");
      const target = choice.attention ? document.querySelector<HTMLElement>(`[data-avatar-target="${choice.attention}"]`) : null;
      if (target) {
        gaze.hold(target);
        target.dataset.attention = "on";
        lit.current = target;
        later(2400, unlight);
      }
      if (choice.reply) await say(choice.reply);
      if (t !== token.current) return;
      later(3200, close);
    },
    [avatar, gaze, close],
  );

  /** CONTACT cue: smile, look at the thing, say the line; stays until release() */
  const react = useCallback(
    async (el: Element | null, text: string) => {
      if (mode.current === "cue" && line?.text === text) {
        // re-entered before the line folded away: just cancel the pending close
        timers.current.forEach(clearTimeout);
        timers.current = [];
        if (el) gaze.hold(el);
        return;
      }
      begin("cue");
      if (el) gaze.hold(el);
      avatar.mood("happy");
      avatar.beat("nod");
      await say(text);
    },
    [avatar, gaze, line, close],
  );

  const release = useCallback(
    (delay = 1400) => {
      if (mode.current !== "cue") return;
      later(delay, () => {
        if (mode.current === "cue") close();
      });
    },
    [close],
  );

  /** DialogueBox reports the end of each typed line */
  const onTyped = useCallback(() => {
    const done = typed.current;
    typed.current = null;
    done?.();
  }, []);

  useEffect(
    () => () => {
      token.current++;
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  return { line, viaKeyboard, greet, choose, react, release, close, onTyped };
}

export type Conversation = ReturnType<typeof useConversation>;
