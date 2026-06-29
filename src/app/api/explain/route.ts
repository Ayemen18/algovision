import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { title, difficulty, topics, content } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Missing problem title" }, { status: 400 });
    }

    const systemPrompt = `You are an expert algorithm teacher at a top coding interview platform. 
Your job is to help developers understand algorithm problems WITHOUT revealing the implementation.
You explain concepts clearly, use analogies, and build intuition step by step.
Be concise but insightful. Use plain text only — no markdown headers, no bullet symbols like *, -, •.
Use numbered lists only when listing steps. Keep total response under 400 words.`;

    const userPrompt = `Explain this LeetCode problem to help me understand it before coding:

Problem: ${title}
Difficulty: ${difficulty}
Topics: ${topics?.join(", ") || "General"}

Problem description:
${content ? content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").slice(0, 800) : "Not available"}

Please explain:
1. INTUITION: What is the core insight or "aha moment" for this problem? What pattern does it follow?
2. KEY OBSERVATIONS: What are 2-3 important things to notice about the input, output, or constraints?
3. APPROACH DIRECTION: What general strategy or data structure should I think about? (Do NOT give the actual algorithm or code)
4. COMMON MISTAKES: What do beginners typically get wrong on this problem?

Do not write any code. Do not reveal the full solution. Focus on building understanding.`;

    // Use streaming for a better UX — text appears as it generates
    const stream = await openai.chat.completions.create({
      model:       "gpt-4o-mini",   // Fast + cheap for explanations
      max_tokens:  600,
      temperature: 0.7,
      stream:      true,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userPrompt   },
      ],
    });

    // Stream the response back to the client
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type":  "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    console.error("[/api/explain]", err);
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}