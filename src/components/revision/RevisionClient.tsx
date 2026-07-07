"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { RevisionItem } from "@/types/progress";

interface RevisionClientProps {
  dueItems: RevisionItem[];
}

type SessionState = "intro" | "problem" | "rating" | "complete";

const QUALITY_OPTIONS = [
  { value: 0, label: "Blackout",    desc: "Complete blank",          color: "#fb7185", bg: "rgba(251,113,133,0.1)"  },
  { value: 2, label: "Hard",        desc: "Barely remembered",       color: "#f97316", bg: "rgba(249,115,22,0.1)"   },
  { value: 3, label: "Good",        desc: "Recalled with effort",    color: "#f59e0b", bg: "rgba(245,158,11,0.1)"   },
  { value: 4, label: "Easy",        desc: "Minor hesitation",        color: "#4ade80", bg: "rgba(74,222,128,0.1)"   },
  { value: 5, label: "Perfect",     desc: "Instant recall",          color: "#00ff88", bg: "rgba(0,255,136,0.1)"    },
];

function Timer({ seconds }: { seconds: number }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isLow = seconds < 60;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "6px 14px", borderRadius: 8,
      background: isLow ? "rgba(251,113,133,0.1)" : "rgba(255,255,255,0.05)",
      border: `1px solid ${isLow ? "rgba(251,113,133,0.3)" : "rgba(255,255,255,0.08)"}`,
    }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={isLow ? "#fb7185" : "#9898b0"} strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 14, fontWeight: 700, color: isLow ? "#fb7185" : "#f1f1f5" }}>
        {mins}:{secs.toString().padStart(2, "0")}
      </span>
    </div>
  );
}

export function RevisionClient({ dueItems }: RevisionClientProps) {
  const [state,       setState]       = useState<SessionState>("intro");
  const [index,       setIndex]       = useState(0);
  const [seconds,     setSeconds]     = useState(300); // 5 min per problem
  const [timerActive, setTimerActive] = useState(false);
  const [results,     setResults]     = useState<{ slug: string; quality: number }[]>([]);
  const [submitting,  setSubmitting]  = useState(false);

  const currentItem = dueItems[index];
  const totalItems  = dueItems.length;
  const progress    = (index / totalItems) * 100;

  // Timer countdown
  useEffect(() => {
    if (!timerActive) return;
    const t = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(t); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [timerActive]);

  const startSession = () => {
    setState("problem");
    setTimerActive(true);
    setSeconds(300);
  };

  const showRating = () => {
    setTimerActive(false);
    setState("rating");
  };

  const submitRating = useCallback(async (quality: number) => {
    setSubmitting(true);
    const newResults = [...results, { slug: currentItem.slug, quality }];
    setResults(newResults);

    try {
      await fetch("/api/revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: currentItem.slug, quality }),
      });
    } catch (err) {
      console.error("Failed to record revision:", err);
    }

    setSubmitting(false);

    if (index + 1 >= totalItems) {
      setState("complete");
    } else {
      setIndex(i => i + 1);
      setState("problem");
      setTimerActive(true);
      setSeconds(300);
    }
  }, [results, currentItem, index, totalItems]);

  // ── Intro ──────────────────────────────────────────────────────────────────
  if (state === "intro") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{
          padding: "32px", borderRadius: 20,
          background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)",
        }}>
          <h2 style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
            {totalItems} problem{totalItems !== 1 ? "s" : ""} due today
          </h2>
          <p style={{ fontSize: 14, color: "#9898b0", marginBottom: 24, lineHeight: 1.6 }}>
            For each problem, you'll have 5 minutes to solve it without hints. After the timer, rate your recall. The better you do, the longer until it comes back.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
            {dueItems.map(item => {
              const diffColor = { Easy: "#34d399", Medium: "#fbbf24", Hard: "#fb7185" }[item.difficulty] || "#818cf8";
              return (
                <span key={item.slug} style={{
                  fontSize: 12, padding: "4px 12px", borderRadius: 8,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  color: "#9898b0",
                }}>
                  <span style={{ color: diffColor }}>{item.difficulty[0]}</span> · {item.title}
                </span>
              );
            })}
          </div>
          <button onClick={startSession} style={{
            padding: "12px 32px", borderRadius: 12, fontSize: 15, fontWeight: 700,
            background: "#6366f1", color: "#fff", border: "none", cursor: "pointer",
            boxShadow: "0 0 24px rgba(99,102,241,0.4)", fontFamily: "'Cabinet Grotesk',sans-serif",
          }}>
            Start revision session →
          </button>
        </div>
      </div>
    );
  }

  // ── Problem ────────────────────────────────────────────────────────────────
  if (state === "problem") {
    const diffColor = { Easy: "#34d399", Medium: "#fbbf24", Hard: "#fb7185" }[currentItem.difficulty] || "#818cf8";
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Progress + timer bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#555570" }}>{index + 1} / {totalItems}</span>
            <div style={{ width: 120, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)" }}>
              <div style={{ height: "100%", background: "#6366f1", borderRadius: 2, width: `${progress}%`, transition: "width 0.3s" }} />
            </div>
          </div>
          <Timer seconds={seconds} />
        </div>

        {/* Problem card */}
        <div style={{ padding: 32, borderRadius: 20, background: "#111118", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 6, color: diffColor, background: `${diffColor}15` }}>
              {currentItem.difficulty}
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              {currentItem.topics.slice(0, 3).map(t => (
                <span key={t} style={{ fontSize: 11, color: "#818cf8", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 5, padding: "2px 8px" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <h2 style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 16 }}>
            {currentItem.title}
          </h2>

          <p style={{ fontSize: 14, color: "#9898b0", lineHeight: 1.6, marginBottom: 28 }}>
            Attempt to solve this from memory. You've solved it before — try to recall the approach without looking it up.
          </p>

          <div style={{ display: "flex", gap: 12 }}>
            <Link href={`/problems/${currentItem.slug}/solve`} target="_blank" style={{
              padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700,
              background: "#6366f1", color: "#fff", textDecoration: "none",
              boxShadow: "0 0 16px rgba(99,102,241,0.3)",
            }}>
              Open editor ↗
            </Link>
            <button onClick={showRating} style={{
              padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#9898b0", cursor: "pointer", fontFamily: "'Cabinet Grotesk',sans-serif",
            }}>
              I'm done → rate my recall
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Rating ─────────────────────────────────────────────────────────────────
  if (state === "rating") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ padding: 32, borderRadius: 20, background: "#111118", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
            How well did you recall it?
          </h2>
          <p style={{ fontSize: 14, color: "#9898b0", marginBottom: 28 }}>
            Be honest — this determines when <strong style={{ color: "#fff" }}>{currentItem.title}</strong> comes back for review.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {QUALITY_OPTIONS.map(q => (
              <button
                key={q.value}
                onClick={() => !submitting && submitRating(q.value)}
                disabled={submitting}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 20px", borderRadius: 12, cursor: submitting ? "wait" : "pointer",
                  background: q.bg, border: `1px solid ${q.color}30`,
                  transition: "all 0.15s", fontFamily: "'Cabinet Grotesk',sans-serif",
                  opacity: submitting ? 0.6 : 1,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${q.color}60`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${q.color}30`; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, fontWeight: 800, color: q.color, width: 16, textAlign: "center" }}>
                    {q.value}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{q.label}</span>
                </div>
                <span style={{ fontSize: 13, color: "#9898b0" }}>{q.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Complete ───────────────────────────────────────────────────────────────
  if (state === "complete") {
    const avgQuality = results.reduce((s, r) => s + r.quality, 0) / results.length;
    const goodCount  = results.filter(r => r.quality >= 3).length;

    return (
      <div style={{
        padding: 40, borderRadius: 20, textAlign: "center",
        background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.2)",
      }}>
        <p style={{ fontSize: 48, marginBottom: 16 }}>🎉</p>
        <h2 style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
          Session complete!
        </h2>
        <p style={{ fontSize: 15, color: "#9898b0", marginBottom: 28 }}>
          You reviewed {totalItems} problem{totalItems !== 1 ? "s" : ""}. {goodCount}/{totalItems} recalled successfully.
        </p>

        {/* Results summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, maxWidth: 400, margin: "0 auto 32px" }}>
          <div style={{ padding: "14px", borderRadius: 12, background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.15)" }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#00ff88", fontFamily: "'Cabinet Grotesk',sans-serif" }}>{goodCount}</p>
            <p style={{ fontSize: 11, color: "#555570" }}>Recalled</p>
          </div>
          <div style={{ padding: "14px", borderRadius: 12, background: "rgba(251,113,133,0.08)", border: "1px solid rgba(251,113,133,0.15)" }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#fb7185", fontFamily: "'Cabinet Grotesk',sans-serif" }}>{totalItems - goodCount}</p>
            <p style={{ fontSize: 11, color: "#555570" }}>Struggled</p>
          </div>
          <div style={{ padding: "14px", borderRadius: 12, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#818cf8", fontFamily: "'Cabinet Grotesk',sans-serif" }}>
              {avgQuality.toFixed(1)}
            </p>
            <p style={{ fontSize: 11, color: "#555570" }}>Avg recall</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link href="/dashboard" style={{
            padding: "10px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700,
            background: "#6366f1", color: "#fff", textDecoration: "none",
            boxShadow: "0 0 16px rgba(99,102,241,0.3)",
          }}>
            Back to dashboard
          </Link>
          <Link href="/problems" style={{
            padding: "10px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#9898b0", textDecoration: "none",
          }}>
            Solve new problems
          </Link>
        </div>
      </div>
    );
  }

  return null;
}