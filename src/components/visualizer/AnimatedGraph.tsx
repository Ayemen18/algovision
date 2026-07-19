"use client";

import { useMemo } from "react";
import type { VizGraphState } from "@/types/visualizer";

const NODE_R = 20;

// Auto-arrange nodes in a circle if no x/y provided
function getPositions(nodes: VizGraphState["nodes"], svgSize: number) {
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const r  = svgSize * 0.36;

  return nodes.map((node, i) => ({
    ...node,
    px: node.x !== undefined ? (node.x / 100) * svgSize : cx + r * Math.cos((2 * Math.PI * i) / nodes.length - Math.PI / 2),
    py: node.y !== undefined ? (node.y / 100) * svgSize : cy + r * Math.sin((2 * Math.PI * i) / nodes.length - Math.PI / 2),
  }));
}

export function AnimatedGraph({ graph }: { graph: VizGraphState }) {
  const SVG_SIZE = 280;
  const positioned = useMemo(() => getPositions(graph.nodes || [], SVG_SIZE), [graph.nodes]);
  const nodeById   = useMemo(() => {
    const m: Record<string, typeof positioned[0]> = {};
    positioned.forEach(n => { m[n.id] = n; });
    return m;
  }, [positioned]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ width: 3, height: 14, borderRadius: 2, background: "#00d4ff" }} />
        <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#71718a", fontWeight: 700 }}>
          {graph.label}
        </p>
        {/* Legend */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          {[
            { color: "#818cf8", label: "Active"   },
            { color: "#4ade80", label: "Visited"  },
            { color: "#f59e0b", label: "In queue" },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: l.color }} />
              <span style={{ fontSize: 10, color: "#555570" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      <svg width="100%" viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} style={{ overflow: "visible" }}>
        <defs>
          <marker id="g-arrow" viewBox="0 0 10 10" refX="8" refY="5"
            markerWidth="5" markerHeight="5" orient="auto">
            <path d="M2 2L8 5L2 8" fill="none" stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.5" strokeLinecap="round"/>
          </marker>
          <marker id="g-arrow-active" viewBox="0 0 10 10" refX="8" refY="5"
            markerWidth="5" markerHeight="5" orient="auto">
            <path d="M2 2L8 5L2 8" fill="none" stroke="#818cf8"
              strokeWidth="1.5" strokeLinecap="round"/>
          </marker>
        </defs>

        {/* Edges */}
        {(graph.edges || []).map((edge, i) => {
          const from = nodeById[edge.from];
          const to   = nodeById[edge.to];
          if (!from || !to) return null;

          // Offset endpoints by node radius so lines start/end at node boundary
          const dx     = to.px - from.px;
          const dy     = to.py - from.py;
          const len    = Math.sqrt(dx * dx + dy * dy);
          const ux     = dx / len;
          const uy     = dy / len;
          const x1     = from.px + ux * (NODE_R + 2);
          const y1     = from.py + uy * (NODE_R + 2);
          const x2     = to.px   - ux * (NODE_R + 6);
          const y2     = to.py   - uy * (NODE_R + 6);

          const isActive = edge.active;
          const stroke   = isActive ? "#818cf8" : "rgba(255,255,255,0.12)";

          return (
            <line key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={stroke} strokeWidth={isActive ? 2 : 1.5}
              markerEnd={graph.directed ? (isActive ? "url(#g-arrow-active)" : "url(#g-arrow)") : undefined}
              style={{
                filter:     isActive ? "drop-shadow(0 0 4px #818cf8)" : "none",
                transition: "stroke 0.3s, stroke-width 0.3s",
              }}
            />
          );
        })}

        {/* Nodes */}
        {positioned.map(node => {
          const fill   = node.active    ? "#1e1b4b"
                       : node.visited   ? "#052e16"
                       : node.inQueue   ? "#1c1400"
                       : "#1a1a24";
          const stroke = node.active    ? "#818cf8"
                       : node.visited   ? "#4ade80"
                       : node.inQueue   ? "#f59e0b"
                       : "rgba(255,255,255,0.1)";
          const tc     = node.active    ? "#a5b4fc"
                       : node.visited   ? "#4ade80"
                       : node.inQueue   ? "#f59e0b"
                       : "#c8c8d8";

          return (
            <g key={node.id} transform={`translate(${node.px},${node.py})`}
              style={{ transition: "transform 0.4s cubic-bezier(0.34,1.4,0.64,1)" }}>
              {(node.active || node.visited || node.inQueue) && (
                <circle r={NODE_R + 5} fill="none" stroke={stroke} strokeWidth={1.5}
                  opacity={0.3}
                  style={{ filter: `drop-shadow(0 0 8px ${stroke})` }}
                />
              )}
              <circle r={NODE_R} fill={fill} stroke={stroke} strokeWidth={2}
                style={{ transition: "all 0.35s ease" }}
              />
              <text textAnchor="middle" dominantBaseline="central" y={1}
                style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, fontWeight: 700, fill: tc }}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}