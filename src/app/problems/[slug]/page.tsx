import { notFound }       from "next/navigation";
import Link               from "next/link";
import { fetchProblemDetail } from "@/lib/leetcode";
import { Navbar }         from "@/components/layout/Navbar";
import type { Metadata }  from "next";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  try {
    const problem = await fetchProblemDetail(slug);
    return {
      title:       problem.title,
      description: `Visualize ${problem.title} step-by-step with AI explanations.`,
    };
  } catch {
    return { title: "Problem" };
  }
}

// ─── Difficulty styles ─────────────────────────────────────────────────────────

const DIFF: Record<string, { color: string; bg: string; border: string }> = {
  Easy:   { color: "#34d399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.25)"  },
  Medium: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.25)"  },
  Hard:   { color: "#fb7185", bg: "rgba(251,113,133,0.1)", border: "rgba(251,113,133,0.25)" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProblemDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let problem;
  try {
    problem = await fetchProblemDetail(slug);
  } catch {
    notFound();
  }

  if (!problem) notFound();

  const diff  = DIFF[problem.difficulty] || DIFF.Medium;
  const stats = problem.stats ? JSON.parse(problem.stats) : {};

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", background: "#0a0a0f", paddingTop: 80 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 13, color: "#555570" }}>
            <Link href="/problems" style={{ color: "#9898b0", textDecoration: "none" }}>
              Problems
            </Link>
            <span>/</span>
            <span style={{ color: "#f1f1f5" }}>{problem.title}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>

            {/* ── Left: problem content ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Title row */}
              <div style={{ padding: 28, borderRadius: 16, background: "#111118", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: "#555570" }}>
                    #{problem.questionFrontendId}
                  </span>
                  <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "clamp(1.4rem,3vw,1.9rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", flex: 1 }}>
                    {problem.title}
                  </h1>
                  <span style={{
                    padding: "4px 14px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                    color: diff.color, background: diff.bg, border: `1px solid ${diff.border}`,
                    flexShrink: 0,
                  }}>
                    {problem.difficulty}
                  </span>
                </div>

                {/* Topic tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                  {problem.topicTags.map(tag => (
                    <span key={tag.slug} style={{
                      fontSize: 12, color: "#818cf8",
                      background: "rgba(99,102,241,0.1)",
                      border: "1px solid rgba(99,102,241,0.2)",
                      borderRadius: 6, padding: "3px 10px",
                    }}>
                      {tag.name}
                    </span>
                  ))}
                </div>

                {/* Problem content (HTML from LeetCode) */}
                <div
                  className="problem-content"
                  dangerouslySetInnerHTML={{ __html: problem.content }}
                  style={{ color: "#9898b0", fontSize: 15, lineHeight: 1.75 }}
                />
              </div>

              {/* Hints */}
              {problem.hints && problem.hints.length > 0 && (
                <div style={{ padding: 24, borderRadius: 16, background: "#111118", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 16 }}>
                    💡 Hints
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {problem.hints.map((hint, i) => (
                      <details key={i} style={{ borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
                        <summary style={{ padding: "10px 16px", cursor: "pointer", fontSize: 14, color: "#9898b0", background: "rgba(255,255,255,0.03)", listStyle: "none", display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ color: "#6366f1" }}>▶</span> Hint {i + 1}
                        </summary>
                        <div style={{ padding: "12px 16px", fontSize: 14, color: "#f1f1f5", lineHeight: 1.6 }}
                          dangerouslySetInnerHTML={{ __html: hint }}
                        />
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: sidebar ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 100 }}>

              {/* Visualize CTA */}
              <div style={{
                padding: 24, borderRadius: 16,
                background: "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.2)",
              }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>▶️</div>
                <h3 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
                  Visualize this problem
                </h3>
                <p style={{ fontSize: 13, color: "#9898b0", lineHeight: 1.6, marginBottom: 16 }}>
                  See the algorithm execute step-by-step with live variable tracking and AI explanations.
                </p>
                <Link href={`/visualize/${slug}`} style={{
                  display: "block", textAlign: "center",
                  padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                  background: "#6366f1", color: "#fff", textDecoration: "none",
                  boxShadow: "0 0 20px rgba(99,102,241,0.35)",
                }}>
                  Open Visualizer →
                </Link>
              </div>

              {/* Stats */}
              <div style={{ padding: 24, borderRadius: 16, background: "#111118", border: "1px solid rgba(255,255,255,0.06)" }}>
                <h3 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>
                  Statistics
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { label: "Acceptance",    value: stats.acRate        || "—" },
                    { label: "Submissions",   value: stats.totalSubmissionRaw ? Number(stats.totalSubmissionRaw).toLocaleString() : "—" },
                    { label: "Accepted",      value: stats.totalAcceptedRaw   ? Number(stats.totalAcceptedRaw).toLocaleString()   : "—" },
                  ].map(s => (
                    <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: "#555570" }}>{s.label}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#f1f1f5", fontWeight: 600 }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solve button */}
              <Link href={`/problems/${slug}/solve`} style={{
                display: "block", textAlign: "center",
                padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#f1f1f5", textDecoration: "none",
                transition: "all 0.15s",
              }}>
                ✏️ Write your solution
              </Link>

              {/* Back link */}
              <Link href="/problems" style={{ fontSize: 13, color: "#555570", textDecoration: "none", textAlign: "center" }}>
                ← Back to problems
              </Link>
            </div>
          </div>
        </div>

        {/* Problem content styles */}
        <style>{`
          .problem-content p   { margin-bottom: 12px; }
          .problem-content pre { background: #1a1a24; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 16px; font-family: 'DM Mono', monospace; font-size: 13px; color: #c7d7fe; overflow-x: auto; margin: 12px 0; }
          .problem-content code { font-family: 'DM Mono', monospace; font-size: 13px; background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.2); border-radius: 4px; padding: 2px 6px; color: #818cf8; }
          .problem-content pre code { background: none; border: none; padding: 0; color: #c7d7fe; }
          .problem-content strong { color: #f1f1f5; font-weight: 700; }
          .problem-content ul, .problem-content ol { padding-left: 24px; margin-bottom: 12px; }
          .problem-content li { margin-bottom: 6px; color: #9898b0; }
          .problem-content img { max-width: 100%; border-radius: 8px; }
        `}</style>
      </main>
    </>
  );
}