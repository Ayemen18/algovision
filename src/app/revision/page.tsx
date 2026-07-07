import { currentUser } from "@clerk/nextjs/server";
import { redirect }    from "next/navigation";
import Link            from "next/link";
import { getDb }       from "@/lib/mongodb";
import { Navbar }      from "@/components/layout/Navbar";
import { RevisionClient } from "@/components/revision/RevisionClient";
import type { RevisionItem } from "@/types/progress";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Revision Mode" };

export default async function RevisionPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  let due: RevisionItem[]      = [];
  let upcoming: RevisionItem[] = [];

  try {
    const db = await getDb();
    due = await db
      .collection<RevisionItem>("revisions")
      .find({ userId: user.id, nextReviewAt: { $lte: new Date() } })
      .sort({ nextReviewAt: 1 })
      .limit(20)
      .toArray();

    upcoming = await db
      .collection<RevisionItem>("revisions")
      .find({ userId: user.id, nextReviewAt: { $gt: new Date() } })
      .sort({ nextReviewAt: 1 })
      .limit(5)
      .toArray();
  } catch (err) {
    console.warn("MongoDB not connected:", err);
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", background: "#0a0a0f", paddingTop: 80 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>

          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6366f1", marginBottom: 10 }}>
              Spaced Repetition
            </p>
            <h1 style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: "clamp(1.8rem,4vw,2.5rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 10 }}>
              Revision Mode
            </h1>
            <p style={{ fontSize: 15, color: "#9898b0" }}>
              Problems resurface when you're about to forget them — the optimal time to reinforce long-term memory.
            </p>
          </div>

          {due.length === 0 ? (
            /* Empty state */
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{
                padding: 40, borderRadius: 20, textAlign: "center",
                background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.15)",
              }}>
                <p style={{ fontSize: 48, marginBottom: 16 }}>✓</p>
                <h2 style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
                  All caught up!
                </h2>
                <p style={{ fontSize: 14, color: "#9898b0", maxWidth: 400, margin: "0 auto 24px" }}>
                  No problems due for review right now. Solve more problems to grow your revision schedule.
                </p>
                <Link href="/problems" style={{
                  display: "inline-block", padding: "10px 24px", borderRadius: 10,
                  background: "#6366f1", color: "#fff", textDecoration: "none",
                  fontSize: 14, fontWeight: 700, boxShadow: "0 0 20px rgba(99,102,241,0.35)",
                }}>
                  Browse problems
                </Link>
              </div>

              {upcoming.length > 0 && (
                <div style={{ padding: 24, borderRadius: 16, background: "#111118", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Coming up next</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {upcoming.map(item => {
                      const daysUntil = Math.ceil((new Date(item.nextReviewAt).getTime() - Date.now()) / 86400000);
                      const diffColor = { Easy: "#34d399", Medium: "#fbbf24", Hard: "#fb7185" }[item.difficulty] || "#818cf8";
                      return (
                        <div key={item.slug} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 8, background: "rgba(255,255,255,0.02)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 14, fontWeight: 600, color: "#f1f1f5" }}>{item.title}</span>
                            <span style={{ fontSize: 11, color: diffColor }}>{item.difficulty}</span>
                          </div>
                          <span style={{ fontSize: 12, color: "#555570" }}>in {daysUntil}d</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <RevisionClient dueItems={due} />
          )}
        </div>
      </main>
    </>
  );
}