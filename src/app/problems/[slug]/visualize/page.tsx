import { notFound }            from "next/navigation";
import { fetchProblemDetail }  from "@/lib/leetcode";
import { getCuratedTrace, isCurated } from "@/lib/algorithms";
import { VisualizerShell }     from "@/components/visualizer/VisualizerShell";
import type { Metadata }       from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  try {
    const p = await fetchProblemDetail(slug);
    return { title: `Visualize: ${p.title}` };
  } catch {
    return { title: "Visualize" };
  }
}

export default async function VisualizePage(
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

  const curated = isCurated(slug);
  const curatedTrace = curated ? getCuratedTrace(slug) : null;

  return (
    <VisualizerShell
      slug={slug}
      title={problem.title}
      difficulty={problem.difficulty}
      isCuratedTrace={curated}
      curatedTrace={curatedTrace}
      problemContent={problem.content}
    />
  );
}