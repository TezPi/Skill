import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "@phosphor-icons/react/ssr";
import { navLinks, profile } from "@/content/profile";

export function Footer() {
  const elsewhere = profile.links.filter((link) => link.href);

  return (
    <footer data-site-footer className="border-t-2 border-fg">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.6fr_1fr_1fr_auto] md:py-20">
        <div>
          <p className="text-2xl font-extrabold tracking-tight">{profile.handle}</p>
          <p className="mt-2 max-w-[36ch] text-muted">{profile.role}. Designing interfaces, systems and the code that ships them.</p>
          {profile.email ? (
            <a href={`mailto:${profile.email}`} className="link-line mt-6 font-semibold">
              {profile.email}
            </a>
          ) : null}
        </div>

        <nav aria-label="Footer">
          <p className="mb-4 font-bold">Pages</p>
          <ul className="flex flex-col gap-3 text-muted">
            {[...navLinks, { href: "/contact", label: "Contact" }].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link-line hover:text-fg">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-4 font-bold">Elsewhere</p>
          <ul className="flex flex-col gap-3 text-muted">
            {elsewhere.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noreferrer" className="link-line hover:text-fg">
                  {link.label}
                  <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <a href="#top" className="icon-btn self-start" aria-label="Back to top">
          <ArrowUp size={18} weight="bold" />
        </a>
      </div>
      <div className="shell flex flex-col justify-between gap-2 pb-10 text-sm text-muted sm:flex-row">
        <p>
          &copy; {new Date().getFullYear()} {profile.handle}
        </p>
        <p>Set in Be Vietnam Pro. Three colors, no more.</p>
      </div>
    </footer>
  );
}
