import Link from "next/link";
import { nav } from "@/content/site";
import { profile } from "@/content/profile";
import { LocalTime } from "@/components/ui/LocalTime";
import { MotionToggle } from "@/components/ui/MotionToggle";
import { ArrowUp, ArrowUpRight } from "@/components/ui/icons";
import { Placeholder } from "@/components/ui/Rich";

const swatches = [
  { name: "Ink", hex: "#161616" },
  { name: "Paper", hex: "#DCDCDC" },
  { name: "Signal", hex: "#2D5FFF" },
];

export function Footer() {
  return (
    <footer data-print="hide" className="border-t border-line">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <p className="text-title">
            {profile.name}
            <span className="text-signal">.</span>
          </p>
          <p className="mt-2 text-fg-mid">
            {profile.role} · {profile.studio}
          </p>
          <p className="mt-6 flex items-center gap-2 text-sm text-fg-lo">
            {profile.location} · <LocalTime timeZone={profile.timezone} /> (GMT+7)
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="text-overline mb-4 text-fg-lo">Pages</p>
          <ul className="space-y-1">
            <li>
              <Link href="/" className="link-draw inline-flex min-h-9 items-center text-fg-mid hover:text-fg">
                Home
              </Link>
            </li>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-draw inline-flex min-h-9 items-center text-fg-mid hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="text-overline mb-4 text-fg-lo">Elsewhere</p>
          <ul className="space-y-1">
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="link-draw inline-flex min-h-9 items-center break-all text-fg-mid hover:text-fg"
              >
                {profile.email}
              </a>
            </li>
            {profile.socials
              .filter((s) => s.label !== "Email")
              .map((s) => (
                <li key={s.label} className="flex min-h-9 items-center">
                  {s.href ? (
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-1 text-fg-mid hover:text-fg"
                    >
                      <span className="link-draw">{s.label}</span>
                      <ArrowUpRight size={14} />
                    </a>
                  ) : (
                    <span className="text-fg-lo">
                      {s.label} <Placeholder>add URL</Placeholder>
                    </span>
                  )}
                </li>
              ))}
          </ul>
        </div>
      </div>

      <div className="container-page flex flex-col gap-4 border-t border-line py-6 text-xs text-fg-lo md:flex-row md:items-center md:justify-between">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span>Set in Be Vietnam Pro. Three colours:</span>
          {swatches.map((s) => (
            <span key={s.hex} className="inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-2.5 rounded-[3px] ring-1 ring-line-strong"
                style={{ background: s.hex }}
              />
              <span className="tabular-nums">{s.hex}</span>
              <span className="sr-only">({s.name})</span>
            </span>
          ))}
        </p>
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <MotionToggle />
          <a
            href="#top"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-control px-2 font-medium text-fg-mid transition-colors hover:text-fg"
          >
            <ArrowUp size={14} /> Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
