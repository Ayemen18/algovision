"use client";

import { useEffect, useState } from "react";
import type { VizLinkedListState } from "@/types/visualizer";

const NODE_W  = 70;
const NODE_H  = 46;
const ARROW_W = 40;
const PAD_X   = 20;
const PAD_Y   = 56;    // room for pointer labels above
const NULL_W  = 42;
const UNIT    = NODE_W + ARROW_W;   // total width per node

const POINTER_COLORS = ["#818cf8", "#4ade80", "#f59e0b", "#00d4ff", "#fb7185"];

export function AnimatedLinkedList({ list }: { list: VizLinkedListState }) {
  const nodes     = list.nodes || [];
  const ptrMap    = list.pointers || {};
  const ptrNames  = Object.keys(ptrMap);

  // Which color each pointer gets
  const ptrColorMap: Record<string, string> = {};
  ptrNames.forEach((n, i) => { ptrColorMap[n] = POINTER_COLORS[i % POINTER_COLORS.length]; });

  // Pointer name → node index
  const ptrIdx: Record<string, number> = {};
  for (const [name, nodeId] of Object.entries(ptrMap)) {
    const idx = nodes.findIndex(n => n.id === nodeId);
    if (idx !== -1) ptrIdx[name] = idx;
  }

  // Detect cycle: does any node's nextId point to a node that appears earlier?
  const nodeIdxMap: Record<string, number> = {};
  nodes.forEach((n, i) => { nodeIdxMap[n.id] = i; });

  let cycleFrom = -1;
  let cycleTo   = -1;
  for (let i = 0; i < nodes.length; i++) {
    const nid = nodes[i].nextId;
    if (nid && nodeIdxMap[nid] !== undefined && nodeIdxMap[nid] <= i) {
      cycleFrom = i;
      cycleTo   = nodeIdxMap[nid];
      break;
    }
  }
  const hasCycle = cycleFrom !== -1;

  const arcH = 52;
  const svgW = PAD_X * 2 + nodes.length * UNIT + NULL_W;
  const svgH = PAD_Y + NODE_H + 22 + (hasCycle ? arcH : 0) + (ptrNames.length > 0 ? 32 : 0);

  let cycleArcPath = "";
  let cycleArcColor = "rgba(251,113,133,0.7)"; // pink
  if (hasCycle) {
    // Start: dot in pointer compartment of cycleFrom node
    const sx = PAD_X + cycleFrom * UNIT + NODE_W - 9;
    const sy = PAD_Y + NODE_H / 2;
    // End: bottom edge of cycleTo node (bottom middle)
    const ex = PAD_X + cycleTo * UNIT + (NODE_W - 18) / 2;
    const ey = PAD_Y + NODE_H;
    // Control points dip below
    const cy1 = PAD_Y + NODE_H + arcH;
    const cy2 = PAD_Y + NODE_H + arcH;
    cycleArcPath = `M ${sx} ${sy} C ${sx} ${cy1}, ${ex} ${cy2}, ${ex} ${ey}`;
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ width: 3, height: 14, borderRadius: 2, background: "#00d4ff" }} />
        <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#71718a", fontWeight: 700 }}>
          {list.label}
        </p>
        {hasCycle && (
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
            color: "#fb7185", background: "rgba(251,113,133,0.1)",
            border: "1px solid rgba(251,113,133,0.3)",
            borderRadius: 999, padding: "1px 8px", marginLeft: 8
          }}>
            CYCLE DETECTED
          </span>
        )}
      </div>

      <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} style={{ overflow: "visible" }}>
        <defs>
          <marker id="ll-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="5" markerHeight="5" orient="auto">
            <path d="M2 2L8 5L2 8" fill="none" stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.5" strokeLinecap="round"/>
          </marker>
          {POINTER_COLORS.map((c, i) => (
            <marker key={i} id={`ll-ptr-${i}`} viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="5" markerHeight="5" orient="auto">
              <path d="M2 2L8 5L2 8" fill="none" stroke={c}
                strokeWidth="1.5" strokeLinecap="round"/>
            </marker>
          ))}
          <marker id="ll-cycle-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M2 2L8 5L2 8" fill="none" stroke={cycleArcColor}
              strokeWidth="1.5" strokeLinecap="round"/>
          </marker>
        </defs>

        {/* Nodes */}
        {nodes.map((node, i) => {
          const x    = PAD_X + i * UNIT;
          const y    = PAD_Y;
          const bg   = node.active    ? "#1e1b4b"
                     : node.visited   ? "#0d1f0d"
                     : node.highlight ? "#1a1a0d"
                     : "#1a1a24";
          const strk = node.active    ? "#818cf8"
                     : node.visited   ? "#4ade80"
                     : node.highlight ? "#f59e0b"
                     : "rgba(255,255,255,0.08)";
          const tc   = node.active    ? "#a5b4fc"
                     : node.visited   ? "#4ade80"
                     : "#c8c8d8";

          const isCycleEntry = hasCycle && i === cycleTo;

          return (
            <g key={node.id}>
              {/* Node body — split: value | next ptr */}
              {/* Value box */}
              <rect x={x} y={y} width={NODE_W - 18} height={NODE_H} rx={8}
                fill={bg} stroke={isCycleEntry ? "#fb7185" : strk} strokeWidth={isCycleEntry ? 2 : 1.5}
                style={{ transition: "all 0.35s ease" }}
              />
              {/* Pointer compartment */}
              <rect x={x + NODE_W - 18} y={y} width={18} height={NODE_H}
                rx={0} fill={`${isCycleEntry ? "#fb7185" : strk}20`} stroke={isCycleEntry ? "#fb7185" : strk} strokeWidth={isCycleEntry ? 2 : 1.5}
                style={{ transition: "all 0.35s ease" }}
              />
              {/* Divider */}
              <line x1={x + NODE_W - 18} y1={y + 2} x2={x + NODE_W - 18} y2={y + NODE_H - 2}
                stroke={isCycleEntry ? "#fb7185" : strk} strokeWidth={1} opacity={0.5}
              />
              {/* Dot in pointer compartment */}
              <circle cx={x + NODE_W - 9} cy={y + NODE_H / 2} r={3}
                fill={node.nextId ? (isCycleEntry ? "#fb7185" : strk) : "rgba(255,255,255,0.15)"}
                style={{ transition: "fill 0.3s" }}
              />

              {/* Value text */}
              <text x={x + (NODE_W - 18) / 2} y={y + NODE_H / 2 + 1}
                textAnchor="middle" dominantBaseline="central"
                style={{ fontFamily: "'DM Mono',monospace", fontSize: 16, fontWeight: 700, fill: tc }}
              >
                {node.value}
              </text>

              {/* Arrow to next node */}
              {node.nextId && (() => {
                const toIdx = nodeIdxMap[node.nextId];
                // Only draw straight arrow for strictly forward edges
                if (toIdx !== undefined && toIdx === i + 1) {
                  return (
                    <line
                      x1={x + NODE_W - 9} y1={y + NODE_H / 2}
                      x2={x + NODE_W + ARROW_W - 4} y2={y + NODE_H / 2}
                      stroke="rgba(255,255,255,0.2)" strokeWidth={1.5}
                      markerEnd="url(#ll-arrow)"
                    />
                  );
                }
                return null;
              })()}

              {/* Glow ring for active */}
              {node.active && (
                <rect x={x - 3} y={y - 3} width={NODE_W + 6} height={NODE_H + 6} rx={11}
                  fill="none" stroke="#818cf8" strokeWidth={1} opacity={0.4}
                  style={{ filter: "drop-shadow(0 0 6px #818cf8)" }}
                />
              )}

              {isCycleEntry && (
                <rect x={x - 4} y={y - 4} width={NODE_W + 8} height={NODE_H + 8} rx={12}
                  fill="none" stroke="#fb7185" strokeWidth={1.5} opacity={0.5}
                  style={{ filter: "drop-shadow(0 0 8px #fb7185)", animation: "pulse 1.5s ease-in-out infinite" }}
                />
              )}
            </g>
          );
        })}

        {/* NULL terminator */}
        {nodes.length > 0 && !hasCycle && (
          <g transform={`translate(${PAD_X + nodes.length * UNIT}, ${PAD_Y})`}>
            <rect x={0} y={0} width={NULL_W} height={NODE_H} rx={8}
              fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)"
              strokeWidth={1} strokeDasharray="3 2"
            />
            <text x={NULL_W / 2} y={NODE_H / 2 + 1}
              textAnchor="middle" dominantBaseline="central"
              style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, fill: "#333352" }}
            >
              null
            </text>
          </g>
        )}

        {/* Cycle arc */}
        {hasCycle && (
          <g>
            <path
              d={cycleArcPath}
              fill="none"
              stroke={cycleArcColor}
              strokeWidth={2}
              strokeDasharray="5 3"
              markerEnd="url(#ll-cycle-arrow)"
              style={{ filter: "drop-shadow(0 0 4px rgba(251,113,133,0.5))" }}
            />
          </g>
        )}

        {/* Pointer labels above nodes */}
        {ptrNames.map((name, pi) => {
          const idx = ptrIdx[name];
          if (idx === undefined) return null;
          const x   = PAD_X + idx * UNIT + (NODE_W - 18) / 2;
          const col = ptrColorMap[name];
          const colorIdx = POINTER_COLORS.indexOf(col);
          
          const sameNodePtrs = ptrNames.slice(0, pi).filter(n => ptrIdx[n] === idx);
          const offsetY = sameNodePtrs.length * 22;

          return (
            <g key={name} transform={`translate(${x}, ${PAD_Y - 28 - offsetY})`}>
              <rect x={-16} y={0} width={32} height={16} rx={8}
                fill={`${col}20`} stroke={`${col}50`} strokeWidth={1}
              />
              <text x={0} y={9} textAnchor="middle" dominantBaseline="central"
                style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, fontWeight: 700, fill: col }}
              >
                {name}
              </text>
              {/* Arrow down to node */}
              <line x1={0} y1={16} x2={0} y2={24}
                stroke={col} strokeWidth={1.5}
                markerEnd={`url(#ll-ptr-${colorIdx})`}
              />
            </g>
          );
        })}

        {/* Index labels */}
        {nodes.map((_, i) => (
          <text key={i}
            x={PAD_X + i * UNIT + (NODE_W - 18) / 2}
            y={PAD_Y + NODE_H + 14}
            textAnchor="middle" dominantBaseline="central"
            style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, fill: "#333352" }}
          >
            {i}
          </text>
        ))}
      </svg>
    </div>
  );
}