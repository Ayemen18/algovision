"use client";

import { useState, useEffect, useRef } from "react";
import type { LCProblemDetail } from "@/lib/leetcode";

interface ExplanationPanelProps {
  problem: LCProblemDetail;
}

type Status = "idle" | "loading" | "streaming" | "done" | "error";

const SECTION_LABELS: Record<string, { emoji: string; color: string }> = {
  "INTUITION":         { emoji: "💡", color: "#818cf8" },
  "KEY OBSERVATIONS":  { emoji: "🔍", color: "#00d4ff" },
  "APPROACH DIRECTION":{ emoji: "🧭", color: "#00ff88" },
  "COMMON MISTAKES":   { emoji: "⚠️",  color: "#f59e0b" },
};

function formatExplanation(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // Section headers like "1. INTUITION:" or "INTUITION:"
    const headerMatch = line.match(/^(?:\d+\.\s+)?([A-Z\s]+):\s*$/);
    if (headerMatch) {
      const label = headerMatch[1].trim();
      const cfg   = SECTION_LABELS[label] || { emoji: "📌", color: "#818cf8" };
      return (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: i > 0 ? 20 : 0, marginBottom: 8 }}>
          <span style={{ fontSize: 16 }}>{cfg.emoji}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: cfg.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {label}
          </span>
        </div>
      );
    }
    // Numbered list items
    const numMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (numMatch) {
      return (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#6366f1", fontWeight: 700, flexShrink: 0, marginTop: 2 }}>
            {numMatch[1]}.
          </span>
          <span style={{ fontSize: 14, color: "#9898b0", lineHeight: 1.65 }}>{numMatch[2]}</span>
        </div>
      );
    }
    // Empty lines
    if (line.trim() === "") return <div key={i} style={{ height: 8 }} />;
    // Regular text
    return (
      <p key={i} style={{ fontSize: 14, color: "#9898b0", lineHeight: 1.65, marginBottom: 6 }}>
        {line}
      </p>
    );
  });
}

export function ExplanationPanel({ problem }: ExplanationPanelProps) {
  const [status,      setStatus]      = useState<Status>("idle");
  const [explanation, setExplanation] = useState("");
  const [error,       setError]       = useState("");
  const bottomRef                     = useRef<HTMLDivElement>(null);

  const fetchExplanation = async () => {
    setStatus("loading");
    setExplanation("");
    setError("");

    try {
      const res = await fetch("/api/explain", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:      problem.title,
          difficulty: problem.difficulty,
          topics:     problem.topicTags.map(t => t.name),
          content:    problem.content,
        }),
      });

      if (!res.ok) throw new Error("API request failed");
      if (!res.body) throw new Error("No response body");

      setStatus("streaming");

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setExplanation(prev => prev + decoder.decode(value, { stream: true }));
      }

      setStatus("done");
    } catch (err) {
      setError("Failed to generate explanation. Check your OpenAI API key.");
      setStatus("error");
    }
  };

  // Auto-scroll as text streams in
  useEffect(() => {
    if (status === "streaming") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [explanation, status]);

  const diffColors: Record<string, string> = {
    Easy: "#34d399", Medium: "#fbbf24", Hard: "#fb7185",
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <span style={{ fontSize: 16 }}>🤖</span>
            <span style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 14, fontWeight: 700, color: "#fff" }}>
              AI Explanation
            </span>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6,
              color: diffColors[problem.difficulty] || "#818cf8",
              background: "rgba(255,255,255,0.06)",
            }}>
              {problem.difficulty}
            </span>
          </div>
          {status === "streaming" && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", animation: "pulse 1s ease-in-out infinite" }} />
              <span style={{ fontSize: 11, color: "#00ff88" }}>Generating...</span>
              <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }`}</style>
            </div>
          )}
        </div>
        <p style={{ fontSize: 12, color: "#555570", marginTop: 4, fontFamily: "'Cabinet Grotesk',sans-serif" }}>
          {problem.title} · {problem.topicTags.slice(0, 2).map(t => t.name).join(", ")}
        </p>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>

        {/* Idle state */}
        {status === "idle" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
              🧠
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
                Understand before you code
              </p>
              <p style={{ fontSize: 13, color: "#555570", lineHeight: 1.6, maxWidth: 260 }}>
                Get the intuition, key observations, and approach direction — without spoilers.
              </p>
            </div>
            <button onClick={fetchExplanation} style={{
              padding: "10px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700,
              background: "#6366f1", color: "#fff", border: "none", cursor: "pointer",
              boxShadow: "0 0 20px rgba(99,102,241,0.35)",
              fontFamily: "'Cabinet Grotesk',sans-serif",
            }}>
              Explain this problem
            </button>
          </div>
        )}

        {/* Loading */}
        {status === "loading" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "8px 0" }}>
            {[80, 65, 90, 55, 75, 45].map((w, i) => (
              <div key={i} style={{ height: 14, width: `${w}%`, borderRadius: 4, background: "rgba(255,255,255,0.06)" }} />
            ))}
          </div>
        )}

        {/* Streaming / Done */}
        {(status === "streaming" || status === "done") && (
          <div>
            {formatExplanation(explanation)}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div style={{ padding: 16, borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <p style={{ fontSize: 14, color: "#fb7185", fontWeight: 600, marginBottom: 6 }}>Error</p>
            <p style={{ fontSize: 13, color: "#9898b0" }}>{error}</p>
            <button onClick={fetchExplanation} style={{ marginTop: 12, padding: "6px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fb7185", cursor: "pointer" }}>
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Footer — Regenerate button after done */}
      {(status === "done" || status === "error") && (
        <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <button onClick={fetchExplanation} style={{
            width: "100%", padding: "8px", borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#9898b0", cursor: "pointer",
            fontFamily: "'Cabinet Grotesk',sans-serif",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { (e.currentTarget.style.color = "#fff"); (e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)"); }}
          onMouseLeave={e => { (e.currentTarget.style.color = "#9898b0"); (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"); }}
          >
            ↺ Regenerate explanation
          </button>
        </div>
      )}
    </div>
  );
}