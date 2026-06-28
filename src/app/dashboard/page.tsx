import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

// Quick stat card component
function StatCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) {
  return (
    <div style={{
      padding: 24, borderRadius: 16,
      background: "#111118",
      border: "1px solid rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column", gap: 8,
    }}>
      <p style={{ fontSize: 12, color: "#555570", letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</p>
      <p style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 13, color: accent }}>{sub}</p>
    </div>
  );
}

// Quick action card
function ActionCard({ emoji, title, desc, href, accent }: { emoji: string; title: string; desc: string; href: string; accent: string }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{
        padding: 24, borderRadius: 16,
        background: "#111118",
        border: "1px solid rgba(255,255,255,0.06)",
        cursor: "pointer", transition: "border-color 0.2s",
        height: "100%",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
      >
        <div style={{ fontSize: 28, marginBottom: 12 }}>{emoji}</div>
        <h3 style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{title}</h3>
        <p style={{ fontSize: 13, color: "#9898b0", lineHeight: 1.6 }}>{desc}</p>
        <div style={{ marginTop: 16, fontSize: 13, fontWeight: 600, color: accent, display: "flex", alignItems: "center", gap: 4 }}>
          Get started
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </div>
    </Link>
  );
}

export default async function DashboardPage() {
  const user = await currentUser();

  // Extra safety — middleware handles this but good to have
  if (!user) redirect("/sign-in");

  const firstName = user.firstName || user.emailAddresses[0]?.emailAddress?.split("@")[0] || "there";
  const avatarUrl = user.imageUrl;

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0f" }}>

      {/* Top nav */}
      <header style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(10,10,15,0.8)",
        backdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px rgba(99,102,241,0.4)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>
              Algo<span style={{ color: "#818cf8" }}>Vision</span>
            </span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/problems" style={{ fontSize: 14, color: "#9898b0", textDecoration: "none" }}>Problems</Link>
            {/* User avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {avatarUrl
                ? <img src={avatarUrl} alt={firstName} style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(99,102,241,0.4)" }} />
                : (
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(99,102,241,0.3)", border: "2px solid rgba(99,102,241,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#818cf8" }}>
                    {firstName[0].toUpperCase()}
                  </div>
                )
              }
              <span style={{ fontSize: 14, color: "#f1f1f5", fontWeight: 500 }}>{firstName}</span>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>

        {/* Welcome header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            {avatarUrl
              ? <img src={avatarUrl} alt={firstName} style={{ width: 56, height: 56, borderRadius: "50%", border: "3px solid rgba(99,102,241,0.35)" }} />
              : (
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(99,102,241,0.2)", border: "3px solid rgba(99,102,241,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#818cf8" }}>
                  {firstName[0].toUpperCase()}
                </div>
              )
            }
            <div>
              <h1 style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>
                Welcome back, {firstName} 👋
              </h1>
              <p style={{ fontSize: 14, color: "#555570", marginTop: 2 }}>
                {user.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 48 }}>
          <StatCard label="Problems solved"  value="0"   sub="Start solving →"  accent="#6366f1" />
          <StatCard label="Current streak"   value="0"   sub="days in a row"    accent="#f59e0b" />
          <StatCard label="Revision due"     value="0"   sub="problems today"   accent="#00ff88" />
          <StatCard label="Weak topics"      value="—"   sub="solve to discover" accent="#9898b0" />
        </div>

        {/* Section label */}
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#555570", marginBottom: 20 }}>
          Get started
        </p>

        {/* Quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 48 }}>
          <ActionCard emoji="🔍" title="Browse problems"       desc="Search 150+ LeetCode problems, sorted by topic and difficulty."    href="/problems"  accent="#6366f1" />
          <ActionCard emoji="▶️" title="Watch a visualization" desc="See Two Sum solved step-by-step — the best 3 minutes you'll spend." href="/problems"  accent="#00d4ff" />
          <ActionCard emoji="🔁" title="Start revision mode"   desc="Timed practice on problems you've already solved. Reinforce memory." href="/revision"  accent="#00ff88" />
          <ActionCard emoji="📊" title="View your insights"    desc="Identify weak topics and get a personalized practice plan."         href="/insights"  accent="#f59e0b" />
        </div>

        {/* Coming soon banner */}
        <div style={{
          padding: 24, borderRadius: 16,
          background: "rgba(99,102,241,0.05)",
          border: "1px solid rgba(99,102,241,0.15)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16,
        }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
              🚀 More features coming soon
            </p>
            <p style={{ fontSize: 13, color: "#9898b0" }}>
              AI error analysis, personalized revision schedules, and learning insights are in active development.
            </p>
          </div>
          <Link href="/problems" style={{
            padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
            background: "#6366f1", color: "#fff", textDecoration: "none",
            boxShadow: "0 0 16px rgba(99,102,241,0.35)", whiteSpace: "nowrap",
          }}>
            Browse problems
          </Link>
        </div>
      </div>
    </main>
  );
}