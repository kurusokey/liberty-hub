import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Liberty Hub — Dashboard financier",
  description: "Vue unifiee de vos investissements : crypto, ETF et PEA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased min-h-dvh">{children}</body>
    </html>
  );
}
