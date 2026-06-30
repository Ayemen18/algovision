"use client";

import { useEffect, useState } from "react";
import { useVisualizerStore } from "@/store/visualizerStore";
import { CodePanel }           from "./CodePanel";
import { VisualizationPanel }  from "./VisualizationPanel";
import { PlaybackControls }    from "./PlaybackControls";
import { ComplexityPanel }     from "./ComplexityPanel";
import type { VizTrace } from "@/types/visualizer";

interface VisualizerShellProps {
  slug:           string;
  title:          string;
  difficulty:     string;
  isCuratedTrace: boolean;
  curatedTrace:   VizTrace | null;
  // For AI generation fallback
  problemContent: string;
}

const DIFF_COLORS: Record<string, string> = { Easy: "#34d399", Medium: "#fbbf24", Hard: "#fb7185" };

export function VisualizerShell({
  slug, title, difficulty, isCuratedTrace, curatedTrace, problemContent,
}: VisualizerShellProps) {
  const { trace, currentStep, setTrace } = useVisualizerStore();
  const [loading, setLoading] = useState(!isCuratedTrace);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (isCuratedTrace && curatedTrace) {
      setTrace(curatedTrace);
      setLoading(false);
      return;
    }

    // Generate via AI
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/visualize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, difficulty, content: problemContent, slug }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setTrace(json.data);
      } catch (err) {
        setError("Couldn't generate a visualization for this problem. Try one of our flagship problems like Two Sum or Binary Search.");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const diffColor = DIFF_COLORS[difficulty] || "#818cf8";

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#0a0a0f", overflow: "hidden" }}>

      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", height: 52, background: "#0f0f16",
        borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0,
      }}>
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
          <span style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 14, fontWeight: 600, color: "#9898b0" }}>{title}</span>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, color: diffColor, background: `${diffColor}15`, border: `1px solid ${diffColor}30` }}>
            {difficulty}
          </span>
          {isCuratedTrace && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6, color: "#00ff88", background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.25)" }}>
              ✓ Curated
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a href={`/problems/${slug}/solve`} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", color: "#818cf8", textDecoration: "none" }}>
            ✏️ Write solution
          </a>
          <a href={`/problems/${slug}`} style={{ fontSize: 12, color: "#555570", textDecoration: "none" }}>← Back</a>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <div style={{ width: 40, height: 40, border: "3px solid rgba(99,102,241,0.2)", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontSize: 14, color: "#9898b0" }}>
            {isCuratedTrace ? "Loading visualization..." : "AI is generating your visualization..."}
          </p>
          {!isCuratedTrace && <p style={{ fontSize: 12, color: "#555570" }}>This usually takes 5-10 seconds</p>}
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24, textAlign: "center" }}>
          <span style={{ fontSize: 40 }}>⚠️</span>
          <p style={{ fontSize: 15, color: "#fb7185", fontWeight: 600, maxWidth: 400 }}>{error}</p>
          <div style={{ display: "flex", gap: 10 }}>
            <a href="/problems/two-sum/visualize" style={{ padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, background: "#6366f1", color: "#fff", textDecoration: "none" }}>
              Try Two Sum
            </a>
            <a href="/problems" style={{ padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9898b0", textDecoration: "none" }}>
              Browse problems
            </a>
          </div>
        </div>
      )}

      {/* Main content */}
      {trace && !loading && !error && (
        <>
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden" }}>
            <div style={{ borderRight: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <CodePanel trace={trace} step={trace.steps[currentStep]} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <VisualizationPanel step={trace.steps[currentStep]} />
              </div>
              <ComplexityPanel complexity={trace.complexity} />
            </div>
          </div>
          <PlaybackControls />
        </>
      )}
    </div>
  );
}