"use client";

import type { VizTrace } from "@/types/visualizer";
import { useState } from "react";

export function ComplexityPanel({ complexity }: { complexity: VizTrace["complexity"] }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 20px", background: "transparent", border: "none", cursor: "pointer",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 12, color: "#555570" }}>Complexity</span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, fontWeight: 700, color: "#00d4ff" }}>
            Time {complexity.time}
          </span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, fontWeight: 700, color: "#00ff88" }}>
            Space {complexity.space}
          </span>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555570" strokeWidth="2" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <div style={{ padding: "0 20px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <p style={{ fontSize: 11, color: "#00d4ff", fontWeight: 700, marginBottom: 4 }}>TIME — {complexity.time}</p>
            <p style={{ fontSize: 12, color: "#9898b0", lineHeight: 1.6 }}>{complexity.timeExplanation}</p>
          </div>
          <div>
            <p style={{ fontSize: 11, color: "#00ff88", fontWeight: 700, marginBottom: 4 }}>SPACE — {complexity.space}</p>
            <p style={{ fontSize: 12, color: "#9898b0", lineHeight: 1.6 }}>{complexity.spaceExplanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}