import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { VizTrace, VizLanguage } from "@/types/visualizer";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const LANG_NAMES: Record<VizLanguage, string> = {
  python:     "Python",
  javascript: "JavaScript",
  typescript: "TypeScript",
  java:       "Java",
  cpp:        "C++",
};

const SYSTEM_PROMPT = `You are an expert algorithm visualizer. Given a LeetCode problem, a target language, and a reference solution, generate a step-by-step execution trace as JSON.

Output ONLY valid JSON matching these exact TypeScript interfaces, nothing else (no markdown fences, no explanation):

type Trace = {
  code: string[]; // the solution in the REQUESTED LANGUAGE, split into individual lines
  steps: Step[];
  complexity: {
    time: string;
    space: string;
    timeExplanation: string;
    spaceExplanation: string;
  }
};

type Step = {
  stepIndex: number;
  line: number; // 1-indexed line number being executed
  explanation: string; // 1-2 sentences, friendly teaching tone
  kind: "normal" | "compare" | "success" | "error";
  variables?: { name: string; value: string|number; changed?: boolean }[];
  array?: { id: string; label: string; values: (number|string)[]; highlight?: number[]; success?: number[]; pointers?: Record<string, number> }[];
  hashmap?: { id: string; label: string; entries: [string, number|string][]; highlightKey?: string }[];
  tree?: { id: string; label: string; root: TreeNode | null }[];
  graph?: { id: string; label: string; directed?: boolean; nodes: { id: string; val?: string|number; highlight?: boolean }[]; edges: { source: string; target: string; highlight?: boolean; weight?: string|number }[] }[];
  dpTable?: { id: string; label: string; rows: number; cols: number; data: (string|number)[][]; highlight?: { r: number; c: number }[]; success?: { r: number; c: number }[] }[];
  stack?: { id: string; label: string; frames: { label: string; detail?: string; active?: boolean }[] };
};

type TreeNode = {
  id: string;
  val: string|number;
  left?: TreeNode;
  right?: TreeNode;
  highlight?: boolean;
};

Rules:
- Write the code in the EXACT language requested, using that language's idiomatic syntax and standard library.
- Generate 8-14 steps that tell a clear story of execution on a SMALL concrete example (3-6 elements or nodes).
- If a data structure (array, hashmap, tree, graph, dpTable, stack) is used in the problem, you MUST include its full state in EVERY step, even if it hasn't changed. Do not omit it in later steps.
- For stacks, ALWAYS use the stack field, do not just put it in variables.
- Make pointers/highlights accurate to what's actually happening at that step.
- explanation should teach, not just narrate.
- Mark the final successful step(s) with kind: "success".
- Keep variable lists short — only the 2-4 most relevant variables per step.`;

export async function POST(req: NextRequest) {
  try {
    const { title, difficulty, content, slug, language = "python" } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Missing problem title" }, { status: 400 });
    }

    const langName = LANG_NAMES[language as VizLanguage] || "Python";

    const userPrompt = `Problem: ${title} (${difficulty})
Target language: ${langName}

Description:
${content ? content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").slice(0, 1000) : ""}

Write a clean, correct ${langName} solution to this problem, then generate a step-by-step execution trace following the JSON schema exactly. Use a small, concrete example input (3-6 elements) so the trace is easy to follow visually. Remember: the "code" array must be written in ${langName}.`;

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
      code:        { [language as VizLanguage]: parsed.code },
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