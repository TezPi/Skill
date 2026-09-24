import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "@fontsource/jersey-10/latin-ext-400.css";
import "@fontsource/iosevka-charon-mono/400.css";
import "@fontsource/iosevka-charon-mono/700.css";
import "./globals.css";
import { site } from "@/content/site";
import { playground } from "@/content/playground";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { IntroProvider } from "@/components/intro/IntroProvider";
import { INTRO_STORAGE_KEY } from "@/components/intro/constants";
import { IntroLoader } from "@/components/intro/IntroLoader";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CanvasToolbar } from "@/components/layout/CanvasToolbar";
import { CanvasScrollbar } from "@/components/layout/CanvasScrollbar";
import { CanvasCursor } from "@/components/cursor/CanvasCursor";

/* Preloaded + size-adjusted fallback: the brand face is ready for the first paint */
const jersey = localFont({
  src: "../../node_modules/@fontsource/jersey-10/files/jersey-10-latin-400-normal.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-jersey",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.role}`,
    template: `%s | ${site.nameLatin}`,
  },
  description: `${site.name}, ${site.role}. ${site.intro}`,
  openGraph: {
    type: "website",
    siteName: site.brand,
    title: `${site.name} | ${site.role}`,
    description: site.intro,
  },
};

export const viewport: Viewport = {
  themeColor: "#3457db",
};

/*
 * Runs before first paint:
 * 1. theme: stored choice, else OS preference
 * 2. intro: play only on a first visit this session, on the home page, without
 *    a #hash deep link, and without reduced motion. Everyone else goes straight in.
 * 3. scrollbar: mouse devices get the brand scrollbar; set now so the native bar
 *    never flashes and the page width never jumps.
 */
const bootScript = `(function(){var d=document.documentElement;try{var s=localStorage.getItem("theme");d.dataset.theme=s==="light"||s==="dark"?s:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}catch(e){}try{var play=location.pathname==="/"&&!location.hash&&sessionStorage.getItem("${INTRO_STORAGE_KEY}")!=="1"&&!matchMedia("(prefers-reduced-motion: reduce)").matches;d.dataset.intro=play?"play":"skip";if(play&&"scrollRestoration" in history)history.scrollRestoration="manual"}catch(e){d.dataset.intro="skip"}try{if(matchMedia("(hover: hover) and (pointer: fine)").matches)d.dataset.scrollbar="canvas"}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const showPlayground = playground.length > 0;

  return (
    <html lang="en" className={jersey.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <MotionProvider>
          <IntroProvider>
            <IntroLoader />
            <div id="app-shell">
              <SiteHeader showPlayground={showPlayground} />
              <main id="main" tabIndex={-1} className="outline-none">
                {children}
              </main>
              <SiteFooter showPlayground={showPlayground} />
              <CanvasToolbar showPlayground={showPlayground} />
            </div>
            <CanvasScrollbar />
            <CanvasCursor />
          </IntroProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
