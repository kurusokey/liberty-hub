"use client";

const IMMO_COLOR = "#6c63ff";

export default function ImmoCard() {
  return (
    <div className="rounded-xl p-5 border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold" style={{ color: IMMO_COLOR }}>Liberty Immo</h2>
        <span className="text-xs px-2 py-0.5 rounded" style={{ background: IMMO_COLOR, color: "#fff" }}>
          Simulateur
        </span>
      </div>

      {/* Description */}
      <div className="mb-4">
        <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>Achat immobilier</div>
        <div className="text-sm" style={{ color: "var(--text)" }}>
          Simulez votre capacite d&apos;achat et obtenez un score de faisabilite sur 10.
        </div>
      </div>

      {/* Features grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>Score</div>
          <div className="font-medium" style={{ color: IMMO_COLOR }}>0 a 10</div>
        </div>
        <div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>Seuil HCSF</div>
          <div className="font-medium">35% max</div>
        </div>
        <div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>Projections</div>
          <div className="font-medium">Patrimoine & inflation</div>
        </div>
        <div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>Agent IA</div>
          <div className="font-medium" style={{ color: "var(--green)" }}>Recherche par ville</div>
        </div>
      </div>

      {/* Features list */}
      <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: "var(--card)" }}>
        <div className="font-medium mb-1" style={{ color: IMMO_COLOR }}>
          Fonctionnalites
        </div>
        <div style={{ color: "var(--muted)" }}>
          Mensualites, frais de notaire, DPE, louer vs acheter, projection patrimoine, agent IA de recherche immobiliere.
        </div>
      </div>

      <div className="mt-3 flex justify-end text-xs">
        <a
          href="https://liberty-immo.vercel.app"
          target="_blank"
          rel="noopener"
          className="underline hover:no-underline"
          style={{ color: IMMO_COLOR }}
        >
          Ouvrir
        </a>
      </div>
    </div>
  );
}
