import type { VizTrace } from "@/types/visualizer";
import { twoSumTrace }       from "./two-sum";
import { binarySearchTrace } from "./binary-search";

/**
 * Curated, hand-built traces for flagship problems.
 * These are pixel-perfect and don't depend on AI generation.
 *
 * Key = LeetCode titleSlug
 */
export const CURATED_TRACES: Record<string, VizTrace> = {
  "two-sum":        twoSumTrace,
  "binary-search":  binarySearchTrace,
};

export function getCuratedTrace(slug: string): VizTrace | null {
  return CURATED_TRACES[slug] || null;
}

export function isCurated(slug: string): boolean {
  return slug in CURATED_TRACES;
}