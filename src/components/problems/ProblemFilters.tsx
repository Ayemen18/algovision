"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const POPULAR_TAGS = [
  "Array", "String", "Hash Table", "Dynamic Programming",
  "Math", "Sorting", "Greedy", "Binary Search",
  "Depth-First Search", "Breadth-First Search",
  "Tree", "Two Pointers", "Stack", "Sliding Window",
  "Graph", "Backtracking", "Linked List", "Heap (Priority Queue)",
];

const DIFF_COLORS: Record<string, { active: string; border: string; bg: string }> = {
  Easy:   { active: "#34d399", border: "rgba(52,211,153,0.4)",  bg: "rgba(52,211,153,0.12)"  },
  Medium: { active: "#fbbf24", border: "rgba(251,191,36,0.4)",  bg: "rgba(251,191,36,0.12)"  },
  Hard:   { active: "#fb7185", border: "rgba(251,113,133,0.4)", bg: "rgba(251,113,133,0.12)" },
};

export function ProblemFilters({ total }: { total: number }) {
  const router     = useRouter();
  const pathname   = usePathname();
  const params     = useSearchParams();

  const currentDiff   = params.get("difficulty") || "";
  const currentSearch = params.get("search")     || "";
  const currentTags   = params.get("tags")       ? params.get("tags")!.split(",") : [];

  const updateParams = useCallback((updates: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    for (const [key, val] of Object.entries(updates)) {
      if (val === null || val === "") next.delete(key);
      else next.set(key, val);
    }
    // Reset to page 1 on filter change
    next.delete("skip");
    router.push(`${pathname}?${next.toString()}`);
  }, [params, pathname, router]);

  const toggleTag = (tag: string) => {
    const next = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    updateParams({ tags: next.join(",") || null });
  };

  const toggleDifficulty = (diff: string) => {
    updateParams({ difficulty: currentDiff === diff ? null : diff });
  };

  const clearAll = () => {
    router.push(pathname);
  };

  const hasFilters = currentDiff || currentSearch || currentTags.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Search */}
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555570" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search problems..."
          defaultValue={currentSearch}
          onChange={e => {
            const val = e.target.value;
            // Debounce via setTimeout
            clearTimeout((window as any).__searchTimeout);
            (window as any).__searchTimeout = setTimeout(() => {
              updateParams({ search: val || null });
            }, 400);
          }}
          style={{
            width: "100%", padding: "10px 14px 10px 42px",
            borderRadius: 10, fontSize: 14,
            background: "#111118",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#f1f1f5",
            outline: "none",
            fontFamily: "'Cabinet Grotesk', sans-serif",
            transition: "border-color 0.15s",
          }}
          onFocus={e  => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
          onBlur={e   => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
        />
      </div>

      {/* Difficulty pills */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: "#555570", flexShrink: 0 }}>Difficulty:</span>
        <div style={{ display: "flex", gap: 6 }}>
          {DIFFICULTIES.map(d => {
            const c       = DIFF_COLORS[d];
            const isActive = currentDiff === d;
            return (
              <button key={d} onClick={() => toggleDifficulty(d)} style={{
                padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                cursor: "pointer", transition: "all 0.15s",
                border:  `1px solid ${isActive ? c.border : "rgba(255,255,255,0.08)"}`,
                background: isActive ? c.bg : "transparent",
                color: isActive ? c.active : "#9898b0",
              }}>
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* Topic tags */}
      <div>
        <span style={{ fontSize: 12, color: "#555570", display: "block", marginBottom: 8 }}>Topics:</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {POPULAR_TAGS.map(tag => {
            const isActive = currentTags.includes(tag);
            return (
              <button key={tag} onClick={() => toggleTag(tag)} style={{
                padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500,
                cursor: "pointer", transition: "all 0.15s",
                border:     `1px solid ${isActive ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.06)"}`,
                background:  isActive ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.03)",
                color:       isActive ? "#818cf8" : "#9898b0",
              }}>
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count + clear */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, color: "#555570" }}>
          <span style={{ color: "#f1f1f5", fontWeight: 600 }}>{total.toLocaleString()}</span> problems
          {hasFilters && " (filtered)"}
        </span>
        {hasFilters && (
          <button onClick={clearAll} style={{
            fontSize: 12, color: "#6366f1", background: "none",
            border: "none", cursor: "pointer", padding: 0,
          }}>
            Clear all filters ×
          </button>
        )}
      </div>
    </div>
  );
}