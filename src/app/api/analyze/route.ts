import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { AnalysisResult } from "@/types/analysis";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are an expert coding mentor and algorithm reviewer at a top-tier engineering education platform.

Your job is to deeply analyze a student's code submission for a LeetCode-style problem and provide structured feedback.

You MUST respond with ONLY valid JSON matching this exact schema (no markdown, no explanation outside JSON):

{
  "status": "correct" | "incorrect" | "inefficient",
  "errorType": "wrong_logic" | "off_by_one" | "boundary_condition" | "infinite_loop" | "wrong_data_structure" | "recursion_error" | "inefficient_approach" | "runtime_error" | "correct",
  "what": "string — 1-2 sentences: what is wrong with the code?",
  "why": "string — 2-3 sentences: WHY this is wrong conceptually. Explain the misunderstanding, not just the symptom.",
  "how": "string — 2-3 sentences: How to fix it. Give clear direction WITHOUT writing the solution. Nudge, don't spoil.",
  "hint": "string — one sentence: a subtle Socratic hint that makes them think",
  "annotations": [
    {
      "line": number,
      "severity": "error" | "warning" | "info",
      "message": "string — short, specific, inline explanation for this line"
    }
  ],
  "fix": {
    "description": "string — what this fix corrects",
    "before": "string — the problematic code (1-3 lines)",
    "after": "string — the corrected version (1-3 lines, no full spoilers)"
  },
  "failingCase": {
    "input": "string — a specific input that exposes the bug",
    "expected": "string — what the correct output should be",
    "got": "string — what their code actually returns"
  },
  "complexity": {
    "current": "string — e.g. O(n²)",
    "optimal": "string — e.g. O(n)",
    "note": "string — brief note on how to improve"
  }
}

Rules:
- If the code is correct and optimal, set status="correct", errorType="correct". Still provide complexity and a positive what/why/how.
- If the code is correct but inefficient, set status="inefficient", errorType="inefficient_approach".
- If the code is wrong, diagnose the ROOT cause — not just surface symptoms.
- annotations array should mark the specific line(s) with issues. Be precise about line numbers.
- The "fix" before/after should show the key change, not the entire solution.
- Never write out the full correct solution in any field.
- Always include a failingCase unless the solution is correct.
- The "how" field should guide, not solve. "Consider what happens when the array is empty" not "add a null check on line 3".`;

export async function POST(req: NextRequest) {
  try {
    const { code, language, title, difficulty, description } = await req.json();

    if (!code || !title) {
      return NextResponse.json({ error: "Missing code or title" }, { status: 400 });
    }

    const userPrompt = `Analyze this code submission:

Problem: ${title} (${difficulty})
Language: ${language}

Problem description:
${description ? description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").slice(0, 600) : "Not available"}

User's code:
\`\`\`${language}
${code}
\`\`\`

Analyze the code thoroughly. Check for:
1. Logical correctness — does it solve the problem?
2. Edge cases — empty input, single element, duplicates, negatives
3. Off-by-one errors in loops and indices
4. Wrong algorithm choice or data structure
5. Time/space complexity — is it optimal?

Provide deep, educational feedback that helps the student understand their mistake conceptually.`;

    const completion = await openai.chat.completions.create({
      model:           "gpt-4o-mini",
      max_tokens:      1200,
      temperature:     0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: userPrompt   },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty AI response");

    const result: AnalysisResult = JSON.parse(raw);

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("[/api/analyze]", err);
    return NextResponse.json(
      { success: false, error: "Failed to analyze code" },
      { status: 500 }
    );
  }
}