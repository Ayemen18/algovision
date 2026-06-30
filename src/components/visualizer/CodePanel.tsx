"use client";

import type { VizTrace, VizStep } from "@/types/visualizer";

interface CodePanelProps {
  trace: VizTrace;
  step:  VizStep;
}

const KIND_COLOR: Record<string, string> = {
  normal:  "#6366f1",
  compare: "#f59e0b",
  success: "#00ff88",
  error:   "#fb7185",
};

export function CodePanel({ trace, step }: CodePanelProps) {
  const accent = KIND_COLOR[step.kind || "normal"];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0f0f16" }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
        <span style={{ marginLeft: 8, fontSize: 12, color: "#555570", fontFamily: "'DM Mono',monospace" }}>
          solution.py
        </span>
      </div>

      {/* Code lines */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 0", fontFamily: "'DM Mono',monospace", fontSize: 13 }}>
        {trace.code.map((line, i) => {
          const lineNum   = i + 1;
          const isActive  = lineNum === step.line;
          return (
            <div key={i} style={{
              display: "flex", gap: 16, padding: "3px 16px",
              background: isActive ? `${accent}18` : "transparent",
              borderLeft: `2px solid ${isActive ? accent : "transparent"}`,
              transition: "all 0.25s ease",
            }}>
              <span style={{ width: 20, textAlign: "right", color: "#3a3a50", userSelect: "none", flexShrink: 0 }}>
                {lineNum}
              </span>
              <span style={{
                color: isActive ? "#f1f1f5" : "#9898b0",
                whiteSpace: "pre",
                fontWeight: isActive ? 500 : 400,
              }}>
                {line || " "}
              </span>
            </div>
          );
        })}
      </div>

      {/* Explanation bar */}
      <div style={{
        padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)",
        background: `${accent}0c`, flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: accent, marginTop: 6, flexShrink: 0 }} />
          <p style={{ fontSize: 14, color: "#f1f1f5", lineHeight: 1.6, fontFamily: "'Cabinet Grotesk',sans-serif" }}>
            {step.explanation}
          </p>
        </div>
      </div>
    </div>
  );
}