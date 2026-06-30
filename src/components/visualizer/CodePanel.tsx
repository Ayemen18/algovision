"use client";

import type { VizTrace, VizStep, VizLanguage } from "@/types/visualizer";
import { resolveLine } from "@/types/visualizer";

interface CodePanelProps {
  trace: VizTrace;
  step:  VizStep;
  lang:  VizLanguage;
}

const KIND_COLOR: Record<string, string> = {
  normal:  "#6366f1",
  compare: "#f59e0b",
  success: "#00ff88",
  error:   "#fb7185",
};

const LANG_EXT: Record<VizLanguage, string> = {
  python: "solution.py", javascript: "solution.js", typescript: "solution.ts",
  java: "Solution.java", cpp: "solution.cpp",
};

export function CodePanel({ trace, step, lang }: CodePanelProps) {
  const accent  = KIND_COLOR[step.kind || "normal"];
  const code    = trace.code[lang] || [];
  const activeLine = resolveLine(step, lang);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0c0c12" }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0, background: "#0f0f16",
      }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
        <span style={{ marginLeft: 8, fontSize: 12, color: "#666680", fontFamily: "'DM Mono',monospace" }}>
          {LANG_EXT[lang]}
        </span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent, boxShadow: `0 0 8px ${accent}` }} />
          <span style={{ fontSize: 11, color: "#666680", fontFamily: "'DM Mono',monospace", textTransform: "capitalize" }}>
            {step.kind || "normal"}
          </span>
        </div>
      </div>

      {/* Code lines */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 0", fontFamily: "'DM Mono',monospace", fontSize: 13.5 }}>
        {code.map((line, i) => {
          const lineNum  = i + 1;
          const isActive = lineNum === activeLine;
          return (
            <div key={i} style={{
              display: "flex", gap: 18, padding: "4px 18px",
              background: isActive ? `linear-gradient(90deg, ${accent}22, ${accent}08)` : "transparent",
              borderLeft: `2px solid ${isActive ? accent : "transparent"}`,
              transition: "all 0.25s ease",
              position: "relative",
            }}>
              {isActive && (
                <div style={{
                  position: "absolute", left: -1, top: 0, bottom: 0, width: 2,
                  background: accent, boxShadow: `0 0 8px ${accent}`,
                }} />
              )}
              <span style={{ width: 22, textAlign: "right", color: isActive ? "#666680" : "#34344a", userSelect: "none", flexShrink: 0, fontSize: 12 }}>
                {lineNum}
              </span>
              <span style={{
                color: isActive ? "#f4f4f8" : "#85859c",
                whiteSpace: "pre",
                fontWeight: isActive ? 500 : 400,
                letterSpacing: "-0.01em",
              }}>
                {line || " "}
              </span>
            </div>
          );
        })}
      </div>

      {/* Explanation bar */}
      <div style={{
        padding: "18px 20px", borderTop: "1px solid rgba(255,255,255,0.06)",
        background: `linear-gradient(180deg, ${accent}10, ${accent}05)`,
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 7, flexShrink: 0,
            background: `${accent}22`, border: `1px solid ${accent}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            marginTop: 1,
          }}>
            <span style={{ fontSize: 11 }}>
              {step.kind === "success" ? "✓" : step.kind === "compare" ? "?" : step.kind === "error" ? "!" : "→"}
            </span>
          </div>
          <p style={{ fontSize: 14, color: "#e8e8f0", lineHeight: 1.6, fontFamily: "'Cabinet Grotesk',sans-serif" }}>
            {step.explanation}
          </p>
        </div>
      </div>
    </div>
  );
}