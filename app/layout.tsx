import type { Metadata, Viewport } from "next";

// Self-hosted fonts (no request to Google at runtime)
import "@fontsource/unbounded/700.css";
import "@fontsource/unbounded/900.css";
import "@fontsource/antonio/400.css";
import "@fontsource/antonio/700.css";
import "@fontsource/archivo/400.css";
import "@fontsource/archivo/500.css";
import "@fontsource/archivo/600.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/luckiest-guy/400.css";
import "./globals.css";

import AppProvider from "@/components/providers/AppProvider";
import Preloader from "@/components/layout/Preloader";
import Cursor from "@/components/layout/Cursor";
import Nav from "@/components/layout/Nav";
import { site } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s — ${site.name}` },
  description: site.description,
  openGraph: {
    type: "website",
    url: site.url,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    siteName: site.name,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
  icons: { icon: "/brand/logo-mark.png" },
};

export const viewport: Viewport = {
  themeColor: "#0e0f11",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <div className="grain" aria-hidden="true" />
          <Cursor />
          <Preloader />
          <Nav />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}