import { currentUser } from "@clerk/nextjs/server";
import { redirect }    from "next/navigation";
import { Navbar }      from "@/components/layout/Navbar";
import { InsightsClient } from "@/components/dashboard/InsightsClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Learning Insights" };

export default async function InsightsPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", background: "#0a0a0f", paddingTop: 80 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6366f1", marginBottom: 10 }}>
              AI-Powered
            </p>
            <h1 style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: "clamp(1.8rem,4vw,2.5rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 10 }}>
              Learning Insights
            </h1>
            <p style={{ fontSize: 15, color: "#9898b0" }}>
              Personalized analysis of your coding patterns — where you're strong and where to focus next.
            </p>
          </div>
          <InsightsClient />
        </div>
      </main>
    </>
  );
}