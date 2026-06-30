"use client";

import type { VizVariable } from "@/types/visualizer";

export function VariablesPanel({ variables }: { variables: VizVariable[] }) {
  if (!variables || variables.length === 0) return null;

  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555570", marginBottom: 10 }}>
        Variables
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {variables.map(v => (
          <div key={v.name} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 12px", borderRadius: 8,
            background: v.changed ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${v.changed ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.05)"}`,
            transition: "all 0.3s ease",
          }}>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#818cf8", fontWeight: 600 }}>
              {v.name}
            </span>
            <span style={{
              fontFamily: "'DM Mono',monospace", fontSize: 12, fontWeight: 700,
              color: v.changed ? "#00d4ff" : "#f1f1f5",
            }}>
              {String(v.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}