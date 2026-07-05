"use client";

import { useState, useCallback } from "react";
import { CodeEditor }       from "./CodeEditor";
import { EditorToolbar }    from "./EditorToolbar";
import { ExplanationPanel } from "@/components/ai/ExplanationPanel";
import { AnalysisPanel }    from "@/components/analysis/AnalysisPanel";
import { SubmitButton }     from "@/components/analysis/SubmitButton";
import type { LCProblemDetail } from "@/lib/leetcode";
import { useEditorStore }   from "@/store/editorStore";
import type { AnalysisResult } from "@/types/analysis";

interface SolvePageClientProps {
  problem:     LCProblemDetail;
  starterCode: string;
}

type ActiveTab    = "problem" | "ai" | "analysis";
type SubmitState  = "idle" | "loading" | "done" | "error";

export function SolvePageClient({ problem, starterCode }: SolvePageClientProps) {
  const [activeTab,   setActiveTab]   = useState<ActiveTab>("ai");
  const [leftWidth,   setLeftWidth]   = useState(38);
  const [isDragging,  setIsDragging]  = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [analysis,    setAnalysis]    = useState<AnalysisResult | null>(null);

  const { code, language } = useEditorStore();

  // ─── Submit for analysis ────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!code.trim()) return;

    setSubmitState("loading");
    setActiveTab("analysis");

    try {
      const res = await fetch("/api/analyze", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          title:       problem.title,
          difficulty:  problem.difficulty,
          description: problem.content,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      setAnalysis(json.data);
      setSubmitState("done");
    } catch (err) {
      setSubmitState("error");
    }
  }, [code, language, problem]);

  // ─── Drag divider ───────────────────────────────────────────────────────────
  const handleDividerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const startX     = e.clientX;
    const startWidth = leftWidth;

    const onMove = (e: MouseEvent) => {
      const delta    = ((e.clientX - startX) / window.innerWidth) * 100;
      const newWidth = Math.min(55, Math.max(25, startWidth + delta));
      setLeftWidth(newWidth);
    };
    const onUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const diffColors: Record<string, string> = {
    Easy: "#34d399", Medium: "#fbbf24", Hard: "#fb7185",
  };

  // Derive tab badge for analysis
  const analysisBadge = analysis
    ? analysis.status === "correct"
      ? { text: "✓", color: "#00ff88" }
      : analysis.status === "inefficient"
      ? { text: "⚠", color: "#f59e0b" }
      : { text: "✗", color: "#fb7185" }
    : null;

  return (
    <div style={{
      height: "100vh", display: "flex", flexDirection: "column",
      background: "#0a0a0f", overflow: "hidden",
      userSelect: isDragging ? "none" : "auto",
    }}>

      {/* ── Top bar ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", height: 52,
        background: "#0f0f16",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0, zIndex: 10,
      }}>
        {/* Left: Logo + problem */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 10px rgba(99,102,241,0.4)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 14, fontWeight: 700, color: "#fff" }}>
              Algo<span style={{ color: "#818cf8" }}>Vision</span>
            </span>
          </div>
          <span style={{ color: "#3a3a50" }}>·</span>
          <span style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 14, fontWeight: 600, color: "#9898b0", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {problem.questionFrontendId}. {problem.title}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
            color: diffColors[problem.difficulty],
            background: `${diffColors[problem.difficulty]}15`,
            border: `1px solid ${diffColors[problem.difficulty]}30`,
          }}>
            {problem.difficulty}
          </span>
        </div>

        {/* Right: submit + links */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SubmitButton state={submitState} onSubmit={handleSubmit} />
          <a href={`/problems/${problem.titleSlug}/visualize?lang=${language}`} style={{
            padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.25)",
            color: "#00ff88", textDecoration: "none",
          }}>
            ▶ Visualize
          </a>
          <a href={`/problems/${problem.titleSlug}`} style={{ fontSize: 12, color: "#555570", textDecoration: "none" }}>
            ← Back
          </a>
        </div>
      </div>

      {/* ── Main split pane ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── Left panel ── */}
        <div style={{ width: `${leftWidth}%`, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>

          {/* Tab bar */}
          <div style={{ display: "flex", background: "#0f0f16", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
            {(["problem", "ai", "analysis"] as ActiveTab[]).map(tab => {
              const labels: Record<ActiveTab, string> = { problem: "📄 Problem", ai: "🤖 AI Explain", analysis: "🔬 Analysis" };
              const isActive = activeTab === tab;
              return (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  padding: "10px 18px", fontSize: 13, fontWeight: 600,
                  background: "transparent", border: "none", cursor: "pointer",
                  color: isActive ? "#f1f1f5" : "#555570",
                  borderBottom: `2px solid ${isActive ? "#6366f1" : "transparent"}`,
                  transition: "all 0.15s", fontFamily: "'Cabinet Grotesk',sans-serif",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  {labels[tab]}
                  {/* Badge on analysis tab */}
                  {tab === "analysis" && analysisBadge && (
                    <span style={{
                      width: 16, height: 16, borderRadius: "50%", fontSize: 9, fontWeight: 800,
                      background: `${analysisBadge.color}20`, color: analysisBadge.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {analysisBadge.text}
                    </span>
                  )}
                  {/* Loading spinner on analysis tab */}
                  {tab === "analysis" && submitState === "loading" && (
                    <div style={{ width: 12, height: 12, border: "1.5px solid rgba(129,140,248,0.3)", borderTopColor: "#818cf8", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  )}
                </button>
              );
            })}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>

          {/* Tab content */}
          <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>

            {/* Problem tab */}
            {activeTab === "problem" && (
              <div style={{ padding: 24 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                  {problem.topicTags.map(t => (
                    <span key={t.slug} style={{ fontSize: 11, color: "#818cf8", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 6, padding: "3px 8px" }}>{t.name}</span>
                  ))}
                </div>
                <div className="problem-content" dangerouslySetInnerHTML={{ __html: problem.content }} style={{ fontSize: 14, color: "#9898b0", lineHeight: 1.75 }} />
                {problem.hints?.length > 0 && (
                  <div style={{ marginTop: 24 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 10 }}>💡 Hints</p>
                    {problem.hints.map((h, i) => (
                      <details key={i} style={{ marginBottom: 6, borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
                        <summary style={{ padding: "8px 14px", cursor: "pointer", fontSize: 13, color: "#9898b0", background: "rgba(255,255,255,0.03)", listStyle: "none" }}>Hint {i + 1}</summary>
                        <div style={{ padding: "10px 14px", fontSize: 13, color: "#f1f1f5" }} dangerouslySetInnerHTML={{ __html: h }} />
                      </details>
                    ))}
                  </div>
                )}
                <style>{`
                  .problem-content p { margin-bottom: 10px; }
                  .problem-content pre { background: #1a1a24; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 14px; font-family: 'DM Mono',monospace; font-size: 12px; color: #c7d7fe; overflow-x: auto; margin: 10px 0; }
                  .problem-content code { font-family: 'DM Mono',monospace; font-size: 12px; background: rgba(99,102,241,0.12); border-radius: 4px; padding: 2px 5px; color: #818cf8; }
                  .problem-content pre code { background: none; padding: 0; color: #c7d7fe; }
                  .problem-content strong { color: #f1f1f5; font-weight: 700; }
                  .problem-content ul, .problem-content ol { padding-left: 20px; margin-bottom: 10px; }
                  .problem-content li { margin-bottom: 4px; }
                `}</style>
              </div>
            )}

            {/* AI tab */}
            {activeTab === "ai" && <ExplanationPanel problem={problem} />}

            {/* Analysis tab */}
            {activeTab === "analysis" && (
              <>
                {submitState === "idle" && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, padding: 32, textAlign: "center" }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                      🔬
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Ready to analyze</p>
                      <p style={{ fontSize: 13, color: "#555570", lineHeight: 1.6, maxWidth: 260 }}>
                        Write your solution and click "Submit solution" to get AI-powered error analysis.
                      </p>
                    </div>
                    <SubmitButton state="idle" onSubmit={handleSubmit} />
                  </div>
                )}

                {submitState === "loading" && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, padding: 32 }}>
                    <div style={{ width: 36, height: 36, border: "3px solid rgba(99,102,241,0.2)", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin2 0.8s linear infinite" }} />
                    <p style={{ fontSize: 14, color: "#9898b0" }}>Analyzing your solution...</p>
                    <p style={{ fontSize: 12, color: "#555570" }}>Checking logic, edge cases, and complexity</p>
                    <style>{`@keyframes spin2 { to { transform: rotate(360deg); } }`}</style>
                  </div>
                )}

                {submitState === "error" && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, padding: 32, textAlign: "center" }}>
                    <span style={{ fontSize: 36 }}>⚠️</span>
                    <p style={{ fontSize: 14, color: "#fb7185", fontWeight: 600 }}>Analysis failed</p>
                    <p style={{ fontSize: 13, color: "#555570" }}>Check your OpenAI API key and try again.</p>
                    <SubmitButton state="error" onSubmit={handleSubmit} />
                  </div>
                )}

                {submitState === "done" && analysis && (
                  <AnalysisPanel result={analysis} onClose={() => setSubmitState("idle")} />
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Drag divider ── */}
        <div
          onMouseDown={handleDividerMouseDown}
          style={{
            width: 4, flexShrink: 0,
            background: isDragging ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.04)",
            cursor: "col-resize", transition: "background 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.3)")}
          onMouseLeave={e => { if (!isDragging) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
        />

        {/* ── Right: editor ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          <EditorToolbar slug={problem.titleSlug} title={problem.title} starterCode={starterCode} />
          <div style={{ flex: 1, overflow: "hidden" }}>
            <CodeEditor slug={problem.titleSlug} starterCode={starterCode} />
          </div>
        </div>
      </div>
    </div>
  );
}