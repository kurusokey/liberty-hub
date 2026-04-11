"use client";

interface GoldData {
  status: string;
  capital: number;
  initialCapital: number;
  drawdown: number;
  regime: string;
  macroSentiment: number;
  totalTrades: number;
  lastCycle: string;
  dryRun: boolean;
  priceXau: number;
  priceXag: number;
  dxyValue: string;
  dxyTrend: string;
  marketSummary: string;
}

function StatusDot({ status }: { status: string }) {
  const color = status === "running" ? "var(--green)" : "var(--red)";
  return (
    <span
      className="inline-block w-2 h-2 rounded-full mr-2"
      style={{ background: color, boxShadow: `0 0 6px ${color}` }}
    />
  );
}

function regimeColor(regime: string) {
  switch (regime) {
    case "BULLISH": return "var(--green)";
    case "BEARISH": return "var(--red)";
    case "VOLATILE": return "var(--accent)";
    default: return "var(--muted)";
  }
}

function macroLabel(score: number) {
  if (score <= 20) return { label: "Tres bearish", color: "var(--red)" };
  if (score <= 40) return { label: "Bearish", color: "#f97316" };
  if (score <= 60) return { label: "Neutre", color: "var(--muted)" };
  if (score <= 80) return { label: "Bullish", color: "var(--green)" };
  return { label: "Tres bullish", color: "var(--green)" };
}

function timeAgo(iso: string) {
  if (!iso) return "?";
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "< 1 min";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  return `${h}h${min % 60 > 0 ? `${min % 60}m` : ""}`;
}

export default function GoldCard({ data }: { data: GoldData | null }) {
  if (!data) {
    return (
      <div className="rounded-xl p-5 border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <h2 className="text-lg font-bold mb-3" style={{ color: "#FFD700" }}>Liberty Gold</h2>
        <p style={{ color: "var(--muted)" }}>Donnees indisponibles</p>
      </div>
    );
  }

  const pnl = data.capital - data.initialCapital;
  const pnlPct = data.initialCapital > 0 ? (pnl / data.initialCapital) * 100 : 0;
  const macro = macroLabel(data.macroSentiment);

  return (
    <div className="rounded-xl p-5 border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold" style={{ color: "#FFD700" }}>Liberty Gold</h2>
        <div className="flex items-center text-xs">
          <StatusDot status={data.status} />
          <span style={{ color: data.status === "running" ? "var(--green)" : "var(--red)" }}>
            {data.status === "running" ? "Actif" : data.status}
          </span>
        </div>
      </div>

      {/* Capital & PnL */}
      <div className="mb-4">
        <div className="text-2xl font-bold">{data.capital.toLocaleString("fr-FR")} USDT</div>
        <div className="text-sm" style={{ color: pnl >= 0 ? "var(--green)" : "var(--red)" }}>
          {pnl >= 0 ? "+" : ""}{pnl.toFixed(2)} USDT ({pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(2)}%)
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>Regime IA</div>
          <div className="font-medium" style={{ color: regimeColor(data.regime) }}>{data.regime}</div>
        </div>
        <div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>Macro Sentiment</div>
          <div className="font-medium" style={{ color: macro.color }}>{data.macroSentiment} — {macro.label}</div>
        </div>
        <div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>Trades</div>
          <div className="font-medium">{data.totalTrades}</div>
        </div>
        <div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>Drawdown</div>
          <div className="font-medium" style={{ color: data.drawdown > 0.05 ? "var(--red)" : "var(--text)" }}>
            {(data.drawdown * 100).toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>Or (XAU)</div>
          <div className="font-medium" style={{ color: "#FFD700" }}>${data.priceXau.toLocaleString("fr-FR")}</div>
        </div>
        <div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>Argent (XAG)</div>
          <div className="font-medium" style={{ color: "#C0C0C0" }}>${data.priceXag.toLocaleString("fr-FR")}</div>
        </div>
      </div>

      {/* DXY */}
      <div className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
        DXY : {data.dxyValue} ({data.dxyTrend})
      </div>

      {/* Summary */}
      {data.marketSummary && (
        <div className="mt-2 text-xs italic" style={{ color: "var(--muted)" }}>
          {data.marketSummary}
        </div>
      )}

      {/* Last cycle */}
      <div className="mt-3 flex items-center justify-between text-xs" style={{ color: "var(--muted)" }}>
        <span>Dernier cycle : {timeAgo(data.lastCycle)}</span>
        <a
          href="https://liberty-gold.vercel.app"
          target="_blank"
          rel="noopener"
          className="underline hover:no-underline"
          style={{ color: "#FFD700" }}
        >
          Ouvrir
        </a>
      </div>
    </div>
  );
}
