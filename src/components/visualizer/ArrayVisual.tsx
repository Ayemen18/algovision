"use client";

import type { VizArrayState } from "@/types/visualizer";

export function ArrayVisual({ array }: { array: VizArrayState }) {
  const pointerEntries = Object.entries(array.pointers || {});

  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555570", marginBottom: 10 }}>
        {array.label}
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: pointerEntries.length > 0 ? 22 : 0, position: "relative" }}>
        {array.values.map((val, idx) => {
          const isHighlight = array.highlight?.includes(idx);
          const isSuccess   = array.success?.includes(idx);

          let bg     = "rgba(255,255,255,0.03)";
          let border = "rgba(255,255,255,0.08)";
          let color  = "#9898b0";
          let shadow = "none";

          if (isSuccess) {
            bg = "rgba(0,255,136,0.15)"; border = "rgba(0,255,136,0.5)"; color = "#00ff88";
            shadow = "0 0 16px rgba(0,255,136,0.3)";
          } else if (isHighlight) {
            bg = "rgba(99,102,241,0.18)"; border = "rgba(99,102,241,0.55)"; color = "#818cf8";
            shadow = "0 0 14px rgba(99,102,241,0.3)";
          }

          return (
            <div key={idx} style={{ position: "relative", flex: 1, minWidth: 0 }}>
              <div style={{
                height: 52, borderRadius: 10,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                background: bg, border: `1px solid ${border}`, boxShadow: shadow,
                transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
              }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 15, fontWeight: 700, color, transition: "color 0.3s" }}>
                  {val}
                </span>
              </div>
              <span style={{ position: "absolute", bottom: -16, left: "50%", transform: "translateX(-50%)", fontSize: 10, color: "#3a3a50" }}>
                {idx}
              </span>

              {/* Pointer arrows */}
              {pointerEntries.filter(([, pidx]) => pidx === idx).map(([pname]) => (
                <div key={pname} style={{
                  position: "absolute", top: 58, left: "50%", transform: "translateX(-50%)",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                  transition: "left 0.35s ease",
                }}>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M6 0L11 7H1L6 0Z" fill="#6366f1"/>
                  </svg>
                  <span style={{
                    fontFamily: "'DM Mono',monospace", fontSize: 10, fontWeight: 700, color: "#818cf8",
                    background: "rgba(99,102,241,0.15)", padding: "1px 6px", borderRadius: 4,
                  }}>
                    {pname}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}