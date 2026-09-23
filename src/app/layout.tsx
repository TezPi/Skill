import type { Metadata, Viewport } from "next";
import "@fontsource/jersey-10/400.css";
import "@fontsource/iosevka-charon-mono/400.css";
import "@fontsource/iosevka-charon-mono/700.css";
import "./globals.css";
import { site } from "@/content/site";
import { playground } from "@/content/playground";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

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

/* Sets data-theme before first paint: stored choice, else OS preference */
const themeScript = `(function(){try{var s=localStorage.getItem("theme");var t=s==="light"||s==="dark"?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.dataset.theme=t}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const showPlayground = playground.length > 0;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <MotionProvider>
          <SiteHeader showPlayground={showPlayground} />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter showPlayground={showPlayground} />
        </MotionProvider>
      </body>
    </html>
  );
}
