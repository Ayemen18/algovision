"use client";

import type { AnalysisResult, ErrorType } from "@/types/analysis";

// ─── Config ──────────────────────────────────────────────────────────────────

const ERROR_TYPE_LABEL: Record<ErrorType, string> = {
  wrong_logic:          "Wrong Logic",
  off_by_one:           "Off-by-One Error",
  boundary_condition:   "Boundary Condition",
  infinite_loop:        "Infinite Loop",
  wrong_data_structure: "Wrong Data Structure",
  recursion_error:      "Recursion Error",
  inefficient_approach: "Inefficient Approach",
  runtime_error:        "Runtime Error",
  correct:              "Correct Solution",
};

const ERROR_TYPE_EMOJI: Record<ErrorType, string> = {
  wrong_logic:          "🔀",
  off_by_one:           "±1",
  boundary_condition:   "🚧",
  infinite_loop:        "∞",
  wrong_data_structure: "🗃️",
  recursion_error:      "🔁",
  inefficient_approach: "⚡",
  runtime_error:        "💥",
  correct:              "✓",
};

const STATUS_CONFIG = {
  correct: {
    bg:     "rgba(0,255,136,0.06)",
    border: "rgba(0,255,136,0.2)",
    accent: "#00ff88",
    label:  "Accepted",
    icon:   "✓",
  },
  incorrect: {
    bg:     "rgba(251,113,133,0.06)",
    border: "rgba(251,113,133,0.2)",
    accent: "#fb7185",
    label:  "Wrong Answer",
    icon:   "✗",
  },
  inefficient: {
    bg:     "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.2)",
    accent: "#f59e0b",
    label:  "Accepted (Inefficient)",
    icon:   "⚠",
  },
};

const SEVERITY_COLOR = {
  error:   "#fb7185",
  warning: "#f59e0b",
  info:    "#818cf8",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ emoji, title, children, accent = "#818cf8" }: {
  emoji: string; title: string; children: React.ReactNode; accent?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14 }}>{emoji}</span>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: accent }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function CodeBlock({ code, label, accent }: { code: string; label: string; accent: string }) {
  return (
    <div>
      <span style={{ fontSize: 10, color: "#555570", display: "block", marginBottom: 4 }}>{label}</span>
      <div style={{
        fontFamily: "'DM Mono',monospace", fontSize: 12, padding: "10px 14px",
        borderRadius: 8, background: "#0c0c12", border: `1px solid ${accent}30`,
        color: "#c7d7fe", whiteSpace: "pre-wrap", lineHeight: 1.6,
      }}>
        {code}
      </div>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

interface AnalysisPanelProps {
  result:  AnalysisResult;
  onClose: () => void;
}

export function AnalysisPanel({ result, onClose }: AnalysisPanelProps) {
  const statusCfg  = STATUS_CONFIG[result.status];
  const errLabel   = ERROR_TYPE_LABEL[result.errorType];
  const errEmoji   = ERROR_TYPE_EMOJI[result.errorType];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0f0f16", overflow: "hidden" }}>

      {/* Header */}
      <div style={{
        padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: statusCfg.bg, flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Status badge */}
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `${statusCfg.accent}20`, border: `1px solid ${statusCfg.accent}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 800, color: statusCfg.accent,
            }}>
              {statusCfg.icon}
            </div>
            <div>
              <p style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 15, fontWeight: 800, color: "#fff" }}>
                {statusCfg.label}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <span style={{ fontSize: 12 }}>{errEmoji}</span>
                <span style={{ fontSize: 12, color: "#9898b0" }}>{errLabel}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)", color: "#555570", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>×</button>
        </div>
      </div>

      {/* Content — scrollable */}
      <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 24 }}>

        {/* What / Why / How */}
        <Section emoji="🔍" title="What went wrong" accent="#fb7185">
          <p style={{ fontSize: 13, color: "#c8c8d8", lineHeight: 1.7 }}>{result.what}</p>
        </Section>

        <Section emoji="🧠" title="Why it's wrong" accent="#818cf8">
          <p style={{ fontSize: 13, color: "#c8c8d8", lineHeight: 1.7 }}>{result.why}</p>
        </Section>

        <Section emoji="🧭" title="How to fix it" accent="#00d4ff">
          <p style={{ fontSize: 13, color: "#c8c8d8", lineHeight: 1.7 }}>{result.how}</p>
        </Section>

        {/* Failing test case */}
        {result.failingCase && (
          <Section emoji="🧪" title="Failing test case" accent="#f59e0b">
            <div style={{
              borderRadius: 10, overflow: "hidden",
              border: "1px solid rgba(245,158,11,0.2)",
            }}>
              {[
                { label: "Input",    value: result.failingCase.input,    color: "#9898b0" },
                { label: "Expected", value: result.failingCase.expected, color: "#4ade80" },
                { label: "Got",      value: result.failingCase.got,      color: "#fb7185" },
              ].map((row, i) => (
                <div key={row.label} style={{
                  display: "flex", alignItems: "center", padding: "10px 14px",
                  background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                  borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}>
                  <span style={{ width: 70, fontSize: 11, color: "#555570", fontWeight: 600, flexShrink: 0 }}>
                    {row.label}
                  </span>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: row.color }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Line annotations */}
        {result.annotations && result.annotations.length > 0 && (
          <Section emoji="📍" title="Line-level issues" accent="#818cf8">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {result.annotations.map((ann, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  padding: "10px 12px", borderRadius: 8,
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${SEVERITY_COLOR[ann.severity]}20`,
                }}>
                  <div style={{
                    padding: "2px 8px", borderRadius: 5, flexShrink: 0,
                    background: `${SEVERITY_COLOR[ann.severity]}15`,
                    border: `1px solid ${SEVERITY_COLOR[ann.severity]}30`,
                  }}>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, fontWeight: 700, color: SEVERITY_COLOR[ann.severity] }}>
                      L{ann.line}
                    </span>
                  </div>
                  <span style={{ fontSize: 13, color: "#9898b0", lineHeight: 1.5 }}>{ann.message}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Code fix */}
        {result.fix && (
          <Section emoji="🔧" title="Key change" accent="#00ff88">
            <p style={{ fontSize: 12, color: "#555570", marginBottom: 10 }}>{result.fix.description}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <CodeBlock code={result.fix.before} label="Before (problematic)" accent="#fb7185" />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <span style={{ fontSize: 16, color: "#555570" }}>↓</span>
              </div>
              <CodeBlock code={result.fix.after} label="After (direction)" accent="#00ff88" />
            </div>
          </Section>
        )}

        {/* Complexity note */}
        {result.complexity && (
          <Section emoji="⏱" title="Complexity" accent="#00d4ff">
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
            }}>
              <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(251,113,133,0.08)", border: "1px solid rgba(251,113,133,0.15)" }}>
                <p style={{ fontSize: 10, color: "#555570", marginBottom: 4 }}>Your solution</p>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 15, fontWeight: 700, color: "#fb7185" }}>
                  {result.complexity.current}
                </p>
              </div>
              <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.15)" }}>
                <p style={{ fontSize: 10, color: "#555570", marginBottom: 4 }}>Optimal</p>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 15, fontWeight: 700, color: "#00ff88" }}>
                  {result.complexity.optimal}
                </p>
              </div>
            </div>
            {result.complexity.note && (
              <p style={{ fontSize: 12, color: "#9898b0", lineHeight: 1.6, marginTop: 6 }}>{result.complexity.note}</p>
            )}
          </Section>
        )}

        {/* Hint */}
        <div style={{
          padding: "14px 16px", borderRadius: 10,
          background: "rgba(99,102,241,0.06)",
          border: "1px solid rgba(99,102,241,0.15)",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>💭</span>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#818cf8", marginBottom: 4 }}>Hint</p>
              <p style={{ fontSize: 13, color: "#9898b0", lineHeight: 1.6, fontStyle: "italic" }}>"{result.hint}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}