import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { VizTrace } from "@/types/visualizer";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are an expert algorithm visualizer. Given a LeetCode problem and a reference solution, generate a step-by-step execution trace as JSON.

Output ONLY valid JSON matching this exact TypeScript type, nothing else (no markdown fences, no explanation):

{
  "code": string[],          // the solution split into individual lines
  "steps": [
    {
      "stepIndex": number,
      "line": number,         // 1-indexed line number being executed (matches code array, 1-indexed)
      "explanation": string,  // 1-2 sentences, friendly teaching tone, explain WHY not just WHAT
      "kind": "normal" | "compare" | "success" | "error",
      "variables": [ { "name": string, "value": string|number, "changed": boolean } ],
      "array": [ { "id": string, "label": string, "values": (number|string)[], "highlight": number[], "success": number[], "pointers": { [name:string]: number } } ],
      "hashmap": [ { "id": string, "label": string, "entries": [string, number|string][], "highlightKey": string } ]
    }
  ],
  "complexity": {
    "time": string,           // e.g. "O(n)"
    "space": string,
    "timeExplanation": string,
    "spaceExplanation": string
  }
}

Rules:
- Generate 8-14 steps that tell a clear story of execution on a SMALL concrete example (3-6 elements).
- Only include "array", "hashmap" fields if relevant to this problem — omit if not used.
- Make pointers/highlights accurate to what's actually happening at that step.
- explanation should teach, not just narrate ("We check if 7 is in the map" not "line 5 executes").
- Mark the final successful step(s) with kind: "success".
- Keep variable lists short — only the 2-4 most relevant variables per step.`;

export async function POST(req: NextRequest) {
  try {
    const { title, difficulty, content, slug } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Missing problem title" }, { status: 400 });
    }

    const userPrompt = `Problem: ${title} (${difficulty})

Description:
${content ? content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").slice(0, 1000) : ""}

Write a clean, correct Python solution to this problem, then generate a step-by-step execution trace following the JSON schema exactly. Use a small, concrete example input (3-6 elements) so the trace is easy to follow visually.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 3000,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: userPrompt   },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty AI response");

    const parsed = JSON.parse(raw);

    const trace: VizTrace = {
      problemSlug: slug || title.toLowerCase().replace(/\s+/g, "-"),
      language:    "python",
      code:        parsed.code,
      steps:       parsed.steps,
      complexity:  parsed.complexity,
    };

    return NextResponse.json({ success: true, data: trace });
  } catch (err) {
    console.error("[/api/visualize]", err);
    return NextResponse.json(
      { success: false, error: "Failed to generate visualization" },
      { status: 500 }
    );
  }
}