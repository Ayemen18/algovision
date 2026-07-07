import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/mongodb";
import { sm2 } from "@/types/progress";
import type { ProblemAttempt, RevisionItem } from "@/types/progress";

// ─── GET — fetch user's progress + stats ──────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db       = await getDb();
    const attempts = await db
      .collection<ProblemAttempt>("attempts")
      .find({ userId })
      .sort({ lastAttemptAt: -1 })
      .toArray();

    const revisions = await db
      .collection<RevisionItem>("revisions")
      .find({ userId, nextReviewAt: { $lte: new Date() } })
      .sort({ nextReviewAt: 1 })
      .limit(10)
      .toArray();

    // Compute stats
    const solved    = attempts.filter(a => a.status === "solved");
    const today     = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    const solvedDates = solved.map(a => a.solvedAt?.toISOString().slice(0, 10) || "");
    const hasToday    = solvedDates.includes(today);
    const hasYesterday= solvedDates.includes(yesterday);
    const streak      = hasToday ? (hasYesterday ? 2 : 1) : 0; // simplified; extend for full streak

    const byDifficulty = {
      easy:   solved.filter(a => a.difficulty === "Easy").length,
      medium: solved.filter(a => a.difficulty === "Medium").length,
      hard:   solved.filter(a => a.difficulty === "Hard").length,
    };

    // Topic frequency analysis
    const topicCount: Record<string, number> = {};
    const incorrectTopicCount: Record<string, number> = {};
    for (const a of attempts) {
      for (const t of a.topics || []) {
        topicCount[t]         = (topicCount[t] || 0) + 1;
        if (a.analysisStatus === "incorrect") {
          incorrectTopicCount[t] = (incorrectTopicCount[t] || 0) + 1;
        }
      }
    }

    const weakTopics = Object.entries(incorrectTopicCount)
      .sort(([,a],[,b]) => b - a)
      .slice(0, 3)
      .map(([topic]) => topic);

    const recentTopics = [...new Set(
      attempts.slice(0, 10).flatMap(a => a.topics || [])
    )].slice(0, 5);

    const dueRevisions = await db
      .collection<RevisionItem>("revisions")
      .countDocuments({ userId, nextReviewAt: { $lte: new Date() } });

    return NextResponse.json({
      success: true,
      data: {
        attempts,
        dueRevisions: revisions,
        stats: {
          totalSolved:    solved.length,
          totalAttempted: attempts.length,
          streak,
          lastActiveDate: today,
          byDifficulty,
          recentTopics,
          weakTopics,
          dueForReview:   dueRevisions,
        },
      },
    });
  } catch (err) {
    console.error("[GET /api/progress]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── POST — record a solve / attempt ─────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { slug, title, difficulty, topics, language, analysisStatus, errorType, status } = body;

    const db  = await getDb();
    const col = db.collection<ProblemAttempt>("attempts");
    const now = new Date();

    // Upsert — update existing or insert new
    const existing = await col.findOne({ userId, slug });

    if (existing) {
      await col.updateOne(
        { userId, slug },
        {
          $set: {
            language,
            analysisStatus,
            errorType,
            lastAttemptAt: now,
            ...(status === "solved" && !existing.solvedAt ? { solvedAt: now, status: "solved" } : {}),
          },
          $inc: { attempts: 1 },
        }
      );
    } else {
      await col.insertOne({
        userId, slug, title, difficulty, topics, language,
        status:          status || "attempted",
        attempts:        1,
        analysisStatus,
        errorType,
        firstAttemptAt:  now,
        lastAttemptAt:   now,
        ...(status === "solved" ? { solvedAt: now } : {}),
      });
    }

    // If solved, add/update the revision schedule
    if (status === "solved") {
      const revCol = db.collection<RevisionItem>("revisions");
      const existingRev = await revCol.findOne({ userId, slug });

      if (!existingRev) {
        // First time solved — schedule first review in 1 day
        await revCol.insertOne({
          userId, slug, title, difficulty, topics,
          interval:    1,
          repetitions: 0,
          easeFactor:  2.5,
          nextReviewAt: new Date(Date.now() + 86400000),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/progress]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}