"use client";

import { useEffect, useRef } from "react";
import type { VizStep } from "@/types/visualizer";
import { AnimatedArray }      from "./AnimatedArray";
import { AnimatedHashMap }    from "./AnimatedHashMap";
import { AnimatedVariables }  from "./AnimatedVariables";
import { AnimatedStack }      from "./AnimatedStack";
import { AnimatedLinkedList } from "./AnimatedLinkedList";
import { AnimatedTree }       from "./AnimatedTree";
import { AnimatedGraph }      from "./AnimatedGraph";
import { AnimatedDPTable }    from "./AnimatedDPTable";

interface Props {
  step:         VizStep;
  totalSteps:   number;
  currentIndex: number;
}

const KIND_CONFIG = {
  normal:  { label: "Executing",  color: "#6366f1", dot: "#6366f1" },
  compare: { label: "Comparing",  color: "#f59e0b", dot: "#f59e0b" },
  success: { label: "Found it!",  color: "#00ff88", dot: "#00ff88" },
  error:   { label: "Error",      color: "#fb7185", dot: "#fb7185" },
};

export function AnimatedVisualizationPanel({ step, totalSteps, currentIndex }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const kind     = step.kind || "normal";
  const cfg      = KIND_CONFIG[kind];

  // Subtle panel flash on step change
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.background = `${cfg.dot}0a`;
    requestAnimationFrame(() => {
      el.style.transition = "background 0.7s ease";
      el.style.background = "#0a0a10";
    });
  }, [currentIndex]);

  const hasContent =
    (step.array?.length      ?? 0) > 0 ||
    (step.hashmap?.length    ?? 0) > 0 ||
    (step.variables?.length  ?? 0) > 0 ||
    (step.stack?.length      ?? 0) > 0 ||
    (step.linkedList?.length ?? 0) > 0 ||
    !!step.tree ||
    !!step.graph ||
    !!step.dpTable;

  return (
    <div
      ref={panelRef}
      style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0a0a10", transition: "background 0.7s ease" }}
    >
      {/* Header strip */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 20px", flexShrink: 0,
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: cfg.dot, boxShadow: `0 0 8px ${cfg.dot}`,
          }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: cfg.color }}>
            {cfg.label}
          </span>
        </div>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "#333352" }}>
          {currentIndex + 1} / {totalSteps}
        </span>
      </div>

      {/* Data structures — render whatever the step declares */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 30 }}>

        {!hasContent && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: 10, color: "#2a2a3a" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity={0.4}>
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
            </svg>
            <span style={{ fontSize: 12 }}>No structures active</span>
          </div>
        )}

        {/* Arrays */}
        {step.array?.map(a => <AnimatedArray      key={a.id} array={a}   />)}

        {/* HashMaps */}
        {step.hashmap?.map(h => <AnimatedHashMap  key={h.id} hashmap={h} />)}

        {/* Stacks / Queues */}
        {step.stack?.map(s => <AnimatedStack       key={s.id} stack={s}  />)}

        {/* Linked Lists */}
        {step.linkedList?.map(l => <AnimatedLinkedList key={l.id} list={l} />)}

        {/* Binary Tree */}
        {step.tree && <AnimatedTree tree={step.tree} />}

        {/* Graph */}
        {step.graph && <AnimatedGraph graph={step.graph} />}

        {/* DP Table */}
        {step.dpTable && <AnimatedDPTable table={step.dpTable} />}

        {/* Variables — always last, least prominent */}
        {step.variables && step.variables.length > 0 && (
          <AnimatedVariables variables={step.variables} />
        )}
      </div>
    </div>
  );
}