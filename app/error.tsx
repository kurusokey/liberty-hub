"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl"
             style={{ background: "rgba(247,86,79,0.1)" }}>
          !
        </div>
        <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
          Erreur de chargement
        </h2>
        <p className="text-sm max-w-sm mx-auto" style={{ color: "var(--muted)" }}>
          {error.message || "Une erreur est survenue lors du chargement du dashboard."}
        </p>
        <button onClick={reset}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: "var(--accent)", color: "#000" }}>
          Reessayer
        </button>
      </div>
    </div>
  );
}
