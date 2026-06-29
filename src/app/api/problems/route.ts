import { NextRequest, NextResponse } from "next/server";
import { fetchProblems } from "@/lib/leetcode";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const limit      = parseInt(searchParams.get("limit")      || "50");
  const skip       = parseInt(searchParams.get("skip")       || "0");
  const difficulty = searchParams.get("difficulty")          || undefined;
  const search     = searchParams.get("search")              || undefined;
  const tagsParam  = searchParams.get("tags");
  const tags       = tagsParam ? tagsParam.split(",") : undefined;

  try {
    const data = await fetchProblems({ limit, skip, difficulty, tags, search });
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[/api/problems]", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch problems" },
      { status: 500 }
    );
  }
}