import RiskCard from "@/components/RiskCard";
import TradeCard from "@/components/TradeCard";
import PeaCard from "@/components/PeaCard";
import TotalBanner from "@/components/TotalBanner";

export const revalidate = 60;

const SUPA_URL = process.env.SUPABASE_URL ?? "";
const SUPA_KEY = process.env.SUPABASE_SERVICE_KEY ?? "";

async function fetchRisk() {
  if (!SUPA_URL || !SUPA_KEY) return null;
  try {
    const resp = await fetch(`${SUPA_URL}/rest/v1/settings?select=key,value`, {
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
      next: { revalidate: 60 },
    });
    if (!resp.ok) return null;
    const rows: { key: string; value: string }[] = await resp.json();
    const s: Record<string, string> = {};
    for (const r of rows) s[r.key] = r.value;

    const tradesResp = await fetch(`${SUPA_URL}/rest/v1/trades?select=id&limit=1000`, {
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
      next: { revalidate: 60 },
    });
    const trades = tradesResp.ok ? await tradesResp.json() : [];

    return {
      status: s.bot_status ?? "unknown",
      capital: parseFloat(s.bot_capital ?? "0"),
      initialCapital: parseFloat(s.initial_capital_usdt ?? "2000"),
      drawdown: parseFloat(s.bot_drawdown ?? "0"),
      regime: s.ai_regime ?? s.bot_regime ?? "?",
      btcTrend: s.ai_btc_trend ?? "?",
      fearGreed: parseInt(s.fear_greed_score ?? "0"),
      totalTrades: trades.length,
      lastCycle: s.last_cycle_at ?? "",
      dryRun: s.dry_run === "true",
      priceBtc: parseFloat(s["price_BTC/USDT"] ?? "0"),
      priceEth: parseFloat(s["price_ETH/USDT"] ?? "0"),
      priceSol: parseFloat(s["price_SOL/USDT"] ?? "0"),
      marketSummary: s.ai_market_summary ?? "",
    };
  } catch {
    return null;
  }
}

async function fetchMarket(ticker: string) {
  try {
    const url = `https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?range=1mo&interval=1d`;
    const resp = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 300 },
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const result = data?.chart?.result?.[0];
    if (!result) return null;
    const meta = result.meta;
    const price = meta.regularMarketPrice ?? 0;
    const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
    const change = price - prevClose;
    const changePct = prevClose > 0 ? (change / prevClose) * 100 : 0;
    return {
      ticker,
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePct: Math.round(changePct * 100) / 100,
      currency: meta.currency ?? "EUR",
    };
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
