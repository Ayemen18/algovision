import { NextRequest, NextResponse } from "next/server";
import { fetchProblemDetail } from "@/lib/leetcode";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const data = await fetchProblemDetail(slug);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error(`[/api/problem/${slug}]`, err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch problem" },
      { status: 500 }
    );
  }
}