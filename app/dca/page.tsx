export const dynamic = "force-dynamic";
export const revalidate = 30;

const SUPA_URL = process.env.SUPABASE_URL ?? "";
const SUPA_KEY = process.env.SUPABASE_SERVICE_KEY ?? "";

interface DCAPortfolio {
  total_invested: number;
  total_btc?: number;
  total_xau?: number;
  avg_price: number;
  purchases_count: number;
  total_profit_taken: number;
  tp_count: number;
  last_buy_timestamp: number;
  purchases?: Array<{
    date: string;
    price: number;
    qty: number;
    amount_usdt: number;
    type: string;
    profit?: number;
  }>;
}

async function fetchDCA(table: string): Promise<DCAPortfolio | null> {
  if (!SUPA_URL || !SUPA_KEY) return null;
  try {
    const resp = await fetch(
      `${SUPA_URL}/rest/v1/${table}?select=key,value&key=eq.weekly_dca_portfolio`,
      {
        headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
        next: { revalidate: 30 },
      }
    );
    if (!resp.ok) return null;
    const rows = await resp.json();
    if (!rows[0]?.value) return null;
    return JSON.parse(rows[0].value);
  } catch {
    return null;
  }
}

async function fetchPrice(table: string, key: string): Promise<number> {
  try {
    const resp = await fetch(
      `${SUPA_URL}/rest/v1/${table}?select=value&key=eq.${encodeURIComponent(key)}`,
      {
        headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
        next: { revalidate: 30 },
      }
    );
    if (!resp.ok) return 0;
    const rows = await resp.json();
    return parseFloat(rows[0]?.value ?? "0") || 0;
  } catch {
    return 0;
  }
}

function formatUSD(n: number): string {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default async function DCAPage() {
  const [btcDCA, goldDCA, btcPrice, xauPrice] = await Promise.all([
    fetchDCA("lr_settings"),
    fetchDCA("gold_settings"),
    fetchPrice("lr_settings", "price_BTC/USDT"),
    fetchPrice("gold_settings", "price_XAU/USDT:USDT"),
  ]);

  const btcQty = btcDCA?.total_btc ?? 0;
  const xauQty = goldDCA?.total_xau ?? 0;
  const btcValue = btcQty * btcPrice;
  const xauValue = xauQty * xauPrice;
  const btcInvested = btcDCA?.total_invested ?? 0;
  const xauInvested = goldDCA?.total_invested ?? 0;
  const btcPnL = btcValue - btcInvested;
  const xauPnL = xauValue - xauInvested;
  const btcPnLPct = btcInvested > 0 ? (btcPnL / btcInvested) * 100 : 0;
  const xauPnLPct = xauInvested > 0 ? (xauPnL / xauInvested) * 100 : 0;
  const btcProfit = btcDCA?.total_profit_taken ?? 0;
  const xauProfit = goldDCA?.total_profit_taken ?? 0;

  const totalInvested = btcInvested + xauInvested;
  const totalValue = btcValue + xauValue;
  const totalPnL = btcPnL + xauPnL;
  const totalPnLPct = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
  const totalProfit = btcProfit + xauProfit;

  const allPurchases = [
    ...(btcDCA?.purchases ?? []).map(p => ({ ...p, asset: "BTC" })),
    ...(goldDCA?.purchases ?? []).map(p => ({ ...p, asset: "XAU" })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main className="min-h-dvh p-4 md:p-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--accent)" }}>
          DCA + Take Profit
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Acheter chaque lundi, encaisser quand +10%. Mise a jour toutes les 30s.
        </p>
      </header>

      {/* Total Banner */}
      <div className="rounded-xl p-6 mb-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>Total investi</div>
            <div className="text-2xl font-bold mt-1">{formatUSD(totalInvested)} $</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>Valeur actuelle</div>
            <div className="text-2xl font-bold mt-1">{formatUSD(totalValue)} $</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>P&L non realise</div>
            <div className="text-2xl font-bold mt-1" style={{ color: totalPnL >= 0 ? "#34c97a" : "#f7564f" }}>
              {totalPnL >= 0 ? "+" : ""}{formatUSD(totalPnL)} $ ({totalPnLPct >= 0 ? "+" : ""}{totalPnLPct.toFixed(1)}%)
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>Profits encaisses</div>
            <div className="text-2xl font-bold mt-1" style={{ color: "#34c97a" }}>
              +{formatUSD(totalProfit)} $
            </div>
          </div>
        </div>
      </div>

      {/* Two cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* BTC Card */}
        <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">₿</span>
              <div>
                <div className="font-bold text-lg">Bitcoin</div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>DCA Hebdomadaire</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono" style={{ color: "var(--muted)" }}>{btcPrice.toLocaleString("fr-FR")} $</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span style={{ color: "var(--muted)" }}>Investi</span>
              <span className="font-medium">{formatUSD(btcInvested)} $</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--muted)" }}>Quantite</span>
              <span className="font-mono">{btcQty.toFixed(6)} BTC</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--muted)" }}>Prix moyen</span>
              <span className="font-mono">{(btcDCA?.avg_price ?? 0).toLocaleString("fr-FR")} $</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--muted)" }}>Valeur</span>
              <span className="font-medium">{formatUSD(btcValue)} $</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--muted)" }}>P&L</span>
              <span className="font-bold" style={{ color: btcPnL >= 0 ? "#34c97a" : "#f7564f" }}>
                {btcPnL >= 0 ? "+" : ""}{formatUSD(btcPnL)} $ ({btcPnLPct >= 0 ? "+" : ""}{btcPnLPct.toFixed(1)}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--muted)" }}>Profits encaisses</span>
              <span className="font-bold" style={{ color: "#34c97a" }}>+{formatUSD(btcProfit)} $</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--muted)" }}>Take profits</span>
              <span>{btcDCA?.tp_count ?? 0}x</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--muted)" }}>Achats</span>
              <span>{btcDCA?.purchases_count ?? 0}</span>
            </div>
          </div>

          {/* TP Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1" style={{ color: "var(--muted)" }}>
              <span>Take Profit a +10%</span>
              <span>{Math.min(100, Math.max(0, btcPnLPct / 10 * 100)).toFixed(0)}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, Math.max(0, btcPnLPct / 10 * 100))}%`,
                  background: btcPnLPct >= 10 ? "#34c97a" : "var(--accent)",
                }}
              />
            </div>
          </div>
        </div>

        {/* XAU Card */}
        <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🥇</span>
              <div>
                <div className="font-bold text-lg">Or (XAU)</div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>DCA Hebdomadaire</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono" style={{ color: "var(--muted)" }}>{xauPrice.toLocaleString("fr-FR")} $</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span style={{ color: "var(--muted)" }}>Investi</span>
              <span className="font-medium">{formatUSD(xauInvested)} $</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--muted)" }}>Quantite</span>
              <span className="font-mono">{xauQty.toFixed(6)} XAU</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--muted)" }}>Prix moyen</span>
              <span className="font-mono">{(goldDCA?.avg_price ?? 0).toLocaleString("fr-FR")} $</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--muted)" }}>Valeur</span>
              <span className="font-medium">{formatUSD(xauValue)} $</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--muted)" }}>P&L</span>
              <span className="font-bold" style={{ color: xauPnL >= 0 ? "#34c97a" : "#f7564f" }}>
                {xauPnL >= 0 ? "+" : ""}{formatUSD(xauPnL)} $ ({xauPnLPct >= 0 ? "+" : ""}{xauPnLPct.toFixed(1)}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--muted)" }}>Profits encaisses</span>
              <span className="font-bold" style={{ color: "#34c97a" }}>+{formatUSD(xauProfit)} $</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--muted)" }}>Take profits</span>
              <span>{goldDCA?.tp_count ?? 0}x</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--muted)" }}>Achats</span>
              <span>{goldDCA?.purchases_count ?? 0}</span>
            </div>
          </div>

          {/* TP Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1" style={{ color: "var(--muted)" }}>
              <span>Take Profit a +10%</span>
              <span>{Math.min(100, Math.max(0, xauPnLPct / 10 * 100)).toFixed(0)}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, Math.max(0, xauPnLPct / 10 * 100))}%`,
                  background: xauPnLPct >= 10 ? "#34c97a" : "var(--accent)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Purchase history */}
      <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <h2 className="font-bold text-lg mb-4">Historique des achats</h2>
        {allPurchases.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>Aucun achat encore. Premier achat lundi 08:00 UTC.</p>
        ) : (
          <div className="space-y-2">
            {allPurchases.map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 px-3 rounded-lg text-sm"
                style={{ background: "var(--bg)" }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ color: p.type === "TAKE_PROFIT" ? "#34c97a" : "var(--accent)" }}>
                    {p.type === "TAKE_PROFIT" ? "💰" : "📦"}
                  </span>
                  <div>
                    <span className="font-medium">{p.asset}</span>
                    <span className="ml-2" style={{ color: "var(--muted)" }}>
                      {p.type === "TAKE_PROFIT" ? "VENTE" : "ACHAT"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono">{p.amount_usdt?.toFixed(0)} $ @ {p.price?.toLocaleString("fr-FR")}</div>
                  {p.type === "TAKE_PROFIT" && p.profit != null && (
                    <div className="text-xs" style={{ color: "#34c97a" }}>
                      Profit: +{p.profit.toFixed(2)} $
                    </div>
                  )}
                  <div className="text-xs" style={{ color: "var(--muted)" }}>{p.date?.replace("T", " ")}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="mt-8 text-center text-xs" style={{ color: "var(--muted)" }}>
        DCA Hebdo — Achat chaque lundi 08:00 UTC | Take Profit a +10% (vente 20%)
      </footer>
    </main>
  );
}
