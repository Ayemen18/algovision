"use client";

import type { VizHashMapState } from "@/types/visualizer";
import { motion } from "framer-motion";

export function HashMapVisual({ hashmap }: { hashmap: VizHashMapState }) {
  const entries = hashmap.entries;

  // Layout calculations
  const cellWidth = 70;
  const valWidth = 70;
  const cellHeight = 40;
  const cellGap = 16;
  const rowGap = 20;
  const startX = 20;
  const startY = 20;

  // Calculate grid layout (e.g., max 4 items per row)
  const itemsPerRow = 4;
  const itemWidth = cellWidth + valWidth + 24; // 24 for the arrow space
  const totalWidth = startX * 2 + Math.min(entries.length, itemsPerRow) * (itemWidth + cellGap);
  const totalHeight = startY * 2 + Math.ceil(entries.length / itemsPerRow) * (cellHeight + rowGap) + 30;

  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555570", marginBottom: 10 }}>
        {hashmap.label} {entries.length === 0 && <span style={{ color: "#3a3a50" }}>(empty)</span>}
      </p>

      {entries.length === 0 ? (
        <div style={{
          height: 52, borderRadius: 10, border: "1px dashed rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 12, color: "#3a3a50" }}>No entries yet</span>
        </div>
      ) : (
        <div style={{ position: "relative", width: "100%", overflowX: "auto" }}>
          <svg 
            width={Math.max(totalWidth, 400)} 
            height={totalHeight} 
            style={{ minWidth: totalWidth }}
          >
            {entries.map(([key, val], idx) => {
              const isHighlight = hashmap.highlightKey === key;
              
              const row = Math.floor(idx / itemsPerRow);
              const col = idx % itemsPerRow;
              
              const x = startX + col * (itemWidth + cellGap);
              const y = startY + row * (cellHeight + rowGap);

              const keyBg = isHighlight ? "rgba(0,255,136,0.15)" : "rgba(99,102,241,0.1)";
              const keyStroke = isHighlight ? "rgba(0,255,136,0.5)" : "rgba(255,255,255,0.08)";
              const keyColor = isHighlight ? "#00ff88" : "#818cf8";
              const scale = isHighlight ? 1.05 : 1;

              return (
                <motion.g
                  key={key}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale, x, y }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {/* Key Box */}
                  <rect
                    width={cellWidth}
                    height={cellHeight}
                    rx={6}
                    fill={keyBg}
                    stroke={keyStroke}
                    strokeWidth={1}
                  />
                  <text
                    x={cellWidth / 2}
                    y={cellHeight / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={keyColor}
                    fontSize={13}
                    fontWeight="bold"
                    fontFamily="'DM Mono', monospace"
                  >
                    {key}
                  </text>

                  {/* Flow Arrow */}
                  <path
                    d={`M${cellWidth + 2},${cellHeight / 2} L${cellWidth + 18},${cellHeight / 2}`}
                    stroke={isHighlight ? "rgba(0,255,136,0.5)" : "#555570"}
                    strokeWidth={1.5}
                    markerEnd={`url(#arrowhead-${isHighlight ? 'highlight' : 'normal'})`}
                  />

                  {/* Value Box */}
                  <rect
                    x={cellWidth + 24}
                    width={valWidth}
                    height={cellHeight}
                    rx={6}
                    fill="rgba(255,255,255,0.03)"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={1}
                  />
                  <text
                    x={cellWidth + 24 + valWidth / 2}
                    y={cellHeight / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#f1f1f5"
                    fontSize={13}
                    fontFamily="'DM Mono', monospace"
                  >
                    {val}
                  </text>
                </motion.g>
              );
            })}

            {/* Definitions for arrowheads */}
            <defs>
              <marker id="arrowhead-normal" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#555570" />
              </marker>
              <marker id="arrowhead-highlight" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="rgba(0,255,136,0.8)" />
              </marker>
            </defs>
          </svg>
        </div>
      )}
    </div>
  );
}