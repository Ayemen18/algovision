export function ProblemListSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={{
          display: "grid",
          gridTemplateColumns: "48px 1fr auto",
          alignItems: "center",
          gap: 16,
          padding: "16px 20px",
          borderRadius: 12,
          background: "#111118",
          border: "1px solid rgba(255,255,255,0.06)",
          animationDelay: `${i * 50}ms`,
        }}>
          {/* Number */}
          <div style={{ height: 14, width: 28, borderRadius: 4, background: "rgba(255,255,255,0.06)", marginLeft: "auto" }} />

          {/* Title + tags */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{
              height: 16, width: `${55 + (i % 5) * 8}%`,
              borderRadius: 4, background: "rgba(255,255,255,0.06)",
            }} />
            <div style={{ display: "flex", gap: 6 }}>
              {[40, 55, 48].map((w, j) => (
                <div key={j} style={{
                  height: 18, width: w,
                  borderRadius: 4, background: "rgba(255,255,255,0.04)",
                }} />
              ))}
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            <div style={{ height: 22, width: 60, borderRadius: 6, background: "rgba(255,255,255,0.06)" }} />
            <div style={{ height: 12, width: 32, borderRadius: 4, background: "rgba(255,255,255,0.04)" }} />
          </div>
        </div>
      ))}
    </div>
  );
}