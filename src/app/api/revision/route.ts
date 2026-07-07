import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/mongodb";
import { sm2 } from "@/types/progress";
import type { RevisionItem } from "@/types/progress";

// GET — fetch due revision items
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db  = await getDb();
    const due = await db
      .collection<RevisionItem>("revisions")
      .find({ userId, nextReviewAt: { $lte: new Date() } })
      .sort({ nextReviewAt: 1 })
      .limit(20)
      .toArray();

    const upcoming = await db
      .collection<RevisionItem>("revisions")
      .find({ userId, nextReviewAt: { $gt: new Date() } })
      .sort({ nextReviewAt: 1 })
      .limit(5)
      .toArray();

    return NextResponse.json({ success: true, data: { due, upcoming } });
  } catch (err) {
    console.error("[GET /api/revision]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST — record review result and advance SM-2
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { slug, quality } = await req.json();
    // quality: 0-5 (5=perfect recall, 0=complete blackout)

    const db  = await getDb();
    const col = db.collection<RevisionItem>("revisions");
    const item = await col.findOne({ userId, slug });

    if (!item) {
      return NextResponse.json({ error: "Revision item not found" }, { status: 404 });
    }

    const updated = sm2(item, quality);
    const nextReviewAt = new Date(
      Date.now() + updated.interval * 24 * 60 * 60 * 1000
    );

    await col.updateOne(
      { userId, slug },
      {
        $set: {
          ...updated,
          nextReviewAt,
          lastReviewAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      data: { ...updated, nextReviewAt },
    });
  } catch (err) {
    console.error("[POST /api/revision]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}