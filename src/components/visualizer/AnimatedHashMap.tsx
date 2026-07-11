"use client";

import type { VizHashMapState } from "@/types/visualizer";
import { motion } from "framer-motion";

export function AnimatedHashMap({ hashmap }: { hashmap: VizHashMapState }) {
  const entries = hashmap.entries;

  // Scaled down layout calculations
  const cellWidth = 48;
  const valWidth = 48;
  const cellHeight = 28;
  const cellGap = 12;
  const rowGap = 14;
  const startX = 15;
  const startY = 15;

  // Calculate grid layout (e.g., max 4 items per row)
  const itemsPerRow = 5; // fit more items
  const itemWidth = cellWidth + valWidth + 20; // 20 for the arrow space
  const totalWidth = startX * 2 + Math.min(entries.length, itemsPerRow) * (itemWidth + cellGap);
  const totalHeight = startY * 2 + Math.ceil(entries.length / itemsPerRow) * (cellHeight + rowGap) + 15;

  return (
    <div>
      <p style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555570", marginBottom: 8 }}>
        {hashmap.label} {entries.length === 0 && <span style={{ color: "#3a3a50" }}>(empty)</span>}
      </p>

      {entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            height: 40, borderRadius: 8, border: "1px dashed rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 11, color: "#3a3a50" }}>No entries yet</span>
        </motion.div>
      ) : (
        <div style={{ position: "relative", width: "100%", overflowX: "auto" }}>
          <svg 
            width={Math.max(totalWidth, 300)} 
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
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {/* Key Box */}
                  <rect
                    width={cellWidth}
                    height={cellHeight}
                    rx={5}
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
                    fontSize={11}
                    fontWeight="bold"
                    fontFamily="'DM Mono', monospace"
                  >
                    {key}
                  </text>

                  {/* Flow Arrow */}
                  <path
                    d={`M${cellWidth + 2},${cellHeight / 2} L${cellWidth + 16},${cellHeight / 2}`}
                    stroke={isHighlight ? "rgba(0,255,136,0.5)" : "#555570"}
                    strokeWidth={1.5}
                    markerEnd={`url(#arrowhead-${isHighlight ? 'highlight' : 'normal'})`}
                  />

                  {/* Value Box */}
                  <rect
                    x={cellWidth + 20}
                    width={valWidth}
                    height={cellHeight}
                    rx={5}
                    fill="rgba(255,255,255,0.03)"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={1}
                  />
                  <text
                    x={cellWidth + 20 + valWidth / 2}
                    y={cellHeight / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#f1f1f5"
                    fontSize={11}
                    fontFamily="'DM Mono', monospace"
                  >
                    {val}
                  </text>
                </motion.g>
              );
            })}

            {/* Definitions for arrowheads */}
            <defs>
              <marker id="arrowhead-normal" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#555570" />
              </marker>
              <marker id="arrowhead-highlight" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5 Z" fill="rgba(0,255,136,0.8)" />
              </marker>
            </defs>
          </svg>
        </div>
      )}
    </div>
  );
}