import { notFound }          from "next/navigation";
import { fetchProblemDetail } from "@/lib/leetcode";
import { SolvePageClient }    from "@/components/editor/SolvePageClient";
import { LC_LANG_MAP }        from "@/store/editorStore";
import type { Metadata }      from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  try {
    const p = await fetchProblemDetail(slug);
    return { title: `Solve: ${p.title}` };
  } catch {
    return { title: "Solve" };
  }
}

// Extract starter code for the given language from LeetCode snippets
function getStarterCode(
  snippets: { lang: string; langSlug: string; code: string }[],
  preferredLang: string = "python3"
): string {
  // Try to find preferred language
  const match = snippets.find(s =>
    s.langSlug === preferredLang ||
    s.langSlug === "python3" ||
    s.langSlug === "python"
  );
  if (match) return match.code;
  // Fall back to first available
  return snippets[0]?.code || "# Start coding here";
}

export default async function SolvePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let problem;
  try {
    problem = await fetchProblemDetail(slug);
  } catch {
    notFound();
  }

  if (!problem) notFound();

  const starterCode = getStarterCode(problem.codeSnippets || []);

  return (
    <SolvePageClient
      problem={problem}
      starterCode={starterCode}
    />
  );
}