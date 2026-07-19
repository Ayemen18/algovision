import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { VizTrace, VizLanguage } from "@/types/visualizer";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const LANG_NAMES: Record<VizLanguage, string> = {
  python: "Python", javascript: "JavaScript", typescript: "TypeScript",
  java: "Java", cpp: "C++",
};

const SYSTEM_PROMPT = `You are an expert algorithm visualizer. Generate a step-by-step execution trace as structured JSON.

Output ONLY valid JSON — no markdown, no explanation outside the JSON object.

The JSON must match this schema exactly:

{
  "code": string[],
  "steps": [
    {
      "stepIndex": number,
      "line": number,
      "explanation": string,
      "kind": "normal" | "compare" | "success" | "error",

      // Include the primary data structures relevant to this problem.
      // IMPORTANT: You MUST include them in EVERY step, even if they haven't changed in that step.

      "variables": [{ "name": string, "value": string|number|boolean|null, "changed": boolean }],

      "array": [{
        "id": string, "label": string,
        "values": (number|string)[],
        "highlight": number[],
        "success": number[],
        "pointers": { [name: string]: number }
      }],

      "hashmap": [{
        "id": string, "label": string,
        "entries": [string, number|string][],
        "highlightKey": string
      }],

      "stack": [{
        "id": string, "label": string,
        "kind": "stack" | "queue",
        "items": (string|number)[],
        "highlight": number
      }],

      "linkedList": [{
        "id": string, "label": string,
        "nodes": [{ "id": string, "value": string|number, "nextId": string|null, "active": boolean, "visited": boolean, "highlight": boolean }],
        "headId": string|null,
        "pointers": { [name: string]: string }
      }],

      "tree": {
        "id": string, "label": string,
        "nodes": { [id: string]: { "id": string, "value": string|number|null, "leftId": string|null, "rightId": string|null, "active": boolean, "visited": boolean, "highlight": boolean } },
        "rootId": string|null
      },

      "graph": {
        "id": string, "label": string,
        "directed": boolean,
        "nodes": [{ "id": string, "label": string|number, "active": boolean, "visited": boolean, "inQueue": boolean }],
        "edges": [{ "from": string, "to": string, "active": boolean, "directed": boolean }]
      },

      "dpTable": {
        "id": string, "label": string,
        "rows": (number|string|null)[][],
        "rowLabels": string[],
        "colLabels": string[],
        "highlightCell": [number, number],
        "filledCell": [number, number]
      }
    }
  ],
  "complexity": {
    "time": string, "space": string,
    "timeExplanation": string, "spaceExplanation": string
  }
}

CRITICAL RULES — read these carefully:
1. Pick the RIGHT data structure for the problem:
   - Two pointers / sliding window / binary search → "array" with "pointers"
   - HashMap / frequency count / memoization map → "hashmap"
   - Valid parentheses / expression eval / monotonic → "stack" with kind:"stack"
   - BFS / level order → "stack" with kind:"queue"
   - Linked list reversal / fast-slow pointers → "linkedList"
   - Binary tree / BST / tree traversal → "tree"
   - Number of islands / graph BFS-DFS / course schedule → "graph"
   - Coin change / LCS / knapsack / edit distance → "dpTable"

2. Use a SMALL concrete example (3-6 elements) so the trace is easy to follow visually.
3. Generate 8–14 steps — enough to tell the full story without being exhausting.
4. Keep variable lists SHORT — only 2-4 most important variables per step.
5. Mark success steps with kind:"success". Mark comparisons with kind:"compare".
6. explanation should TEACH (why this step matters) not just narrate (what line runs).
7. For trees: use string node IDs like "n1","n2" etc. Always include leftId/rightId even if null.
8. For graphs: assign each node an "id" and reference it in edges.
9. For DP tables: use null for cells not yet computed.
10. For Linked Lists: Always put pointer names (like "slow", "fast") in "linkedList[0].pointers" pointing to node IDs (e.g. {"slow":"n1"}), so they render on the nodes.
11. For Linked List Cycles: To represent a cycle, set the "nextId" of the tail node to the ID of the node where the cycle begins.
12. PERSISTENCE: You MUST include the primary data structures (e.g. 'tree', 'stack', 'linkedList') in EVERY single step. Do not omit them in subsequent steps.
13. Never write the full solution — show the algorithm thinking step by step.`;

export async function POST(req: NextRequest) {
  try {
    const { title, difficulty, content, slug, language = "python" } = await req.json();
    if (!title) return NextResponse.json({ error: "Missing title" }, { status: 400 });

    const langName = LANG_NAMES[language as VizLanguage] || "Python";

    const userPrompt = `Problem: ${title} (${difficulty})
Language: ${langName}

Description:
${content ? content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").slice(0, 1000) : ""}

Instructions:
1. Identify the primary data structure(s) this problem uses (array, hashmap, stack, queue, linked list, tree, graph, or DP table).
2. Write a clean correct ${langName} solution.
3. Generate a step-by-step execution trace using the appropriate schema fields for the identified data structures.
4. Use a small concrete example input.

Output ONLY the JSON object.`;

    const completion = await openai.chat.completions.create({
      model:           "gpt-4o-mini",
      max_tokens:      16000,
      temperature:     0.2,
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
    return NextResponse.json({ success: false, error: "Failed to generate visualization" }, { status: 500 });
  }
}