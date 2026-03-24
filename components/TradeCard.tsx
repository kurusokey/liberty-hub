"use client";

interface VwceData {
  ticker: string;
  price: number;
  change: number;
  changePct: number;
  currency: string;
}

export default function TradeCard({ vwce }: { vwce: VwceData | null }) {
  const dcaMonthly = 100; // EUR/mois

  return (
    <div className="rounded-xl p-5 border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold" style={{ color: "var(--blue)" }}>Liberty Trade</h2>
        <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--blue)", color: "#fff" }}>
          ETF DCA
        </span>
      </div>

      {/* VWCE Price */}
      <div className="mb-4">
        <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>VWCE.DE — Vanguard FTSE All-World</div>
        {vwce ? (
          <>
            <div className="text-2xl font-bold">{vwce.price.toFixed(2)} {vwce.currency}</div>
            <div
              className="text-sm"
              style={{ color: vwce.change >= 0 ? "var(--green)" : "var(--red)" }}
            >
              {vwce.change >= 0 ? "+" : ""}{vwce.change.toFixed(2)} ({vwce.changePct >= 0 ? "+" : ""}{vwce.changePct.toFixed(2)}%)
            </div>
          </>
        ) : (
          <div className="text-2xl font-bold" style={{ color: "var(--muted)" }}>--</div>
        )}
      </div>

      {/* DCA Info */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>DCA mensuel</div>
          <div className="font-medium">{dcaMonthly} EUR/mois</div>
        </div>
        <div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>Strategie</div>
          <div className="font-medium">Dollar Cost Averaging</div>
        </div>
        <div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>Type</div>
          <div className="font-medium">ETF World</div>
        </div>
        <div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>Frais</div>
          <div className="font-medium">0.22% TER</div>
        </div>
      </div>

      {/* Avantages */}
      <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: "var(--card)" }}>
        <div className="font-medium mb-1">Pourquoi VWCE ?</div>
        <div style={{ color: "var(--muted)" }}>
          3 800+ actions, 47 pays, capitalisant. Ideal pour un DCA long terme.
        </div>
      </div>

      <div className="mt-3 flex justify-end text-xs">
        <a
          href="https://liberty-trade.vercel.app"
          target="_blank"
          rel="noopener"
          className="underline hover:no-underline"
          style={{ color: "var(--blue)" }}
        >
          Ouvrir
        </a>
      </div>
    </div>
  );
}
