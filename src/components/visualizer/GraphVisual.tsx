"use client";

import { useMemo, useEffect, useState } from "react";
import type { VizGraphState, VizGraphNode } from "@/types/visualizer";
import { motion } from "framer-motion";

interface PositionedGraphNode extends VizGraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function GraphVisual({ graph }: { graph: VizGraphState }) {
  const width = 400;
  const height = 300;
  const nodeRadius = 20;

  // Use state to trigger re-renders if we wanted to animate the layout, 
  // but computing it once in useMemo is much faster for simple graphs.
  const [positions, setPositions] = useState<Record<string, {x: number, y: number}>>({});

  useEffect(() => {
    if (!graph.nodes || graph.nodes.length === 0) return;

    // Initialize positions in a circle to avoid same-spot repulsion explosion
    const nodes: PositionedGraphNode[] = graph.nodes.map((n, i) => {
      const angle = (i / graph.nodes.length) * Math.PI * 2;
      return {
        ...n,
        x: width / 2 + Math.cos(angle) * (width / 4),
        y: height / 2 + Math.sin(angle) * (height / 4),
        vx: 0,
        vy: 0
      };
    });

    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    // Simple Fruchterman-Reingold force-directed layout
    const area = width * height;
    const k = Math.sqrt(area / nodes.length);
    let temperature = width / 10;
    const iterations = 100;

    for (let iter = 0; iter < iterations; iter++) {
      // Calculate repulsive forces
      for (let i = 0; i < nodes.length; i++) {
        const u = nodes[i];
        u.vx = 0;
        u.vy = 0;
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const v = nodes[j];
          const dx = u.x - v.x;
          const dy = u.y - v.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (k * k) / distance;
          u.vx += (dx / distance) * force;
          u.vy += (dy / distance) * force;
        }
      }

      // Calculate attractive forces
      for (const edge of graph.edges) {
        const u = nodeMap.get(edge.source);
        const v = nodeMap.get(edge.target);
        if (!u || !v) continue;

        const dx = u.x - v.x;
        const dy = u.y - v.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (distance * distance) / k;
        
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        
        u.vx -= fx;
        u.vy -= fy;
        v.vx += fx;
        v.vy += fy;
      }

      // Gravity towards center
      for (const u of nodes) {
        const dx = (width / 2) - u.x;
        const dy = (height / 2) - u.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        u.vx += (dx / distance) * (k / 10);
        u.vy += (dy / distance) * (k / 10);
      }

      // Update positions
      for (const u of nodes) {
        const velocity = Math.sqrt(u.vx * u.vx + u.vy * u.vy) || 1;
        const cappedV = Math.min(velocity, temperature);
        u.x += (u.vx / velocity) * cappedV;
        u.y += (u.vy / velocity) * cappedV;

        // Keep within bounds
        u.x = Math.max(nodeRadius + 10, Math.min(width - nodeRadius - 10, u.x));
        u.y = Math.max(nodeRadius + 10, Math.min(height - nodeRadius - 10, u.y));
      }

      // Cool down
      temperature *= 0.95;
    }

    const newPositions: Record<string, {x: number, y: number}> = {};
    for (const u of nodes) {
      newPositions[u.id] = { x: u.x, y: u.y };
    }
    setPositions(newPositions);
  }, [graph]);

  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555570", marginBottom: 10 }}>
        {graph.label} {(!graph.nodes || graph.nodes.length === 0) && <span style={{ color: "#3a3a50" }}>(empty)</span>}
      </p>

      {graph.nodes && graph.nodes.length > 0 ? (
        <div style={{ position: "relative", width: "100%", overflowX: "auto", display: "flex", justifyContent: "center" }}>
          <svg 
            width={width} 
            height={height}
            style={{ minWidth: width, background: "rgba(0,0,0,0.1)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <defs>
              <marker id={`arrowhead-normal-${graph.id}`} markerWidth="8" markerHeight="8" refX="22" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="rgba(255,255,255,0.2)" />
              </marker>
              <marker id={`arrowhead-highlight-${graph.id}`} markerWidth="8" markerHeight="8" refX="22" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="rgba(99,102,241,0.8)" />
              </marker>
            </defs>

            {/* Draw edges */}
            {graph.edges.map((edge, idx) => {
              const u = positions[edge.source];
              const v = positions[edge.target];
              if (!u || !v) return null;

              const isHighlight = edge.highlight;
              
              return (
                <motion.line
                  key={`edge-${edge.source}-${edge.target}-${idx}`}
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke={isHighlight ? "rgba(99,102,241,0.6)" : "rgba(255,255,255,0.15)"}
                  strokeWidth={isHighlight ? 3 : 2}
                  markerEnd={graph.directed ? `url(#arrowhead-${isHighlight ? 'highlight' : 'normal'}-${graph.id})` : undefined}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }} // Wait for positions to settle visually
                />
              );
            })}

            {/* Draw nodes */}
            {graph.nodes.map(node => {
              const pos = positions[node.id];
              if (!pos) return null;

              const isHighlight = node.highlight;
              const bgFill = isHighlight ? "rgba(99,102,241,0.2)" : "rgba(30,30,40,1)";
              const strokeColor = isHighlight ? "rgba(99,102,241,0.8)" : "rgba(255,255,255,0.2)";
              const textColor = isHighlight ? "#a5b4fc" : "#e2e2e8";
              const scale = isHighlight ? 1.1 : 1;

              return (
                <motion.g
                  key={`node-${node.id}`}
                  initial={{ opacity: 0, x: width / 2, y: height / 2 }}
                  animate={{ opacity: 1, scale, x: pos.x, y: pos.y }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <circle
                    r={nodeRadius}
                    fill={bgFill}
                    stroke={strokeColor}
                    strokeWidth={2}
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={textColor}
                    fontSize={14}
                    fontWeight="bold"
                    fontFamily="'DM Mono', monospace"
                  >
                    {node.val ?? node.id}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </div>
      ) : (
        <div style={{
          height: 52, borderRadius: 10, border: "1px dashed rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 12, color: "#3a3a50" }}>Graph is empty</span>
        </div>
      )}
    </div>
  );
}
