import { currentUser } from "@clerk/nextjs/server";
import { redirect }    from "next/navigation";
import Link            from "next/link";
import { getDb }       from "@/lib/mongodb";
import { Navbar }      from "@/components/layout/Navbar";
import type { ProblemAttempt, RevisionItem, UserStats } from "@/types/progress";
import type { Metadata } from "next";
import { AttemptRow, RevisionCard, QuickActionLink } from "./ClientComponents";

export const metadata: Metadata = { title: "Dashboard" };

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent, emoji }: {
  label: string; value: string | number; sub: string; accent: string; emoji: string;
}) {
  return (
    <div style={{
      padding: 24, borderRadius: 16,
      background: "#111118", border: "1px solid rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column", gap: 4,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 16, right: 16, fontSize: 20, opacity: 0.3 }}>{emoji}</div>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555570" }}>{label}</p>
      <p style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 36, fontWeight: 800, color: accent, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
        {value}
      </p>
      <p style={{ fontSize: 12, color: "#555570" }}>{sub}</p>
    </div>
  );
}

// ─── Difficulty bar ───────────────────────────────────────────────────────────

function DiffBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "#9898b0" }}>{label}</span>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, fontWeight: 700, color }}>{count}</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)" }}>
        <div style={{ height: "100%", borderRadius: 3, background: color, width: `${pct}%`, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}


// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const firstName = user.firstName || user.emailAddresses[0]?.emailAddress?.split("@")[0] || "there";
  const avatarUrl = user.imageUrl;

  // Fetch data from MongoDB
  let attempts:    ProblemAttempt[] = [];
  let dueRevisions: RevisionItem[]  = [];
  let stats: UserStats = {
    totalSolved: 0, totalAttempted: 0, streak: 0,
    lastActiveDate: "", byDifficulty: { easy: 0, medium: 0, hard: 0 },
    recentTopics: [], weakTopics: [], dueForReview: 0,
  };

  try {
    const db = await getDb();

    attempts = await db
      .collection<ProblemAttempt>("attempts")
      .find({ userId: user.id })
      .sort({ lastAttemptAt: -1 })
      .limit(8)
      .toArray();

    dueRevisions = await db
      .collection<RevisionItem>("revisions")
      .find({ userId: user.id, nextReviewAt: { $lte: new Date() } })
      .sort({ nextReviewAt: 1 })
      .limit(5)
      .toArray();

    const allAttempts = await db
      .collection<ProblemAttempt>("attempts")
      .find({ userId: user.id })
      .toArray();

    const solved   = allAttempts.filter(a => a.status === "solved");
    const today    = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const solvedDates = solved.map(a => a.solvedAt?.toString().slice(0, 10) || "");

    const dueCount = await db
      .collection<RevisionItem>("revisions")
      .countDocuments({ userId: user.id, nextReviewAt: { $lte: new Date() } });

    const incorrectTopics: Record<string, number> = {};
    for (const a of allAttempts.filter(x => x.analysisStatus === "incorrect")) {
      for (const t of a.topics || []) {
        incorrectTopics[t] = (incorrectTopics[t] || 0) + 1;
      }
    }

    stats = {
      totalSolved:    solved.length,
      totalAttempted: allAttempts.length,
      streak:         solvedDates.includes(today) ? 1 : 0,
      lastActiveDate: today,
      byDifficulty: {
        easy:   solved.filter(a => a.difficulty === "Easy").length,
        medium: solved.filter(a => a.difficulty === "Medium").length,
        hard:   solved.filter(a => a.difficulty === "Hard").length,
      },
      recentTopics: [...new Set(attempts.flatMap(a => a.topics || []))].slice(0, 5),
      weakTopics: Object.entries(incorrectTopics).sort(([,a],[,b]) => b-a).slice(0,3).map(([t]) => t),
      dueForReview: dueCount,
    };
  } catch (err) {
    // DB not configured yet — show empty state
    console.warn("MongoDB not connected:", err);
  }

  const totalSolved = stats.totalSolved;

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", background: "#0a0a0f", paddingTop: 80 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>

          {/* ── Welcome header ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {avatarUrl
                ? <img src={avatarUrl} alt={firstName} style={{ width: 52, height: 52, borderRadius: "50%", border: "2px solid rgba(99,102,241,0.4)" }} />
                : <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(99,102,241,0.2)", border: "2px solid rgba(99,102,241,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#818cf8" }}>
                    {firstName[0].toUpperCase()}
                  </div>
              }
              <div>
                <h1 style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>
                  Welcome back, {firstName}
                </h1>
                <p style={{ fontSize: 13, color: "#555570" }}>
                  {totalSolved > 0
                    ? `${totalSolved} problem${totalSolved !== 1 ? "s" : ""} solved · keep going`
                    : "Ready to start your DSA journey?"}
                </p>
              </div>
            </div>
            <Link href="/problems" style={{
              padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 700,
              background: "#6366f1", color: "#fff", textDecoration: "none",
              boxShadow: "0 0 20px rgba(99,102,241,0.35)",
            }}>
              Solve a problem →
            </Link>
          </div>

          {/* ── Stat cards ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 40 }}>
            <StatCard label="Problems solved"  value={stats.totalSolved}    sub="total accepted"        accent="#6366f1" emoji="✓" />
            <StatCard label="Attempted"        value={stats.totalAttempted} sub="problems tried"        accent="#818cf8" emoji="📝" />
            <StatCard label="Streak"           value={`${stats.streak}d`}   sub="days active"           accent="#f59e0b" emoji="🔥" />
            <StatCard label="Due for review"   value={stats.dueForReview}   sub="spaced repetition"     accent="#00ff88" emoji="🔁" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>

            {/* ── Left column ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Difficulty breakdown */}
              <div style={{ padding: 24, borderRadius: 16, background: "#111118", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 20, fontFamily: "'Cabinet Grotesk',sans-serif" }}>
                  Progress by difficulty
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <DiffBar label="Easy"   count={stats.byDifficulty.easy}   total={totalSolved || 1} color="#34d399" />
                  <DiffBar label="Medium" count={stats.byDifficulty.medium} total={totalSolved || 1} color="#fbbf24" />
                  <DiffBar label="Hard"   count={stats.byDifficulty.hard}   total={totalSolved || 1} color="#fb7185" />
                </div>
              </div>

              {/* Weak topics */}
              <div style={{ padding: 24, borderRadius: 16, background: "#111118", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "'Cabinet Grotesk',sans-serif" }}>
                    Weak topics
                  </p>
                  <Link href="/insights" style={{ fontSize: 12, color: "#6366f1", textDecoration: "none" }}>View insights →</Link>
                </div>
                {stats.weakTopics.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {stats.weakTopics.map(t => (
                      <span key={t} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 8, background: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.2)", color: "#fb7185", fontWeight: 600 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: 13, color: "#555570" }}>Solve more problems to identify weak areas.</p>
                )}
              </div>

              {/* Quick actions */}
              <div style={{ padding: 24, borderRadius: 16, background: "#111118", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 16, fontFamily: "'Cabinet Grotesk',sans-serif" }}>
                  Quick actions
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { emoji: "🔍", label: "Browse problems", href: "/problems", color: "#6366f1" },
                    { emoji: "▶️", label: "Try a visualization", href: "/visualize", color: "#00d4ff" },
                    { emoji: "🔁", label: "Start revision session", href: "/revision", color: "#00ff88" },
                    { emoji: "💡", label: "View learning insights", href: "/insights", color: "#f59e0b" },
                  ].map(a => (
                    <QuickActionLink key={a.href} href={a.href} emoji={a.emoji} label={a.label} color={a.color} />
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right column ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Due for revision */}
              <div style={{ padding: 24, borderRadius: 16, background: "#111118", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "'Cabinet Grotesk',sans-serif" }}>
                    Due for review
                  </p>
                  {dueRevisions.length > 0 && (
                    <Link href="/revision" style={{
                      padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 700,
                      background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.2)",
                      color: "#00ff88", textDecoration: "none",
                    }}>
                      Start session →
                    </Link>
                  )}
                </div>
                {dueRevisions.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {dueRevisions.map(item => (
                      <RevisionCard key={item.slug} item={item} />
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: "24px 0", textAlign: "center" }}>
                    <p style={{ fontSize: 28, marginBottom: 8 }}>✓</p>
                    <p style={{ fontSize: 13, color: "#555570" }}>
                      {stats.totalSolved > 0
                        ? "You're all caught up! No reviews due."
                        : "Solve problems to start your revision schedule."}
                    </p>
                  </div>
                )}
              </div>

              {/* Recent activity */}
              <div style={{ padding: 24, borderRadius: 16, background: "#111118", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 16, fontFamily: "'Cabinet Grotesk',sans-serif" }}>
                  Recent activity
                </p>
                {attempts.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {attempts.slice(0, 6).map(a => (
                      <AttemptRow key={`${a.slug}-${a.lastAttemptAt}`} attempt={a} />
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: "24px 0", textAlign: "center" }}>
                    <p style={{ fontSize: 28, marginBottom: 8 }}>📝</p>
                    <p style={{ fontSize: 13, color: "#555570" }}>No activity yet.</p>
                    <Link href="/problems" style={{ fontSize: 13, color: "#6366f1", textDecoration: "none", display: "block", marginTop: 8 }}>
                      Browse problems →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}