"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  ChatCircleIcon,
  HashIcon,
  NavigationArrowIcon,
  PenNibIcon,
  ReadCvLogoIcon,
  TextTIcon,
  type Icon,
} from "@phosphor-icons/react";
import { resumeLink } from "@/content/site";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { cn } from "@/lib/cn";
import { useIntro } from "@/components/intro/IntroProvider";

interface Tool {
  id: string;
  label: string;
  /** Figma shortcut for the tool the icon depicts */
  shortcut: string;
  icon: Icon;
  href: string;
  external?: boolean;
}

/*
 * The Figma toolbar from the original hero, rebuilt as working navigation.
 * Each Figma tool maps to a section: Move -> Intro, Frame -> Work,
 * Text -> About, Pen -> Playground, Comment -> Contact.
 * Keyboard: WAI-ARIA toolbar (one Tab stop, arrows/Home/End move focus).
 * Letter shortcuts work only while focus is in the toolbar, so they can't
 * hijack typing or voice control (WCAG 2.1.4).
 */
export function CanvasToolbar({ showPlayground }: { showPlayground: boolean }) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const { phase, cue } = useIntro();

  const tools: Tool[] = [
    { id: "intro", label: "Intro", shortcut: "V", icon: NavigationArrowIcon, href: "/#intro" },
    { id: "work", label: "Work", shortcut: "F", icon: HashIcon, href: "/#work" },
    { id: "about", label: "About", shortcut: "T", icon: TextTIcon, href: "/#about" },
    ...(showPlayground ? [{ id: "playground", label: "Playground", shortcut: "P", icon: PenNibIcon, href: "/#playground" }] : []),
    { id: "contact", label: "Contact", shortcut: "C", icon: ChatCircleIcon, href: "/#contact" },
  ];
  const resume: Tool = { id: "resume", label: "Resume", shortcut: "R", icon: ReadCvLogoIcon, ...resumeLink };
  const all = [...tools, resume];

  const spied = useScrollSpy(onHome ? tools.map((t) => t.id) : []);
  const active = onHome ? (spied ?? "intro") : pathname.startsWith("/work") ? "work" : null;

  // Step aside for the footer's base bar so it never covers the last line of the page
  const [atBase, setAtBase] = useState(false);
  useEffect(() => {
    const base = document.getElementById("site-base");
    if (!base) return;
    const observer = new IntersectionObserver(([entry]) => setAtBase(entry.isIntersecting));
    observer.observe(base);
    return () => observer.disconnect();
  }, []);

  // Roving tabindex
  const [focusIndex, setFocusIndex] = useState(-1);
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);
  const activeIndex = Math.max(0, all.findIndex((t) => t.id === active));
  const tabStop = focusIndex >= 0 ? focusIndex : activeIndex;

  function focusAt(index: number) {
    const next = (index + all.length) % all.length;
    setFocusIndex(next);
    refs.current[next]?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const current = refs.current.findIndex((el) => el === document.activeElement);
    const moves: Record<string, number> = {
      ArrowRight: current + 1,
      ArrowLeft: current - 1,
      Home: 0,
      End: all.length - 1,
    };
    if (event.key in moves) {
      event.preventDefault();
      focusAt(moves[event.key]);
      return;
    }
    const byShortcut = all.findIndex((t) => t.shortcut === event.key.toUpperCase());
    if (byShortcut >= 0) {
      event.preventDefault();
      refs.current[byShortcut]?.click();
    }
  }

  const hidden = phase === "loading" || atBase;

  return (
    <motion.nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-4 z-30 mx-auto w-fit sm:bottom-5"
      initial={false}
      animate={{ y: hidden ? "160%" : "0%", opacity: hidden ? 0 : 1 }}
      transition={
        phase === "loading"
          ? { duration: 0 }
          : { type: "spring", stiffness: 300, damping: 28, delay: cue("toolbar") }
      }
    >
      <div
        role="toolbar"
        aria-label="Canvas tools"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="flex items-center gap-1 rounded-card bg-panel p-1.5 text-snow shadow-[0_18px_40px_-16px_rgb(11_11_12/0.6)] ring-1 ring-snow/10"
      >
        {tools.map((tool, i) => (
          <ToolLink
            key={tool.id}
            tool={tool}
            active={tool.id === active}
            tabIndex={i === tabStop ? 0 : -1}
            ref={(el) => {
              refs.current[i] = el;
            }}
            onFocus={() => setFocusIndex(i)}
          />
        ))}
        <span aria-hidden className="mx-1 h-6 w-px bg-snow/15" />
        <ToolLink
          tool={resume}
          active={false}
          tabIndex={all.length - 1 === tabStop ? 0 : -1}
          ref={(el) => {
            refs.current[all.length - 1] = el;
          }}
          onFocus={() => setFocusIndex(all.length - 1)}
        />
      </div>
    </motion.nav>
  );
}

function ToolLink({
  tool,
  active,
  tabIndex,
  ref,
  onFocus,
}: {
  tool: Tool;
  active: boolean;
  tabIndex: number;
  ref: React.Ref<HTMLAnchorElement>;
  onFocus: () => void;
}) {
  const Icon = tool.icon;
  const className = cn(
    "group/tool relative grid size-11 place-items-center rounded-control transition-colors duration-150 sm:size-10",
    "focus-visible:outline-offset-2",
    active ? "text-snow" : "text-snow/75 hover:bg-snow/10 hover:text-snow",
  );

  const inner = (
    <>
      {active ? (
        <motion.span
          layoutId="tool-active"
          aria-hidden
          className="absolute inset-0 rounded-control bg-cobalt"
          transition={{ type: "spring", stiffness: 480, damping: 36 }}
        />
      ) : null}
      <Icon size={20} weight={active ? "fill" : "bold"} aria-hidden className="relative" />
      {/* Tooltip: label on hover; shortcut shown only when keyboard-focused, where it works */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-full left-1/2 mb-3 flex -translate-x-1/2 translate-y-1 items-center gap-2 rounded-control bg-panel px-2.5 py-1.5 font-mono text-[0.75rem] font-bold whitespace-nowrap text-snow opacity-0 ring-1 ring-snow/10 transition-[opacity,transform] duration-150 ease-out-expo group-hover/tool:translate-y-0 group-hover/tool:opacity-100 group-focus-visible/tool:translate-y-0 group-focus-visible/tool:opacity-100"
      >
        {tool.label}
        <kbd className="hidden rounded-mark bg-snow/15 px-1.5 font-mono text-[0.6875rem] text-snow group-focus-visible/tool:inline">
          {tool.shortcut}
        </kbd>
      </span>
    </>
  );

  if (tool.external) {
    return (
      <a ref={ref} href={tool.href} target="_blank" rel="noopener noreferrer" aria-label={`${tool.label} (opens in a new tab)`} tabIndex={tabIndex} onFocus={onFocus} className={className}>
        {inner}
      </a>
    );
  }
  return (
    <Link
      ref={ref}
      href={tool.href}
      aria-label={tool.label}
      aria-current={active ? "location" : undefined}
      tabIndex={tabIndex}
      onFocus={onFocus}
      data-contact-cue={tool.id === "contact" ? "" : undefined}
      className={className}
    >
      {inner}
    </Link>
  );
}
