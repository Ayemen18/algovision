"use client";

import type { VizArrayState } from "@/types/visualizer";

export function ArrayVisual({ array }: { array: VizArrayState }) {
  const pointerEntries = Object.entries(array.pointers || {});

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#6366f1" }} />
        <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#71718a", fontWeight: 600 }}>
          {array.label}
        </p>
      </div>

      <div style={{ display: "flex", gap: 7, marginBottom: pointerEntries.length > 0 ? 26 : 4, position: "relative" }}>
        {array.values.map((val, idx) => {
          const isHighlight = array.highlight?.includes(idx);
          const isSuccess   = array.success?.includes(idx);

          let bg     = "rgba(255,255,255,0.025)";
          let border = "rgba(255,255,255,0.08)";
          let color  = "#9898b0";
          let shadow = "inset 0 1px 0 rgba(255,255,255,0.02)";
          let scale  = "scale(1)";

          if (isSuccess) {
            bg = "linear-gradient(145deg, rgba(0,255,136,0.18), rgba(0,255,136,0.08))";
            border = "rgba(0,255,136,0.55)"; color = "#4ade80";
            shadow = "0 0 18px rgba(0,255,136,0.35), inset 0 1px 0 rgba(255,255,255,0.08)";
            scale = "scale(1.04)";
          } else if (isHighlight) {
            bg = "linear-gradient(145deg, rgba(99,102,241,0.22), rgba(99,102,241,0.1))";
            border = "rgba(99,102,241,0.6)"; color = "#a5b4fc";
            shadow = "0 0 16px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.08)";
            scale = "scale(1.04)";
          }

          return (
            <div key={idx} style={{ position: "relative", flex: 1, minWidth: 0 }}>
              <div style={{
                height: 54, borderRadius: 11,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                background: bg, border: `1px solid ${border}`, boxShadow: shadow,
                transform: scale,
                transition: "all 0.4s cubic-bezier(0.34,1.4,0.64,1)",
              }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 16, fontWeight: 700, color, transition: "color 0.3s", letterSpacing: "-0.02em" }}>
                  {val}
                </span>
              </div>
              <span style={{
                position: "absolute", bottom: -17, left: "50%", transform: "translateX(-50%)",
                fontSize: 10, color: "#454560", fontFamily: "'DM Mono',monospace",
              }}>
                {idx}
              </span>

              {pointerEntries.filter(([, pidx]) => pidx === idx).map(([pname], pi) => (
                <div key={pname} style={{
                  position: "absolute", top: 62 + pi * 28, left: "50%", transform: "translateX(-50%)",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                  transition: "left 0.4s cubic-bezier(0.34,1.4,0.64,1), top 0.3s ease",
                  zIndex: 5,
                }}>
                  <svg width="11" height="7" viewBox="0 0 12 8" fill="none">
                    <path d="M6 0L11 7H1L6 0Z" fill="#818cf8"/>
                  </svg>
                  <span style={{
                    fontFamily: "'DM Mono',monospace", fontSize: 10, fontWeight: 700, color: "#a5b4fc",
                    background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.3)",
                    padding: "2px 7px", borderRadius: 5, whiteSpace: "nowrap",
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