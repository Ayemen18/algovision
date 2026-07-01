"use client";

import type { VizDpTableState } from "@/types/visualizer";
import { motion } from "framer-motion";

export function DpTableVisual({ dpTable }: { dpTable: VizDpTableState }) {
  const cellWidth = 50;
  const cellHeight = 50;
  const padding = 20;

  const totalWidth = dpTable.cols * cellWidth + padding * 2;
  const totalHeight = dpTable.rows * cellHeight + padding * 2;

  // Helper to check if a cell is in a list
  const isCellInList = (r: number, c: number, list?: { r: number, c: number }[]) => {
    return list?.some(item => item.r === r && item.c === c);
  };

  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555570", marginBottom: 10 }}>
        {dpTable.label} {dpTable.rows === 0 && <span style={{ color: "#3a3a50" }}>(empty)</span>}
      </p>

      {dpTable.rows > 0 ? (
        <div style={{ position: "relative", width: "100%", overflowX: "auto", display: "flex", justifyContent: "flex-start" }}>
          <svg 
            width={totalWidth} 
            height={totalHeight}
            style={{ minWidth: totalWidth }}
          >
            {dpTable.data.map((row, rIdx) => (
              row.map((val, cIdx) => {
                const isHighlight = isCellInList(rIdx, cIdx, dpTable.highlight);
                const isSuccess = isCellInList(rIdx, cIdx, dpTable.success);

                let bgFill = "rgba(255,255,255,0.025)";
                let strokeColor = "rgba(255,255,255,0.1)";
                let textColor = "#9898b0";
                let scale = 1;
                let zIndex = 0;

                if (isSuccess) {
                  bgFill = "rgba(0,255,136,0.15)";
                  strokeColor = "rgba(0,255,136,0.55)"; 
                  textColor = "#4ade80";
                  scale = 1.05;
                  zIndex = 10;
                } else if (isHighlight) {
                  bgFill = "rgba(99,102,241,0.2)";
                  strokeColor = "rgba(99,102,241,0.6)"; 
                  textColor = "#a5b4fc";
                  scale = 1.05;
                  zIndex = 10;
                }

                const x = padding + cIdx * cellWidth;
                const y = padding + rIdx * cellHeight;

                return (
                  <motion.g
                    key={`cell-${rIdx}-${cIdx}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale, x, y }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    style={{ zIndex }}
                  >
                    <motion.rect
                      width={cellWidth}
                      height={cellHeight}
                      rx={4}
                      fill={bgFill}
                      stroke={strokeColor}
                      strokeWidth={1}
                    />
                    
                    <text
                      x={cellWidth / 2}
                      y={cellHeight / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={textColor}
                      fontSize={14}
                      fontWeight="bold"
                      fontFamily="'DM Mono', monospace"
                    >
                      {val}
                    </text>

                    {/* Small coordinate labels for debugging / context */}
                    <text
                      x={4}
                      y={10}
                      fill="rgba(255,255,255,0.2)"
                      fontSize={8}
                      fontFamily="'DM Mono', monospace"
                    >
                      {rIdx},{cIdx}
                    </text>
                  </motion.g>
                );
              })
            ))}
          </svg>
        </div>
      ) : (
        <div style={{
          height: 52, borderRadius: 10, border: "1px dashed rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 12, color: "#3a3a50" }}>Table is empty</span>
        </div>
      )}
    </div>
  );
}
