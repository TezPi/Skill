"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpRightIcon, ListIcon, PlayIcon, XIcon } from "@phosphor-icons/react";
import { nav, resumeLink, site } from "@/content/site";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { BrandMark } from "@/components/ui/BrandMark";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { useIntro } from "@/components/intro/IntroProvider";

const SPY_IDS = [...nav.map((n) => n.id), "contact"];

export function SiteHeader({ showPlayground }: { showPlayground: boolean }) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const items = nav.filter((item) => item.id !== "playground" || showPlayground);

  const { phase, cue } = useIntro();
  const spied = useScrollSpy(onHome ? SPY_IDS : []);
  const active = onHome ? spied : pathname.startsWith("/work") ? "work" : null;

  // Hide on scroll down, reveal on scroll up: more room for work, nav one flick away.
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > (scrollY.getPrevious() ?? 0) && y > 240;
    if (next !== hidden) setHidden(next);
  });

  return (
    <motion.header
      className="on-cobalt sticky top-0 z-40 bg-cobalt text-snow"
      initial={false}
      animate={{ y: phase === "loading" || (hidden && !menuOpen) ? "-100%" : "0%" }}
      transition={
        phase === "loading"
          ? { duration: 0 }
          : phase === "revealing"
            ? { type: "spring", stiffness: 260, damping: 30, delay: cue("tabBar") }
            : { duration: 0.32, ease: [0.16, 1, 0.3, 1] }
      }
      onFocusCapture={() => setHidden(false)}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-control focus:bg-sun focus:px-3 focus:py-2 focus:font-mono focus:text-sm focus:font-bold focus:text-cobalt-deep"
      >
        Skip to content
      </a>

      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          aria-label={`${site.brand}, home`}
          className="shrink-0 rounded-control transition-transform duration-200 ease-out-expo hover:-rotate-2"
        >
          <BrandMark className="text-[0.9375rem] lg:text-base" />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1 lg:gap-3">
            {items.map((item) => (
              <li key={item.id}>
                <NavItem href={item.href} label={item.label} active={active === item.id} onHome={onHome} />
              </li>
            ))}
            <li>
              <NavItem
                href={resumeLink.href}
                label="Resume"
                external={resumeLink.external}
                active={false}
                onHome={onHome}
              />
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ButtonLink href="/#contact" variant="sun" data-contact-cue className="max-[439px]:hidden">
            Contact
          </ButtonLink>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-control transition-colors hover:bg-snow/10 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <XIcon size={22} weight="bold" aria-hidden /> : <ListIcon size={22} weight="bold" aria-hidden />}
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} items={items} />
    </motion.header>
  );
}

function NavItem({
  href,
  label,
  active,
  external,
  onHome,
}: {
  href: string;
  label: string;
  active: boolean;
  external?: boolean;
  onHome: boolean;
}) {
  const className = cn(
    "group relative flex h-10 items-center gap-2 rounded-control px-2.5 font-mono text-nav font-bold transition-colors duration-150",
    active ? "text-snow" : "text-snow/85 hover:text-snow",
  );

  const marker = (
    <>
      <PlayIcon
        size={12}
        weight="fill"
        aria-hidden
        className={cn("transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5", active ? "text-sun" : "text-sun/60")}
      />
      {active ? (
        <motion.span
          layoutId="tab-underline"
          aria-hidden
          className="absolute right-2.5 bottom-1 left-[1.875rem] h-0.5 rounded-full bg-sun"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      ) : null}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {marker}
        {label}
        <ArrowUpRightIcon size={14} weight="bold" aria-hidden />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link href={href} className={className} aria-current={active ? (onHome ? "location" : "page") : undefined}>
      {marker}
      {label}
    </Link>
  );
}
