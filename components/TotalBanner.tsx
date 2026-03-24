"use client";

interface Props {
  risk: { capital: number; dryRun: boolean } | null;
  vwce: { price: number } | null;
}

export default function TotalBanner({ risk, vwce }: Props) {
  // Liberty Risk capital
  const riskCapital = risk?.capital ?? 0;

  // Liberty Trade: estimate from DCA (100EUR/month since user started)
  // Price shown separately — user's actual shares are in their app
  const vwcePrice = vwce?.price ?? 0;

  return (
    <div
      className="rounded-xl p-5 border"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
            Ecosysteme Liberty
          </div>
          <div className="flex items-baseline gap-3 flex-wrap">
            <div>
              <span className="text-xs" style={{ color: "var(--muted)" }}>Crypto </span>
              <span className="text-xl font-bold">{riskCapital.toLocaleString("fr-FR")} USDT</span>
              {risk?.dryRun && (
                <span className="ml-2 text-xs px-2 py-0.5 rounded" style={{ background: "var(--accent)", color: "#000" }}>
                  PAPER
                </span>
              )}
            </div>
            <div className="text-lg" style={{ color: "var(--muted)" }}>|</div>
            <div>
              <span className="text-xs" style={{ color: "var(--muted)" }}>VWCE </span>
              <span className="text-xl font-bold">{vwcePrice.toFixed(2)} EUR</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <a
            href="https://liberty-risk.vercel.app"
            target="_blank"
            rel="noopener"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{ background: "var(--accent)", color: "#000" }}
          >
            Risk Dashboard
          </a>
          <a
            href="https://liberty-trade.vercel.app"
            target="_blank"
            rel="noopener"
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-opacity hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            Trade App
          </a>
          <a
            href="https://liberty-pea.vercel.app"
            target="_blank"
            rel="noopener"
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-opacity hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            PEA App
          </a>
        </div>
      </div>
    </div>
  );
}
