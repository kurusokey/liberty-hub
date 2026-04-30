export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-40 rounded-lg animate-pulse" style={{ background: "var(--border)" }} />
          <div className="h-3 w-64 rounded animate-pulse" style={{ background: "var(--border)" }} />
        </div>
      </div>

      {/* DCA hero card skeleton */}
      <div className="rounded-xl p-6 animate-pulse" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="h-4 w-32 rounded" style={{ background: "var(--border)" }} />
        <div className="h-8 w-48 rounded mt-3" style={{ background: "var(--border)" }} />
        <div className="flex gap-6 mt-4">
          <div className="h-4 w-24 rounded" style={{ background: "var(--border)" }} />
          <div className="h-4 w-24 rounded" style={{ background: "var(--border)" }} />
          <div className="h-4 w-24 rounded" style={{ background: "var(--border)" }} />
        </div>
      </div>

      {/* Project cards grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="rounded-xl p-5 animate-pulse" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg" style={{ background: "var(--border)" }} />
              <div className="h-4 w-28 rounded" style={{ background: "var(--border)" }} />
            </div>
            <div className="h-6 w-24 rounded mt-2" style={{ background: "var(--border)" }} />
            <div className="h-3 w-40 rounded mt-2" style={{ background: "var(--border)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
