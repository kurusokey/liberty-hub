"use client";

export default function PeaCard() {
  // PEA info from user data
  const peaOpenDate = new Date("2021-03-03");
  const now = new Date();
  const yearsHeld = ((now.getTime() - peaOpenDate.getTime()) / (365.25 * 24 * 3600 * 1000));
  const fiveYearsReached = yearsHeld >= 5;
  const plafond = 150000;

  return (
    <div className="rounded-xl p-5 border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold" style={{ color: "var(--purple)" }}>Liberty PEA</h2>
        <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--purple)", color: "#fff" }}>
          LCL
        </span>
      </div>

      {/* Fiscal status */}
      <div className="mb-4">
        <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>Statut fiscal</div>
        <div className="flex items-center gap-2">
          {fiveYearsReached ? (
            <>
              <span className="text-2xl font-bold" style={{ color: "var(--green)" }}>17.2%</span>
              <span className="text-xs" style={{ color: "var(--green)" }}>PS uniquement</span>
            </>
          ) : (
            <>
              <span className="text-2xl font-bold" style={{ color: "var(--red)" }}>30%</span>
              <span className="text-xs" style={{ color: "var(--red)" }}>Flat tax</span>
            </>
          )}
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>Ouverture</div>
          <div className="font-medium">3 mars 2021</div>
        </div>
        <div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>Anciennete</div>
          <div className="font-medium" style={{ color: fiveYearsReached ? "var(--green)" : "var(--text)" }}>
            {yearsHeld.toFixed(1)} ans {fiveYearsReached ? " — 5 ans atteints" : ""}
          </div>
        </div>
        <div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>Plafond versements</div>
          <div className="font-medium">{plafond.toLocaleString("fr-FR")} EUR</div>
        </div>
        <div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>Courtier</div>
          <div className="font-medium">LCL</div>
        </div>
      </div>

      {/* Avantage fiscal */}
      <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: "var(--card)" }}>
        <div className="font-medium mb-1" style={{ color: "var(--green)" }}>
          Avantage fiscal actif
        </div>
        <div style={{ color: "var(--muted)" }}>
          Apres 5 ans, seuls les prelevements sociaux (17.2%) s&apos;appliquent sur les plus-values.
          Pas d&apos;impot sur le revenu.
        </div>
      </div>

      <div className="mt-3 flex justify-end text-xs">
        <a
          href="https://liberty-pea.vercel.app"
          target="_blank"
          rel="noopener"
          className="underline hover:no-underline"
          style={{ color: "var(--purple)" }}
        >
          Ouvrir
        </a>
      </div>
    </div>
  );
}
