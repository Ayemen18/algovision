"use client";

import { useEffect, useRef, useState } from "react";
import type { VizStackState } from "@/types/visualizer";

const ITEM_W  = 120;
const ITEM_H  = 44;
const ITEM_GAP = 6;
const PAD     = 20;

interface ItemProps {
  value:     string | number;
  idx:       number;
  total:     number;
  isActive:  boolean;
  isTop:     boolean;
  kind:      "stack" | "queue";
}

function StackItem({ value, idx, total, isActive, isTop, kind }: ItemProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Stack: items stacked vertically, top at bottom of SVG visual
  // Queue: items horizontal, front on left
  const isQueue = kind === "queue";

  const bg     = isActive ? "#1e1b4b" : isTop ? "#18182a" : "rgba(255,255,255,0.025)";
  const stroke = isActive ? "#818cf8" : isTop ? "rgba(99,102,241,0.35)" : "rgba(255,255,255,0.07)";
  const color  = isActive ? "#a5b4fc" : isTop ? "#c4c4e0" : "#666680";

  return (
    <g style={{
      opacity:   mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(-12px)",
      transition: "opacity 0.3s ease, transform 0.4s cubic-bezier(0.34,1.4,0.64,1)",
    }}>
      {/* Glow on active */}
      {isActive && (
        <rect
          x={-3} y={-3} width={ITEM_W + 6} height={ITEM_H + 6} rx={11}
          fill="none" stroke="#818cf8" strokeWidth={1.5} opacity={0.4}
          style={{ filter: "drop-shadow(0 0 6px #818cf8)" }}
        />
      )}
      <rect x={0} y={0} width={ITEM_W} height={ITEM_H} rx={9}
        fill={bg} stroke={stroke} strokeWidth={1.5}
        style={{ transition: "all 0.35s ease" }}
      />
      <text
        x={ITEM_W / 2} y={ITEM_H / 2 + 1}
        textAnchor="middle" dominantBaseline="central"
        style={{ fontFamily: "'DM Mono',monospace", fontSize: 16, fontWeight: 700, fill: color }}
      >
        {value}
      </text>

      {/* Top/Front label */}
      {isTop && (
        <text
          x={ITEM_W + 10} y={ITEM_H / 2 + 1}
          dominantBaseline="central"
          style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, fontWeight: 700, fill: "#6366f1", opacity: 0.8 }}
        >
          {kind === "stack" ? "← top" : "← front"}
        </text>
      )}
    </g>
  );
}

export function AnimatedStack({ stack }: { stack: VizStackState }) {
  const isQueue = stack.kind === "queue";
  const items   = [...stack.items];                // index 0 = bottom/back
  const topIdx  = items.length - 1;               // last item = top/front

  // Stack: render bottom-to-top (first item at top of SVG, last at bottom with "top" label)
  // But visually a stack has top at TOP of the visual, so we reverse
  const displayItems = isQueue ? items : [...items].reverse();

  const svgH = isQueue
    ? PAD * 2 + ITEM_H
    : PAD * 2 + items.length * (ITEM_H + ITEM_GAP);
  const svgW = isQueue
    ? PAD * 2 + items.length * (ITEM_W + ITEM_GAP) + 100
    : PAD * 2 + ITEM_W + 100;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ width: 3, height: 14, borderRadius: 2, background: "#a855f7" }} />
        <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#71718a", fontWeight: 700 }}>
          {stack.label} <span style={{ color: "#444460", fontWeight: 400 }}>({stack.kind})</span>
        </p>
      </div>

      {items.length === 0 ? (
        <div style={{
          height: 52, borderRadius: 10,
          border: "1px dashed rgba(255,255,255,0.08)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#333352" }}>empty</span>
        </div>
      ) : (
        <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} style={{ overflow: "visible" }}>
          {isQueue ? (
            // Horizontal queue
            displayItems.map((val, i) => {
              const isFront  = i === 0;
              const isActive = stack.highlight === i;
              return (
                <g key={i} transform={`translate(${PAD + i * (ITEM_W + ITEM_GAP)}, ${PAD})`}>
                  <StackItem
                    value={val} idx={i} total={items.length}
                    isActive={isActive} isTop={isFront} kind="queue"
                  />
                  {/* Connector arrow between items */}
                  {i < displayItems.length - 1 && (
                    <line
                      x1={ITEM_W + 3} y1={ITEM_H / 2}
                      x2={ITEM_W + ITEM_GAP - 3} y2={ITEM_H / 2}
                      stroke="rgba(255,255,255,0.12)" strokeWidth={1.5}
                    />
                  )}
                </g>
              );
            })
          ) : (
            // Vertical stack (top at top of visual = displayItems[0])
            displayItems.map((val, i) => {
              const origIdx  = items.length - 1 - i;  // reverse back to get original idx
              const isTopItem = origIdx === topIdx;
              const isActive  = stack.highlight === origIdx;
              return (
                <g key={i} transform={`translate(${PAD}, ${PAD + i * (ITEM_H + ITEM_GAP)})`}>
                  <StackItem
                    value={val} idx={origIdx} total={items.length}
                    isActive={isActive} isTop={isTopItem} kind="stack"
                  />
                </g>
              );
            })
          )}

          {/* Stack base line */}
          {!isQueue && (
            <line
              x1={PAD - 4} y1={svgH - PAD + 4}
              x2={PAD + ITEM_W + 4} y2={svgH - PAD + 4}
              stroke="rgba(99,102,241,0.3)" strokeWidth={2}
            />
          )}
        </svg>
      )}
    </div>
  );
}