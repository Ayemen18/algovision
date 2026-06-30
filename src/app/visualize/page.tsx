import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { CURATED_TRACES } from "@/lib/algorithms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visualizer",
  description: "Watch algorithms execute step-by-step with live variable tracking.",
};

const FLAGSHIP = [
  { slug: "two-sum",       title: "Two Sum",        difficulty: "Easy",   topic: "Hash Table" },
  { slug: "binary-search", title: "Binary Search",  difficulty: "Easy",   topic: "Binary Search" },
];

const DIFF_COLORS: Record<string, string> = { Easy: "#34d399", Medium: "#fbbf24", Hard: "#fb7185" };

export default function VisualizeLandingPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", background: "#0a0a0f", paddingTop: 80 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6366f1", marginBottom: 12 }}>
              Algorithm Visualizer
            </p>
            <h1 style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: "clamp(2rem,4vw,2.8rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 16 }}>
              Watch algorithms think
            </h1>
            <p style={{ fontSize: 16, color: "#9898b0", maxWidth: 540, margin: "0 auto", lineHeight: 1.65 }}>
              See every variable, pointer, and data structure update in real time. Pick a flagship problem below, or visualize any problem from our library.
            </p>
          </div>

          {/* Flagship problems */}
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#555570", marginBottom: 16 }}>
            ✓ Hand-crafted visualizations
          </p>
          <style dangerouslySetInnerHTML={{ __html: `
            .flagship-card {
              padding: 24px; border-radius: 16px; background: #111118;
              border: 1px solid rgba(255,255,255,0.06); transition: all 0.2s;
              cursor: pointer;
            }
            .flagship-card:hover {
              border-color: rgba(99,102,241,0.3); background: #15151f;
            }
          `}} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 48 }}>
            {FLAGSHIP.map(p => (
              <Link key={p.slug} href={`/problems/${p.slug}/visualize`} style={{ textDecoration: "none" }}>
                <div className="flagship-card">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: 24 }}>▶️</span>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, color: DIFF_COLORS[p.difficulty], background: `${DIFF_COLORS[p.difficulty]}15` }}>
                      {p.difficulty}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: 12, color: "#555570" }}>{p.topic}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* AI-powered note */}
          <div style={{
            padding: 24, borderRadius: 16,
            background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)",
            display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
          }}>
            <span style={{ fontSize: 28 }}>🤖</span>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                Want to visualize any other problem?
              </p>
              <p style={{ fontSize: 13, color: "#9898b0" }}>
                Browse our library — every problem can be visualized with AI-generated execution traces.
              </p>
            </div>
            <Link href="/problems" style={{
              padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
              background: "#6366f1", color: "#fff", textDecoration: "none",
              boxShadow: "0 0 16px rgba(99,102,241,0.3)", whiteSpace: "nowrap",
            }}>
              Browse problems →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}