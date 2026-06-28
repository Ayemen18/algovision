"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const PROBLEMS = [
  { title: "Two Sum",                  difficulty: "Easy",   topic: "Hash Table"   },
  { title: "Binary Search",            difficulty: "Easy",   topic: "Binary Search"},
  { title: "Merge Intervals",          difficulty: "Medium", topic: "Sorting"      },
  { title: "LRU Cache",                difficulty: "Medium", topic: "Design"       },
  { title: "Trapping Rain Water",      difficulty: "Hard",   topic: "Two Pointers" },
  { title: "Word Ladder",              difficulty: "Hard",   topic: "BFS"          },
  { title: "Longest Substring",        difficulty: "Medium", topic: "Sliding Window"},
  { title: "Number of Islands",        difficulty: "Medium", topic: "Graph"        },
  { title: "Coin Change",              difficulty: "Medium", topic: "Dynamic Prog."},
  { title: "Valid Parentheses",        difficulty: "Easy",   topic: "Stack"        },
  { title: "Course Schedule",          difficulty: "Medium", topic: "Topological"  },
  { title: "Median of Two Arrays",     difficulty: "Hard",   topic: "Binary Search"},
];

const DIFFICULTY_STYLE: Record<string, string> = {
  Easy:   "text-emerald-400",
  Medium: "text-amber-400",
  Hard:   "text-rose-400",
};

function ProblemChip({ title, difficulty, topic }: (typeof PROBLEMS)[number]) {
  return (
    <div className="flex items-center gap-3 shrink-0 px-4 py-2.5 rounded-xl border border-white/[0.06] bg-[#111118] hover:border-white/[0.12] hover:bg-[#1a1a24] transition-all duration-150 cursor-default">
      <span className={`text-xs font-semibold font-mono ${DIFFICULTY_STYLE[difficulty]}`}>
        {difficulty[0]}
      </span>
      <span className="text-sm text-white font-medium whitespace-nowrap">{title}</span>
      <span className="text-xs text-[#555570] whitespace-nowrap">{topic}</span>
    </div>
  );
}

export function ProblemsPreviewSection() {
  // Duplicate for seamless loop
  const doubled = [...PROBLEMS, ...PROBLEMS];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Fade masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#0a0a0f] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#0a0a0f] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 mb-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-400 mb-2">
              Problem library
            </p>
            <h2 className="font-display text-2xl font-bold text-white">
              150+ problems, fully visualized
            </h2>
          </div>
          <Link
            href="/problems"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[#9898b0] hover:text-white transition-colors group"
          >
            Browse all
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Scrolling ticker — Row 1 (left) */}
      <div className="relative flex overflow-hidden mb-3">
        <div
          className="flex gap-3 animate-[ticker_28s_linear_infinite]"
          style={{ width: "max-content" }}
        >
          {doubled.map((p, i) => (
            <ProblemChip key={`r1-${i}`} {...p} />
          ))}
        </div>
      </div>

      {/* Scrolling ticker — Row 2 (right) */}
      <div className="relative flex overflow-hidden">
        <div
          className="flex gap-3 animate-[ticker-reverse_32s_linear_infinite]"
          style={{ width: "max-content" }}
        >
          {[...doubled].reverse().map((p, i) => (
            <ProblemChip key={`r2-${i}`} {...p} />
          ))}
        </div>
      </div>

      {/* Keyframes injected via style tag */}
      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes ticker-reverse {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}