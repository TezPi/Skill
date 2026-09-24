import Link from "next/link";
import { ArrowUpIcon, ArrowUpRightIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react/dist/ssr";
import { nav, resumeLink, site } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { CopyEmail } from "./CopyEmail";

export function SiteFooter({ showPlayground }: { showPlayground: boolean }) {
  const socials = site.socials.filter((s) => s.url);
  const sitemap = [
    ...nav.filter((n) => n.id !== "playground" || showPlayground).map((n) => ({ ...n, external: false })),
    { id: "resume", label: "Resume", href: resumeLink.href, external: resumeLink.external },
  ];

  return (
    <footer id="contact" className="on-cobalt scroll-mt-16 bg-cobalt text-snow">
      <div className="container-page grid gap-14 py-20 lg:grid-cols-12 lg:gap-10 lg:py-28">
        <Reveal className="lg:col-span-7">
          <h2 className="font-display text-display text-snow">
            LET&apos;S TALK
            <span aria-hidden className="ml-[0.06em] inline-block size-[0.13em] rounded-mark bg-sun" />
          </h2>
          <p className="mt-5 max-w-[36ch] text-lead text-cream">
            Hiring for a UI/UX role or planning a product? My inbox is open.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-4">
            <a
              href={`mailto:${site.email}`}
              className="font-display text-[clamp(1.75rem,3.4vw,2.5rem)] leading-none text-sun underline decoration-sun decoration-2 underline-offset-[0.25em] transition-colors hover:text-snow hover:decoration-snow"
            >
              {site.email}
            </a>
            <CopyEmail email={site.email} />
          </div>

          <ul className="mt-8 flex flex-col gap-3 font-mono text-nav font-bold text-cream">
            <li className="flex items-center gap-3">
              <IconChip><PhoneIcon size={16} weight="bold" /></IconChip>
              <a href={`tel:${site.phoneHref}`} className="underline-offset-4 hover:underline">
                {site.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <IconChip><MapPinIcon size={16} weight="bold" /></IconChip>
              {site.location}
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="grid grid-cols-2 gap-10 lg:col-span-4 lg:col-start-9 lg:border-l lg:border-snow/20 lg:pl-10">
          <FooterList title="Sitemap">
            {sitemap.map((item) =>
              item.external ? (
                <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-sun">
                  {item.label}
                  <ArrowUpRightIcon size={14} weight="bold" aria-hidden />
                </a>
              ) : (
                <Link key={item.id} href={item.href} className="hover:text-sun">
                  {item.label}
                </Link>
              ),
            )}
          </FooterList>
          {socials.length > 0 ? (
            <FooterList title="Social">
              {socials.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-sun">
                  {s.label}
                  <ArrowUpRightIcon size={14} weight="bold" aria-hidden />
                </a>
              ))}
            </FooterList>
          ) : null}
        </Reveal>
      </div>

      <div id="site-base" className="bg-cobalt-deep">
        <div className="container-page flex h-14 items-center justify-between gap-4 font-mono text-label font-bold tracking-[0.12em] text-cream uppercase">
          <p>© {new Date().getFullYear()} {site.handle}. Made with pixels.</p>
          <a href="#main" className="inline-flex items-center gap-1.5 hover:text-sun">
            Back to top
            <ArrowUpIcon size={14} weight="bold" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}

function IconChip({ children }: { children: React.ReactNode }) {
  return (
    <span aria-hidden className="grid size-7 place-items-center rounded-control bg-snow text-cobalt">
      {children}
    </span>
  );
}

function FooterList({ title, children }: { title: string; children: React.ReactNode[] }) {
  return (
    <div>
      <h3 className="label text-cream">{title}</h3>
      <ul className="mt-5 flex flex-col gap-3 text-lead text-snow">
        {children.map((child, i) => (
          <li key={i}>{child}</li>
        ))}
      </ul>
    </div>
  );
}
