import { Suspense }         from "react";
import { ProblemList }     from "@/components/problems/ProblemList";
import { ProblemListSkeleton } from "@/components/problems/ProblemListSkeleton";
import { Navbar }          from "@/components/layout/Navbar";
import type { Metadata }   from "next";

export const metadata: Metadata = {
  title: "Problems",
  description: "Browse 150+ LeetCode problems with step-by-step algorithm visualizations.",
};

export default function ProblemsPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", background: "#0a0a0f", paddingTop: 80 }}>

        {/* Header */}
        <div style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(10,10,15,0.6)",
          backdropFilter: "blur(20px)",
        }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6366f1", marginBottom: 8 }}>
                  Problem Library
                </p>
                <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 8 }}>
                  Browse Problems
                </h1>
                <p style={{ fontSize: 15, color: "#9898b0" }}>
                  Search, filter, and visualize any LeetCode problem step-by-step.
                </p>
              </div>

              {/* Stats pills */}
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { label: "Easy",   color: "#34d399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.2)"  },
                  { label: "Medium", color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.2)"  },
                  { label: "Hard",   color: "#fb7185", bg: "rgba(251,113,133,0.1)", border: "rgba(251,113,133,0.2)" },
                ].map(d => (
                  <div key={d.label} style={{
                    padding: "6px 14px", borderRadius: 8,
                    background: d.bg, border: `1px solid ${d.border}`,
                    fontSize: 13, fontWeight: 600, color: d.color,
                  }}>
                    {d.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Problem list */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
          <Suspense fallback={<ProblemListSkeleton />}>
            <ProblemList />
          </Suspense>
        </div>
      </main>
    </>
  );
}