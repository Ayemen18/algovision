"use client";

import { useMemo } from "react";
import type { VizTreeState, VizTreeNode } from "@/types/visualizer";

const NODE_R   = 22;    // node radius
const LEVEL_H  = 70;    // vertical distance between levels
const MIN_SEP  = 56;    // min horizontal separation at leaf level

// ─── Tree layout using Reingold-Tilford-inspired approach ────────────────────

interface LayoutNode {
  node:     VizTreeNode;
  x:        number;
  y:        number;
  children: LayoutNode[];
}

function computeLayout(
  nodeId: string | null,
  nodes:  Record<string, VizTreeNode>,
  depth:  number,
  offset: { val: number }
): LayoutNode | null {
  if (!nodeId || !nodes[nodeId]) return null;

  const node  = nodes[nodeId];
  const left  = computeLayout(node.leftId,  nodes, depth + 1, offset);
  const right = computeLayout(node.rightId, nodes, depth + 1, offset);

  let x: number;
  if (!left && !right) {
    x = offset.val;
    offset.val += MIN_SEP;
  } else if (!left) {
    x = right!.x - MIN_SEP / 2;
    if (x < offset.val) { const shift = offset.val - x; shiftTree(right!, shift); x = offset.val; }
    offset.val = right!.x + MIN_SEP / 2;
  } else if (!right) {
    x = left.x + MIN_SEP / 2;
    offset.val = x + MIN_SEP / 2;
  } else {
    x = (left.x + right.x) / 2;
    offset.val = right.x + MIN_SEP / 2;
  }

  return { node, x, y: depth * LEVEL_H + NODE_R + 10, children: [left, right].filter(Boolean) as LayoutNode[] };
}

function shiftTree(node: LayoutNode, delta: number) {
  node.x += delta;
  node.children.forEach(c => shiftTree(c, delta));
}

function flattenLayout(node: LayoutNode | null): LayoutNode[] {
  if (!node) return [];
  return [node, ...node.children.flatMap(flattenLayout)];
}

function collectEdges(node: LayoutNode | null): { x1:number; y1:number; x2:number; y2:number; active:boolean }[] {
  if (!node) return [];
  const edges: { x1:number; y1:number; x2:number; y2:number; active:boolean }[] = [];
  for (const child of node.children) {
    edges.push({ x1: node.x, y1: node.y, x2: child.x, y2: child.y, active: !!child.node.active });
    edges.push(...collectEdges(child));
  }
  return edges;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function AnimatedTree({ tree }: { tree: VizTreeState }) {
  const { allNodes, edges, svgW, svgH } = useMemo(() => {
    const offset   = { val: NODE_R + 10 };
    const root     = computeLayout(tree.rootId, tree.nodes || {}, 0, offset);
    if (!root) return { allNodes: [], edges: [], svgW: 100, svgH: 60 };

    const flat  = flattenLayout(root);
    const edges = collectEdges(root);

    // Normalize to fit in SVG
    const minX  = Math.min(...flat.map(n => n.x)) - NODE_R - 10;
    const maxX  = Math.max(...flat.map(n => n.x)) + NODE_R + 10;
    const maxY  = Math.max(...flat.map(n => n.y)) + NODE_R + 14;

    const normalize = (n: LayoutNode) => ({ ...n, x: n.x - minX });
    const normFlat  = flat.map(normalize);
    const normEdges = edges.map(e => ({ ...e, x1: e.x1 - minX, x2: e.x2 - minX }));

    return {
      allNodes: normFlat,
      edges:    normEdges,
      svgW:     maxX - minX,
      svgH:     maxY,
    };
  }, [tree]);

  if (allNodes.length === 0) return null;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ width: 3, height: 14, borderRadius: 2, background: "#f59e0b" }} />
        <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#71718a", fontWeight: 700 }}>
          {tree.label}
        </p>
      </div>

      <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} style={{ overflow: "visible" }}>
        <defs>
          <marker id="tree-arrow" viewBox="0 0 10 10" refX="8" refY="5"
            markerWidth="4" markerHeight="4" orient="auto">
            <circle cx="5" cy="5" r="2" fill="rgba(255,255,255,0.15)"/>
          </marker>
        </defs>

        {/* Edges */}
        {edges.map((e, i) => (
          <line key={i}
            x1={e.x1} y1={e.y1 + NODE_R} x2={e.x2} y2={e.y2 - NODE_R}
            stroke={e.active ? "#818cf8" : "rgba(255,255,255,0.1)"}
            strokeWidth={e.active ? 2 : 1.5}
            style={{
              filter:     e.active ? "drop-shadow(0 0 4px #818cf8)" : "none",
              transition: "stroke 0.3s ease, stroke-width 0.3s",
            }}
          />
        ))}

        {/* Nodes */}
        {allNodes.map(({ node, x, y }) => {
          const isNull     = node.value === null;
          const isActive   = node.active;
          const isVisited  = node.visited;
          const isHighlight= node.highlight;

          const fill   = isActive    ? "#1e1b4b"
                       : isVisited   ? "#052e16"
                       : isHighlight ? "#1c1a0f"
                       : "#1a1a24";
          const stroke = isActive    ? "#818cf8"
                       : isVisited   ? "#4ade80"
                       : isHighlight ? "#f59e0b"
                       : "rgba(255,255,255,0.1)";
          const tc     = isActive    ? "#a5b4fc"
                       : isVisited   ? "#4ade80"
                       : isHighlight ? "#f59e0b"
                       : "#c8c8d8";

          if (isNull) return (
            <g key={node.id} transform={`translate(${x},${y})`}>
              <circle r={NODE_R * 0.6} fill="rgba(255,255,255,0.02)"
                stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="2 2"/>
              <text textAnchor="middle" dominantBaseline="central"
                style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, fill: "#333352" }}>
                null
              </text>
            </g>
          );

          return (
            <g key={node.id} transform={`translate(${x},${y})`}
              style={{ transition: "transform 0.4s cubic-bezier(0.34,1.4,0.64,1)" }}>
              {/* Glow halo */}
              {(isActive || isVisited) && (
                <circle r={NODE_R + 4} fill="none" stroke={stroke} strokeWidth={1.5}
                  opacity={0.35}
                  style={{ filter: `drop-shadow(0 0 8px ${stroke})` }}
                />
              )}
              {/* Node circle */}
              <circle r={NODE_R} fill={fill} stroke={stroke} strokeWidth={2}
                style={{ transition: "fill 0.35s ease, stroke 0.35s ease" }}
              />
              {/* Value */}
              <text textAnchor="middle" dominantBaseline="central" y={1}
                style={{ fontFamily: "'DM Mono',monospace", fontSize: 14, fontWeight: 700, fill: tc,
                  transition: "fill 0.3s" }}
              >
                {node.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}