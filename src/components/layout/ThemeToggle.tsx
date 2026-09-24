"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";

type Theme = "light" | "dark";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage blocked: the choice still applies for this visit */
    }
    setTheme(next);
  }

  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={
        "grid size-10 place-items-center rounded-control text-snow transition-colors duration-150 hover:bg-snow/10 active:bg-snow/15 " +
        (className ?? "")
      }
    >
      {/* Icon renders after mount to avoid a hydration mismatch with the pre-paint theme script */}
      {theme === null ? (
        <span className="size-5" />
      ) : theme === "dark" ? (
        <SunIcon size={20} weight="bold" aria-hidden />
      ) : (
        <MoonIcon size={20} weight="bold" aria-hidden />
      )}
    </button>
  );
}
