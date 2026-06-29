import Link from "next/link";
import type { LCProblemListItem } from "@/lib/leetcode";

const DIFFICULTY_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  Easy:   { color: "#34d399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.2)"  },
  Medium: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.2)"  },
  Hard:   { color: "#fb7185", bg: "rgba(251,113,133,0.1)", border: "rgba(251,113,133,0.2)" },
};

interface ProblemCardProps {
  problem: LCProblemListItem;
  index:   number;
}

export function ProblemCard({ problem, index }: ProblemCardProps) {
  const diff   = DIFFICULTY_STYLE[problem.difficulty];
  const acRate = Math.round(problem.acRate);

  return (
    <Link href={`/problems/${problem.titleSlug}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "48px 1fr auto",
          alignItems: "center",
          gap: 16,
          padding: "16px 20px",
          borderRadius: 12,
          background: "#111118",
          border: "1px solid rgba(255,255,255,0.06)",
          transition: "all 0.15s",
          cursor: "pointer",
          animationDelay: `${Math.min(index * 30, 300)}ms`,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
          (e.currentTarget as HTMLElement).style.background  = "#1a1a24";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
          (e.currentTarget as HTMLElement).style.background  = "#111118";
        }}
      >
        {/* Question number */}
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 13, color: "#555570",
          textAlign: "right",
        }}>
          {problem.frontendQuestionId}
        </span>

        {/* Title + tags */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontSize: 15, fontWeight: 600, color: "#f1f1f5",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {problem.title}
            </span>
            {problem.paidOnly && (
              <span style={{ fontSize: 10, color: "#f59e0b", flexShrink: 0 }}>🔒</span>
            )}
          </div>
          {/* Topic tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {problem.topicTags.slice(0, 3).map(tag => (
              <span key={tag.slug} style={{
                fontSize: 11, color: "#555570",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 4, padding: "2px 6px",
              }}>
                {tag.name}
              </span>
            ))}
            {problem.topicTags.length > 3 && (
              <span style={{ fontSize: 11, color: "#555570" }}>
                +{problem.topicTags.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Right: difficulty + acceptance */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
          <span style={{
            fontSize: 12, fontWeight: 600,
            color:        diff.color,
            background:   diff.bg,
            border:       `1px solid ${diff.border}`,
            borderRadius: 6, padding: "2px 10px",
          }}>
            {problem.difficulty}
          </span>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11, color: "#555570",
          }}>
            {acRate}%
          </span>
        </div>
      </div>
    </Link>
  );
}