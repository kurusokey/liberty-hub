import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

const DCA_HOST = "dca.sampapaya.com";

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  const isDca = host === DCA_HOST;

  if (isDca) {
    return {
      title: "DCA Sampapaya — Live",
      description: "Dashboard DCA crypto en direct — BTC + Or, exécution hebdomadaire",
      manifest: "/dca-manifest.json",
      appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "DCA",
      },
      icons: {
        icon: [
          { url: "/icons/dca-icon-192.png", sizes: "192x192", type: "image/png" },
          { url: "/icons/dca-icon-512.png", sizes: "512x512", type: "image/png" },
        ],
        apple: { url: "/icons/dca-apple-touch-icon-180.png", sizes: "180x180", type: "image/png" },
      },
    };
  }

  return {
    title: "Liberty Hub — Dashboard financier",
    description: "Vue unifiee de vos investissements : crypto, ETF et PEA",
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "Liberty Hub",
    },
    icons: {
      icon: "/icons/icon-192.svg",
      apple: "/icons/icon-192.svg",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased min-h-dvh">
        {children}
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(()=>{})}` }} />
      </body>
    </html>
  );
}
