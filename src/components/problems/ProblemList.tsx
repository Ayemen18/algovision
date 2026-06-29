"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ProblemCard }         from "./ProblemCard";
import { ProblemListSkeleton } from "./ProblemListSkeleton";
import { ProblemFilters }      from "./ProblemFilters";
import type { LCProblemListItem } from "@/lib/leetcode";

const PAGE_SIZE = 50;

export function ProblemList() {
  const params = useSearchParams();

  const [problems,  setProblems]  = useState<LCProblemListItem[]>([]);
  const [total,     setTotal]     = useState(0);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [skip,      setSkip]      = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const difficulty = params.get("difficulty") || "";
  const search     = params.get("search")     || "";
  const tags       = params.get("tags")       || "";

  const fetchData = useCallback(async (newSkip: number, append: boolean) => {
    try {
      if (newSkip === 0) setLoading(true);
      else setLoadingMore(true);

      const qs = new URLSearchParams({
        limit: String(PAGE_SIZE),
        skip:  String(newSkip),
      });
      if (difficulty) qs.set("difficulty", difficulty);
      if (search)     qs.set("search",     search);
      if (tags)       qs.set("tags",       tags);

      const res  = await fetch(`/api/problems?${qs}`);
      const json = await res.json();

      if (!json.success) throw new Error(json.error);

      if (append) {
        setProblems(prev => [...prev, ...json.data.questions]);
      } else {
        setProblems(json.data.questions);
        setSkip(0);
      }
      setTotal(json.data.total);
      setError(null);
    } catch (err) {
      setError("Failed to load problems. LeetCode API may be temporarily unavailable.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [difficulty, search, tags]);

  // Refetch when filters change
  useEffect(() => {
    fetchData(0, false);
  }, [fetchData]);

  const loadMore = () => {
    const nextSkip = skip + PAGE_SIZE;
    setSkip(nextSkip);
    fetchData(nextSkip, true);
  };

  const hasMore = problems.length < total;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <ProblemFilters total={total} />

      {/* Error state */}
      {error && (
        <div style={{
          padding: "20px 24px", borderRadius: 12,
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.2)",
        }}>
          <p style={{ fontSize: 14, color: "#fb7185", marginBottom: 4, fontWeight: 600 }}>
            Unable to load problems
          </p>
          <p style={{ fontSize: 13, color: "#9898b0" }}>{error}</p>
          <button onClick={() => fetchData(0, false)} style={{
            marginTop: 12, padding: "6px 16px", borderRadius: 8, fontSize: 13,
            fontWeight: 600, background: "rgba(239,68,68,0.15)",
            border: "1px solid rgba(239,68,68,0.3)", color: "#fb7185",
            cursor: "pointer",
          }}>
            Retry
          </button>
        </div>
      )}

      {/* Problem list */}
      {loading ? (
        <ProblemListSkeleton />
      ) : (
        <>
          {problems.length === 0 && !error ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontSize: 40, marginBottom: 16 }}>🔍</p>
              <p style={{ fontSize: 16, color: "#f1f1f5", fontWeight: 600, marginBottom: 8 }}>No problems found</p>
              <p style={{ fontSize: 14, color: "#555570" }}>Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {problems.map((p, i) => (
                <ProblemCard key={p.titleSlug} problem={p} index={i} />
              ))}
            </div>
          )}

          {/* Load more */}
          {hasMore && !error && (
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 8 }}>
              <button onClick={loadMore} disabled={loadingMore} style={{
                padding: "10px 32px", borderRadius: 10, fontSize: 14, fontWeight: 600,
                background: loadingMore ? "rgba(255,255,255,0.04)" : "rgba(99,102,241,0.1)",
                border: `1px solid ${loadingMore ? "rgba(255,255,255,0.06)" : "rgba(99,102,241,0.3)"}`,
                color: loadingMore ? "#555570" : "#818cf8",
                cursor: loadingMore ? "not-allowed" : "pointer",
                transition: "all 0.15s",
              }}>
                {loadingMore ? "Loading..." : `Load more (${total - problems.length} remaining)`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}