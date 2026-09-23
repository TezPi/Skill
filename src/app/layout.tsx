import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { profile } from "@/content/profile";
import { siteUrl } from "@/content/site";
import { MotionProviders } from "@/components/providers/MotionPreference";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  // Only the weights the type scale uses: 300 lead · 400 body · 500 labels · 600 display.
  weight: ["300", "400", "500", "600"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

// Italic appears only in translations, below the fold: one weight, not preloaded.
const beVietnamProItalic = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: "300",
  style: "italic",
  variable: "--font-be-vietnam-pro-italic",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} · ${profile.role}`,
    template: `%s · ${profile.name}`,
  },
  description: profile.positioning,
  authors: [{ name: profile.name }],
  openGraph: {
    type: "website",
    title: `${profile.name} · ${profile.role}`,
    description: profile.positioning,
    siteName: profile.name,
    locale: "en_US",
    alternateLocale: ["vi_VN"],
  },
};

export const viewport: Viewport = {
  themeColor: "#161616",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${beVietnamPro.variable} ${beVietnamProItalic.variable}`}>
      <body id="top" className="grain surface-ink min-h-dvh bg-bg text-fg">
        <MotionProviders>
          <a
            href="#main"
            className="fixed left-4 top-4 z-[80] -translate-y-24 rounded-control bg-signal px-4 py-3 text-sm font-medium text-on-signal transition-transform focus-visible:translate-y-0"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </MotionProviders>
      </body>
    </html>
  );
}
