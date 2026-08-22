import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import Providers from "@/components/Providers";
import SkipLink from "@/components/SkipLink";
import ContentCheck from "@/components/ContentCheck";
import { identity } from "@/content/config";

// Display à fort caractère, grotesque neutre, mono pour les labels.
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", weight: ["400", "600", "800"], display: "swap" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600"], display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  title: "Nicolas. Je vends, je build, je vole.",
  description: "Portfolio de Nicolas : commerce et marketing en startup IA, agents et systèmes self-hosted, formation pilote.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? identity.siteUrl),
  openGraph: {
    title: "Nicolas. Je vends, je build, je vole.",
    description: "Commerce et marketing en startup IA, agents et systèmes self-hosted, formation pilote.",
    type: "website",
    locale: "fr_FR",
    siteName: identity.siteName,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Nicolas. Je vends, je build, je vole." }],
  },
  twitter: { card: "summary_large_image", title: "Nicolas. Je vends, je build, je vole.", description: "Commerce, tech, aviation.", images: ["/og.png"] },
};

// Next 15 : themeColor et viewport se déclarent séparément des métadonnées.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0d" },
    { media: "(prefers-color-scheme: light)", color: "#f2f0eb" },
  ],
};

// Applique le thème avant le premier paint pour éviter le flash.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <I18nProvider>
          <SkipLink />
          <ContentCheck />
          <Providers>{children}</Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
