"use client";

import Link from "next/link";
import type { ProblemAttempt, RevisionItem } from "@/types/progress";

// ─── Recent attempt row ───────────────────────────────────────────────────────
export function AttemptRow({ attempt }: { attempt: ProblemAttempt }) {
  const statusColor = attempt.status === "solved" ? "#00ff88" : attempt.analysisStatus === "incorrect" ? "#fb7185" : "#f59e0b";
  const statusLabel = attempt.status === "solved" ? "Solved" : attempt.analysisStatus === "incorrect" ? "Wrong" : "Attempted";
  const diffColor   = { Easy: "#34d399", Medium: "#fbbf24", Hard: "#fb7185" }[attempt.difficulty] || "#818cf8";

  return (
    <Link href={`/problems/${attempt.slug}/solve`} style={{ textDecoration: "none" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 16px", borderRadius: 10,
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
        transition: "all 0.15s", cursor: "pointer",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor, boxShadow: `0 0 6px ${statusColor}` }} />
          <span style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 14, fontWeight: 600, color: "#f1f1f5" }}>
            {attempt.title}
          </span>
          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 5, color: diffColor, background: `${diffColor}15` }}>
            {attempt.difficulty}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 11, color: "#555570", fontFamily: "'DM Mono',monospace" }}>
            {attempt.language}
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: statusColor }}>{statusLabel}</span>
        </div>
      </div>
    </Link>
  );
}

// ─── Revision card ────────────────────────────────────────────────────────────
export function RevisionCard({ item }: { item: RevisionItem }) {
  const diffColor = { Easy: "#34d399", Medium: "#fbbf24", Hard: "#fb7185" }[item.difficulty] || "#818cf8";
  const daysOverdue = Math.floor((Date.now() - new Date(item.nextReviewAt).getTime()) / 86400000);

  return (
    <Link href={`/problems/${item.slug}/solve`} style={{ textDecoration: "none" }}>
      <div style={{
        padding: "14px 16px", borderRadius: 10,
        background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)",
        transition: "all 0.15s", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.3)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.15)"; }}
      >
        <div>
          <p style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 14, fontWeight: 600, color: "#f1f1f5", marginBottom: 4 }}>
            {item.title}
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ fontSize: 11, color: diffColor }}>{item.difficulty}</span>
            <span style={{ fontSize: 11, color: "#555570" }}>rep #{item.repetitions}</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: daysOverdue > 1 ? "#fb7185" : "#f59e0b" }}>
            {daysOverdue > 0 ? `${daysOverdue}d overdue` : "Due today"}
          </p>
          <p style={{ fontSize: 10, color: "#555570", marginTop: 2 }}>→ review now</p>
        </div>
      </div>
    </Link>
  );
}

// ─── Quick Action Link ────────────────────────────────────────────────────────
export function QuickActionLink({ href, emoji, label, color }: { href: string; emoji: string; label: string; color: string }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
        borderRadius: 8, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
        transition: "all 0.15s",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}30`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.05)"; }}
      >
        <span style={{ fontSize: 16 }}>{emoji}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#9898b0" }}>{label}</span>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#3a3a50" }}>→</span>
      </div>
    </Link>
  );
}
