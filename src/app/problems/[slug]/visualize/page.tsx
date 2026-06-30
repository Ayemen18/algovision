import { notFound }            from "next/navigation";
import { fetchProblemDetail }  from "@/lib/leetcode";
import { getCuratedTrace, isCurated } from "@/lib/algorithms";
import { VisualizerShell }     from "@/components/visualizer/VisualizerShell";
import type { Metadata }       from "next";
import type { VizLanguage }    from "@/types/visualizer";

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
  {
    params,
    searchParams,
  }: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ lang?: string }>;
  }
) {
  const { slug } = await params;
  const { lang }  = await searchParams;

  let problem;
  try {
    problem = await fetchProblemDetail(slug);
  } catch {
    notFound();
  }

  if (!problem) notFound();

  const curated = isCurated(slug);
  const curatedTrace = curated ? getCuratedTrace(slug) : null;

  const validLangs: VizLanguage[] = ["python", "javascript", "typescript", "java", "cpp"];
  const initialLanguage = validLangs.includes(lang as VizLanguage) ? (lang as VizLanguage) : undefined;

  return (
    <VisualizerShell
      slug={slug}
      title={problem.title}
      difficulty={problem.difficulty}
      isCuratedTrace={curated}
      curatedTrace={curatedTrace}
      problemContent={problem.content}
      initialLanguage={initialLanguage}
    />
  );
}