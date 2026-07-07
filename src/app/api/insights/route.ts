import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/mongodb";
import OpenAI from "openai";
import type { ProblemAttempt } from "@/types/progress";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db       = await getDb();
    const attempts = await db
      .collection<ProblemAttempt>("attempts")
      .find({ userId })
      .sort({ lastAttemptAt: -1 })
      .limit(30)
      .toArray();

    if (attempts.length < 3) {
      return NextResponse.json({
        success: true,
        data: {
          summary: "Solve at least 3 problems to unlock personalized insights.",
          strengths: [],
          weaknesses: [],
          recommendations: [],
          nextSteps: "Start with Two Sum or Binary Search to build your foundation.",
        },
      });
    }

    // Build a summary of the user's history
    const solved    = attempts.filter(a => a.status === "solved");
    const incorrect = attempts.filter(a => a.analysisStatus === "incorrect");

    const topicStats: Record<string, { total: number; correct: number }> = {};
    for (const a of attempts) {
      for (const topic of a.topics || []) {
        if (!topicStats[topic]) topicStats[topic] = { total: 0, correct: 0 };
        topicStats[topic].total++;
        if (a.analysisStatus === "correct" || a.status === "solved") {
          topicStats[topic].correct++;
        }
      }
    }

    const errorTypes = incorrect.map(a => a.errorType).filter(Boolean);
    const commonError = errorTypes.sort((a, b) =>
      errorTypes.filter(e => e === a).length - errorTypes.filter(e => e === b).length
    ).pop();

    const historyText = Object.entries(topicStats)
      .map(([t, s]) => `${t}: ${s.correct}/${s.total} correct`)
      .join(", ");

    const prompt = `You are a personalized algorithm coach. Based on this student's coding history, provide focused learning insights.

Student history:
- Total problems solved: ${solved.length}
- Total attempted: ${attempts.length}
- Topic performance: ${historyText}
- Most common error type: ${commonError || "varied"}
- Recent difficulties: ${incorrect.slice(0,3).map(a => a.title).join(", ") || "none"}

Respond ONLY with JSON (no markdown):
{
  "summary": "string — 2 sentences: honest assessment of where they are",
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "recommendations": [
    { "topic": "string", "reason": "string", "priority": "high"|"medium"|"low" },
    { "topic": "string", "reason": "string", "priority": "high"|"medium"|"low" },
    { "topic": "string", "reason": "string", "priority": "high"|"medium"|"low" }
  ],
  "nextSteps": "string — specific, actionable next step (1-2 sentences)"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 600,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty response");

    const insights = JSON.parse(raw);

    return NextResponse.json({ success: true, data: insights });
  } catch (err) {
    console.error("[GET /api/insights]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}