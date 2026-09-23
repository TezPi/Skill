import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/footer/Footer";
import { profile } from "@/content/profile";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${profile.handle} | ${profile.role}`,
    template: `%s | ${profile.handle}`,
  },
  description: `I'm ${profile.name}, ${profile.intro}`,
  openGraph: {
    title: `${profile.handle} | ${profile.role}`,
    description: `I'm ${profile.name}, ${profile.intro}`,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#dcdcdc" },
    { media: "(prefers-color-scheme: dark)", color: "#161616" },
  ],
};

/**
 * Runs before paint: applies the saved or system theme, and decides whether
 * the intro plays (home only, once per session, never with reduced motion).
 */
const bootScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem('tezpi:theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.dataset.theme=t;var seen=sessionStorage.getItem('tezpi:intro')==='1';var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;d.dataset.intro=(location.pathname==='/'&&!seen&&!reduce)?'play':'skip'}catch(e){d.dataset.intro='skip'}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={beVietnam.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="w-full max-w-full overflow-x-clip">
          {children}
        </main>
        <Footer />
        <div className="grain" aria-hidden="true" />
        {/* Tritone map: luminance -> ink, signal, paper. Used by .tritone images. */}
        <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
          <filter id="tritone" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0 0 0 1 0" />
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.25" intercept="-0.1" />
              <feFuncG type="linear" slope="1.25" intercept="-0.1" />
              <feFuncB type="linear" slope="1.25" intercept="-0.1" />
            </feComponentTransfer>
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0.086 0.176 0.863" />
              <feFuncG type="table" tableValues="0.086 0.373 0.863" />
              <feFuncB type="table" tableValues="0.086 1 0.863" />
            </feComponentTransfer>
          </filter>
        </svg>
      </body>
    </html>
  );
}
