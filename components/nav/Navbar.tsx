"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { navLinks, profile } from "@/content/profile";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawer.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header id="top" data-site-nav className="sticky top-0 z-(--z-nav) h-(--nav-h) border-b-2 border-fg bg-bg">
      <nav aria-label="Primary" className="shell flex h-full items-center justify-between gap-6">
        <Link href="/" onClick={close} className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight" aria-label={`${profile.handle}, home`}>
          <span aria-hidden="true" className="size-[18px] border-2 border-fg bg-signal shadow-[2px_2px_0_var(--fg)]" />
          {profile.handle}
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          <ul className="flex items-center gap-8 text-[0.9375rem] font-semibold">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link-line" aria-current={isActive(link.href) ? "page" : undefined}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/contact" className="btn btn-sm" aria-current={isActive("/contact") ? "page" : undefined}>
              Contact
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            ref={menuButton}
            type="button"
            className="icon-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        ref={drawer}
        inert={!open}
        className={cn(
          "fixed inset-x-0 top-(--nav-h) bottom-0 z-(--z-drawer) flex flex-col justify-between border-t-2 border-fg bg-bg px-4 pb-10 pt-8 md:hidden",
          "transition-[opacity,translate] duration-300 ease-snap",
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0",
        )}
      >
        <ul className="flex flex-col gap-2">
          {[...navLinks, { href: "/contact", label: "Contact" }].map((link, i) => (
            <li
              key={link.href}
              className={cn("transition-[opacity,translate] duration-500 ease-snap", open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}
              style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
            >
              <Link
                href={link.href}
                onClick={close}
                aria-current={isActive(link.href) ? "page" : undefined}
                className="flex items-center justify-between border-b-2 border-fg py-4 text-5xl font-black tracking-tight aria-[current=page]:text-signal"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted">
          {profile.handle}, {profile.role}
        </p>
      </div>
    </header>
  );
}
