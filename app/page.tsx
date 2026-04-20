import RiskCard from "@/components/RiskCard";
import GoldCard from "@/components/GoldCard";
import TradeCard from "@/components/TradeCard";
import PeaCard from "@/components/PeaCard";
import ImmoCard from "@/components/ImmoCard";
import TotalBanner from "@/components/TotalBanner";

export const revalidate = 60;

const SUPA_URL = process.env.SUPABASE_URL ?? "";
const SUPA_KEY = process.env.SUPABASE_SERVICE_KEY ?? "";

async function fetchRisk() {
  if (!SUPA_URL || !SUPA_KEY) return null;
  try {
    const resp = await fetch(`${SUPA_URL}/rest/v1/lr_settings?select=key,value`, {
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
      next: { revalidate: 60 },
    });
    if (!resp.ok) return null;
    const rows: { key: string; value: string }[] = await resp.json();
    const s: Record<string, string> = {};
    for (const r of rows) s[r.key] = r.value;

    const tradesResp = await fetch(`${SUPA_URL}/rest/v1/lr_trades?select=id&limit=1000`, {
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

async function fetchGold() {
  if (!SUPA_URL || !SUPA_KEY) return null;
  try {
    const resp = await fetch(`${SUPA_URL}/rest/v1/gold_settings?select=key,value`, {
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
      next: { revalidate: 60 },
    });
    if (!resp.ok) return null;
    const rows: { key: string; value: string }[] = await resp.json();
    const s: Record<string, string> = {};
    for (const r of rows) s[r.key] = r.value;

    const tradesResp = await fetch(`${SUPA_URL}/rest/v1/gold_trades?select=id&limit=1000`, {
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
      macroSentiment: parseInt(s.macro_sentiment_score ?? "0"),
      totalTrades: trades.length,
      lastCycle: s.last_cycle_at ?? "",
      dryRun: s.dry_run === "true",
      priceXau: parseFloat(s["price_XAU/USDT:USDT"] ?? "0"),
      priceXag: parseFloat(s["price_XAG/USDT:USDT"] ?? "0"),
      dxyValue: s.dxy_value ?? "?",
      dxyTrend: s.dxy_trend ?? "?",
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
  const [risk, gold, vwce] = await Promise.all([
    fetchRisk(),
    fetchGold(),
    fetchMarket("VWCE.DE"),
  ]);

  return (
    <main className="min-h-dvh p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--accent)" }}>
          Liberty Hub
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Mes projets au meme endroit
        </p>
      </header>

      {/* DCA — Primary */}
      <a
        href="/dca"
        className="block rounded-xl p-6 mb-6 transition-all hover:scale-[1.005]"
        style={{
          background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(52,201,122,0.06))",
          border: "1px solid var(--accent)",
        }}
      >
        <div className="flex items-center gap-4 mb-3">
          <span className="text-3xl">💰</span>
          <div>
            <div className="text-xl font-bold" style={{ color: "var(--accent)" }}>
              DCA + Take Profit
            </div>
            <div className="text-sm" style={{ color: "var(--muted)" }}>
              Achat auto BTC + Or chaque lundi — prise de profit a +10%
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="rounded-lg p-3" style={{ background: "var(--surface)" }}>
            <div className="text-xs" style={{ color: "var(--muted)" }}>BTC</div>
            <div className="font-bold">{risk?.priceBtc?.toLocaleString("fr-FR") ?? "—"} $</div>
          </div>
          <div className="rounded-lg p-3" style={{ background: "var(--surface)" }}>
            <div className="text-xs" style={{ color: "var(--muted)" }}>Or (XAU)</div>
            <div className="font-bold">{gold?.priceXau?.toLocaleString("fr-FR") ?? "—"} $</div>
          </div>
          <div className="rounded-lg p-3" style={{ background: "var(--surface)" }}>
            <div className="text-xs" style={{ color: "var(--muted)" }}>Liberty Risk</div>
            <div className="font-bold">{risk?.capital?.toFixed(0) ?? "—"} $</div>
          </div>
          <div className="rounded-lg p-3" style={{ background: "var(--surface)" }}>
            <div className="text-xs" style={{ color: "var(--muted)" }}>Liberty Gold</div>
            <div className="font-bold">{gold?.capital?.toFixed(0) ?? "—"} $</div>
          </div>
        </div>
      </a>

      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <a
          href="https://tickets.sampapaya.com"
          className="flex items-center gap-3 rounded-xl p-4 transition-all hover:scale-[1.01]"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <span className="text-2xl">🎫</span>
          <div>
            <div className="font-bold" style={{ color: "var(--accent)" }}>goFindMyTickets</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>Alertes billetterie</div>
          </div>
        </a>
        <a
          href="https://risk.sampapaya.com"
          className="flex items-center gap-3 rounded-xl p-4 transition-all hover:scale-[1.01]"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <span className="text-2xl">₿</span>
          <div>
            <div className="font-bold" style={{ color: "var(--accent)" }}>Liberty Risk</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>Bot DCA crypto</div>
          </div>
        </a>
        <a
          href="https://gold.sampapaya.com"
          className="flex items-center gap-3 rounded-xl p-4 transition-all hover:scale-[1.01]"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <span className="text-2xl">🥇</span>
          <div>
            <div className="font-bold" style={{ color: "var(--accent)" }}>Liberty Gold</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>Bot DCA or</div>
          </div>
        </a>
      </div>

      {/* Portfolio overview */}
      <div className="text-xs uppercase tracking-wider font-semibold mb-3 mt-8" style={{ color: "var(--muted)" }}>
        Vue d&apos;ensemble
      </div>
      <TotalBanner risk={risk} gold={gold} vwce={vwce} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <RiskCard data={risk} />
        <GoldCard data={gold} />
        <TradeCard vwce={vwce} />
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs" style={{ color: "var(--muted)" }}>
        Liberty Hub — Donnees actualisees toutes les minutes
      </footer>
    </main>
  );
}
