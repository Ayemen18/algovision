"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Insight {
  summary:         string;
  strengths:       string[];
  weaknesses:      string[];
  recommendations: { topic: string; reason: string; priority: "high" | "medium" | "low" }[];
  nextSteps:       string;
}

const PRIORITY_CONFIG = {
  high:   { color: "#fb7185", bg: "rgba(251,113,133,0.1)", label: "High priority"   },
  medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  label: "Medium priority" },
  low:    { color: "#818cf8", bg: "rgba(99,102,241,0.1)",  label: "Low priority"    },
};

export function InsightsClient() {
  const [insights, setInsights] = useState<Insight | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch("/api/insights");
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setInsights(json.data);
      } catch (err) {
        setError("Failed to load insights. Make sure you have some solved problems first.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[100, 60, 80, 70].map((w, i) => (
          <div key={i} style={{ height: 20, width: `${w}%`, borderRadius: 4, background: "rgba(255,255,255,0.05)" }} />
        ))}
      </div>
    );
  }

  if (error || !insights) {
    return (
      <div style={{ padding: 32, borderRadius: 16, textAlign: "center", background: "#111118", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ fontSize: 14, color: "#9898b0", marginBottom: 16 }}>
          {error || "Solve at least 3 problems to unlock personalized insights."}
        </p>
        <Link href="/problems" style={{
          padding: "10px 24px", borderRadius: 10, fontSize: 13, fontWeight: 700,
          background: "#6366f1", color: "#fff", textDecoration: "none",
          display: "inline-block",
        }}>
          Browse problems
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Summary */}
      <div style={{
        padding: 28, borderRadius: 16,
        background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 20 }}>🧠</span>
          <span style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 14, fontWeight: 700, color: "#818cf8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Your assessment
          </span>
        </div>
        <p style={{ fontSize: 15, color: "#e8e8f0", lineHeight: 1.7 }}>{insights.summary}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Strengths */}
        <div style={{ padding: 24, borderRadius: 16, background: "#111118", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 16 }}>💪</span>
            <span style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 13, fontWeight: 700, color: "#4ade80", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Strengths
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {insights.strengths.length > 0 ? insights.strengths.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ color: "#4ade80", flexShrink: 0, marginTop: 2 }}>✓</span>
                <p style={{ fontSize: 13, color: "#9898b0", lineHeight: 1.5 }}>{s}</p>
              </div>
            )) : (
              <p style={{ fontSize: 13, color: "#555570" }}>Solve more problems to identify strengths.</p>
            )}
          </div>
        </div>

        {/* Weaknesses */}
        <div style={{ padding: 24, borderRadius: 16, background: "#111118", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 16 }}>🎯</span>
            <span style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 13, fontWeight: 700, color: "#fb7185", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Focus areas
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {insights.weaknesses.length > 0 ? insights.weaknesses.map((w, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ color: "#fb7185", flexShrink: 0, marginTop: 2 }}>→</span>
                <p style={{ fontSize: 13, color: "#9898b0", lineHeight: 1.5 }}>{w}</p>
              </div>
            )) : (
              <p style={{ fontSize: 13, color: "#555570" }}>No weaknesses identified yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {insights.recommendations?.length > 0 && (
        <div style={{ padding: 24, borderRadius: 16, background: "#111118", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <span style={{ fontSize: 16 }}>📋</span>
            <span style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Practice recommendations
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {insights.recommendations.map((rec, i) => {
              const cfg = PRIORITY_CONFIG[rec.priority];
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 14,
                  padding: "14px 16px", borderRadius: 10,
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
                }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, fontWeight: 800, color: "#555570" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                      background: cfg.bg, color: cfg.color, whiteSpace: "nowrap",
                    }}>
                      {cfg.label.split(" ")[0]}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                      {rec.topic}
                    </p>
                    <p style={{ fontSize: 13, color: "#9898b0", lineHeight: 1.5 }}>{rec.reason}</p>
                  </div>
                  <Link href={`/problems?tags=${encodeURIComponent(rec.topic)}`} style={{
                    padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                    background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                    color: "#818cf8", textDecoration: "none", flexShrink: 0, whiteSpace: "nowrap",
                  }}>
                    Practice →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Next steps */}
      <div style={{
        padding: 24, borderRadius: 16,
        background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.15)",
        display: "flex", alignItems: "flex-start", gap: 14,
      }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>🚀</span>
        <div>
          <p style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 13, fontWeight: 700, color: "#00ff88", marginBottom: 6 }}>
            Your next step
          </p>
          <p style={{ fontSize: 14, color: "#c8c8d8", lineHeight: 1.6 }}>{insights.nextSteps}</p>
        </div>
      </div>
    </div>
  );
}