import RiskCard from "@/components/RiskCard";
import TradeCard from "@/components/TradeCard";
import PeaCard from "@/components/PeaCard";
import TotalBanner from "@/components/TotalBanner";

export const revalidate = 60;

async function fetchRisk() {
  try {
    const base = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    const resp = await fetch(`${base}/api/risk`, { next: { revalidate: 60 } });
    if (!resp.ok) return null;
    return resp.json();
  } catch {
    return null;
  }
}

async function fetchMarket(ticker: string) {
  try {
    const base = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    const resp = await fetch(`${base}/api/market?ticker=${ticker}`, {
      next: { revalidate: 300 },
    });
    if (!resp.ok) return null;
    return resp.json();
  } catch {
    return null;
  }
}

export default async function Home() {
  const [risk, vwce] = await Promise.all([
    fetchRisk(),
    fetchMarket("VWCE.DE"),
  ]);

  return (
    <main className="min-h-dvh p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--accent)" }}>
          Liberty Hub
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Dashboard financier unifie — Crypto, ETF, PEA
        </p>
      </header>

      {/* Capital total */}
      <TotalBanner risk={risk} vwce={vwce} />

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <RiskCard data={risk} />
        <TradeCard vwce={vwce} />
        <PeaCard />
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs" style={{ color: "var(--muted)" }}>
        Liberty Hub v1.0 — Donnees actualisees toutes les minutes
      </footer>
    </main>
  );
}
