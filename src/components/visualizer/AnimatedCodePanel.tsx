"use client";

import type { VizTrace, VizStep, VizLanguage } from "@/types/visualizer";
import { resolveLine } from "@/types/visualizer";
import { motion, AnimatePresence } from "framer-motion";

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

export function AnimatedCodePanel({ trace, step, lang }: CodePanelProps) {
  const accent  = KIND_COLOR[step.kind || "normal"];
  const code    = trace.code[lang] || [];
  const activeLine = resolveLine(step, lang);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0c0c12" }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0, background: "#0f0f16",
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffbd2e" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840" }} />
        <span style={{ marginLeft: 6, fontSize: 11, color: "#666680", fontFamily: "'DM Mono',monospace" }}>
          {LANG_EXT[lang]}
        </span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
          <motion.span 
            animate={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}` }}
            style={{ width: 6, height: 6, borderRadius: "50%" }} 
          />
          <motion.span 
            animate={{ color: accent }}
            style={{ fontSize: 10, fontFamily: "'DM Mono',monospace", textTransform: "capitalize", fontWeight: 600 }}
          >
            {step.kind || "normal"}
          </motion.span>
        </div>
      </div>

      {/* Code lines */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 0", fontFamily: "'DM Mono',monospace", fontSize: 12, lineHeight: 1.5 }}>
        {code.map((line, i) => {
          const lineNum  = i + 1;
          const isActive = lineNum === activeLine;
          return (
            <motion.div 
              key={i} 
              animate={{
                backgroundColor: isActive ? `rgba(${hexToRgb(accent)}, 0.12)` : "transparent",
              }}
              style={{
                display: "flex", gap: 14, padding: "2px 14px",
                borderLeft: `2px solid transparent`, // Handled by inner absolute div
                position: "relative",
              }}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div 
                    layoutId="active-line-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, backgroundColor: accent, boxShadow: `0 0 8px ${accent}` }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    style={{
                      position: "absolute", left: -1, top: 0, bottom: 0, width: 2,
                    }} 
                  />
                )}
              </AnimatePresence>
              <span style={{ width: 20, textAlign: "right", color: isActive ? "#666680" : "#34344a", userSelect: "none", flexShrink: 0, fontSize: 11 }}>
                {lineNum}
              </span>
              <motion.span 
                animate={{ color: isActive ? "#f4f4f8" : "#85859c", fontWeight: isActive ? 500 : 400 }}
                style={{ whiteSpace: "pre", letterSpacing: "-0.01em" }}
              >
                {line || " "}
              </motion.span>
            </motion.div>
          );
        })}
      </div>

      {/* Explanation bar */}
      <motion.div 
        animate={{
          background: `linear-gradient(180deg, rgba(${hexToRgb(accent)}, 0.08), rgba(${hexToRgb(accent)}, 0.03))`,
          borderTopColor: `rgba(${hexToRgb(accent)}, 0.15)`,
        }}
        style={{
          padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <motion.div 
            animate={{
              backgroundColor: `rgba(${hexToRgb(accent)}, 0.15)`,
              borderColor: `rgba(${hexToRgb(accent)}, 0.3)`,
            }}
            style={{
              width: 20, height: 20, borderRadius: 6, flexShrink: 0,
              border: `1px solid transparent`,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginTop: 1,
            }}
          >
            <span style={{ fontSize: 10, color: accent, fontWeight: "bold" }}>
              {step.kind === "success" ? "✓" : step.kind === "compare" ? "?" : step.kind === "error" ? "!" : "→"}
            </span>
          </motion.div>
          <motion.p 
            key={step.explanation}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 13, color: "#e8e8f0", lineHeight: 1.5, fontFamily: "'Cabinet Grotesk',sans-serif" }}
          >
            {step.explanation}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

// Utility to convert hex to rgb for rgba strings
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "99, 102, 241";
}