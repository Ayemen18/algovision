"use client";

import type { VizStackState } from "@/types/visualizer";

export function StackVisual({ stack }: { stack: VizStackState }) {
  // Render top of stack first (reverse of array order)
  const framesTopFirst = [...stack.frames].reverse();

  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555570", marginBottom: 10 }}>
        {stack.label}
      </p>
      <div style={{ display: "flex", flexDirection: "column-reverse", gap: 4 }}>
        {framesTopFirst.length === 0 ? (
          <div style={{ height: 40, borderRadius: 8, border: "1px dashed rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 12, color: "#3a3a50" }}>Stack empty</span>
          </div>
        ) : (
          framesTopFirst.map((frame, i) => (
            <div key={i} style={{
              padding: "8px 14px", borderRadius: 8,
              background: frame.active ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${frame.active ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.06)"}`,
              boxShadow: frame.active ? "0 0 12px rgba(99,102,241,0.25)" : "none",
              transition: "all 0.3s ease",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, fontWeight: 600, color: frame.active ? "#818cf8" : "#9898b0" }}>
                  {frame.label}
                </span>
                {frame.active && <span style={{ fontSize: 9, color: "#818cf8" }}>● active</span>}
              </div>
              {frame.detail && (
                <span style={{ fontSize: 11, color: "#555570", fontFamily: "'DM Mono',monospace" }}>{frame.detail}</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}