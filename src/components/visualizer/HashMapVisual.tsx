"use client";

import type { VizHashMapState } from "@/types/visualizer";

export function HashMapVisual({ hashmap }: { hashmap: VizHashMapState }) {
  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555570", marginBottom: 10 }}>
        {hashmap.label} {hashmap.entries.length === 0 && <span style={{ color: "#3a3a50" }}>(empty)</span>}
      </p>

      {hashmap.entries.length === 0 ? (
        <div style={{
          height: 52, borderRadius: 10, border: "1px dashed rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 12, color: "#3a3a50" }}>No entries yet</span>
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {hashmap.entries.map(([key, val]) => {
            const isHighlight = hashmap.highlightKey === key;
            return (
              <div key={key} style={{
                display: "flex", alignItems: "center", borderRadius: 8, overflow: "hidden",
                border: `1px solid ${isHighlight ? "rgba(0,255,136,0.5)" : "rgba(255,255,255,0.08)"}`,
                boxShadow: isHighlight ? "0 0 14px rgba(0,255,136,0.25)" : "none",
                transition: "all 0.3s ease",
              }}>
                <div style={{
                  padding: "8px 12px",
                  background: isHighlight ? "rgba(0,255,136,0.15)" : "rgba(99,102,241,0.1)",
                  fontFamily: "'DM Mono',monospace", fontSize: 13, fontWeight: 700,
                  color: isHighlight ? "#00ff88" : "#818cf8",
                }}>
                  {key}
                </div>
                <div style={{
                  padding: "8px 12px", background: "rgba(255,255,255,0.03)",
                  fontFamily: "'DM Mono',monospace", fontSize: 13, color: "#f1f1f5",
                }}>
                  {val}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}