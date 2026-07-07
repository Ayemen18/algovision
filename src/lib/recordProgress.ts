/**
 * Records a problem attempt/solve to MongoDB via /api/progress.
 * Called from the client after the AI analysis completes.
 */
export async function recordProgress({
  slug,
  title,
  difficulty,
  topics,
  language,
  analysisStatus,
  errorType,
}: {
  slug:            string;
  title:           string;
  difficulty:      string;
  topics:          string[];
  language:        string;
  analysisStatus:  "correct" | "incorrect" | "inefficient";
  errorType?:      string;
}) {
  try {
    await fetch("/api/progress", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        title,
        difficulty,
        topics,
        language,
        analysisStatus,
        errorType,
        // Mark as solved if the analysis says it's correct or just inefficient
        status: analysisStatus === "correct" || analysisStatus === "inefficient"
          ? "solved"
          : "attempted",
      }),
    });
  } catch (err) {
    // Don't fail silently in dev
    console.error("[recordProgress]", err);
  }
}