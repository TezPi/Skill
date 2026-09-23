"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { nav } from "@/content/site";
import { profile } from "@/content/profile";
import { cn } from "@/lib/cn";
import { MenuIcon } from "@/components/ui/icons";
import { MobileMenu } from "./MobileMenu";

/**
 * Hides while reading downward, returns on any upward scroll.
 * Gains a surface only once content passes under it.
 */
export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [raised, setRaised] = useState(false);
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    const nextHidden = y > 160 && y > prev;
    if (nextHidden !== hidden) setHidden(nextHidden);
    const nextRaised = y > 24;
    if (nextRaised !== raised) setRaised(nextRaised);
  });

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        data-print="hide"
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-expo",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          raised ? "border-b border-line bg-bg/75 backdrop-blur-xl" : "border-b border-transparent",
        )}
      >
        <nav aria-label="Primary" className="container-page flex h-16 items-center justify-between gap-6 md:h-18">
          <Link
            href="/"
            aria-label={`${profile.name}, home`}
            className="group -ml-1 flex min-h-11 items-center rounded-control px-1 text-lg font-semibold tracking-tight"
          >
            <span aria-hidden="true" className="relative">
              {profile.shortName}
              <span className="text-signal">.</span>
            </span>
            <span
              aria-hidden="true"
              className="ml-3 hidden text-sm font-normal text-fg-lo transition-colors group-hover:text-fg-mid sm:inline"
            >
              {profile.role}
            </span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex min-h-11 items-center gap-2 rounded-control px-3.5 text-[0.9375rem] font-medium transition-colors duration-300",
                      active ? "text-fg" : "text-fg-mid hover:bg-fg/5 hover:text-fg",
                    )}
                  >
                    {/* The dot is status: "you are here". */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-1.5 rounded-full bg-signal transition-[transform,opacity] duration-500 ease-expo",
                        active ? "scale-100 opacity-100" : "scale-0 opacity-0",
                      )}
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <button
            ref={trigger}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-control text-fg transition-colors hover:bg-fg/5 md:hidden"
          >
            <MenuIcon size={20} />
            <span className="sr-only">Open menu</span>
          </button>
        </nav>
      </header>
      <MobileMenu
        open={open}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
        isActive={isActive}
      />
    </>
  );
}
