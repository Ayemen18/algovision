"use client";

import type { VizArrayState } from "@/types/visualizer";
import { motion } from "framer-motion";

export function ArrayVisual({ array }: { array: VizArrayState }) {
  const pointerEntries = Object.entries(array.pointers || {});

  // Layout calculations
  const cellWidth = 54;
  const cellHeight = 54;
  const cellGap = 8;
  const startX = 20;
  const startY = 30;
  
  // Array width depends on values
  const totalWidth = startX * 2 + array.values.length * (cellWidth + cellGap);
  const totalHeight = 140 + pointerEntries.length * 28;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#6366f1" }} />
        <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#71718a", fontWeight: 600 }}>
          {array.label}
        </p>
      </div>

      <div style={{ position: "relative", width: "100%", overflowX: "auto" }}>
        <svg 
          width={Math.max(totalWidth, 500)} 
          height={totalHeight} 
          style={{ minWidth: totalWidth }}
        >
          {array.values.map((val, idx) => {
            const isHighlight = array.highlight?.includes(idx);
            const isSuccess   = array.success?.includes(idx);

            let bgFill = "rgba(255,255,255,0.025)";
            let strokeColor = "rgba(255,255,255,0.08)";
            let textColor = "#9898b0";
            let scale = 1;

            if (isSuccess) {
              bgFill = "rgba(0,255,136,0.15)";
              strokeColor = "rgba(0,255,136,0.55)"; 
              textColor = "#4ade80";
              scale = 1.05;
            } else if (isHighlight) {
              bgFill = "rgba(99,102,241,0.2)";
              strokeColor = "rgba(99,102,241,0.6)"; 
              textColor = "#a5b4fc";
              scale = 1.05;
            }

            const x = startX + idx * (cellWidth + cellGap);
            const y = startY;

            return (
              <motion.g 
                key={idx}
                initial={{ opacity: 0, y: y - 10 }}
                animate={{ opacity: 1, x, y, scale }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {/* Cell Background */}
                <motion.rect
                  width={cellWidth}
                  height={cellHeight}
                  rx={10}
                  fill={bgFill}
                  stroke={strokeColor}
                  strokeWidth={1}
                />
                
                {/* Cell Value */}
                <motion.text
                  x={cellWidth / 2}
                  y={cellHeight / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={textColor}
                  fontSize={16}
                  fontWeight="bold"
                  fontFamily="'DM Mono', monospace"
                >
                  {val}
                </motion.text>

                {/* Cell Index */}
                <text
                  x={cellWidth / 2}
                  y={cellHeight + 16}
                  textAnchor="middle"
                  fill="#454560"
                  fontSize={10}
                  fontFamily="'DM Mono', monospace"
                >
                  {idx}
                </text>
              </motion.g>
            );
          })}

          {/* Render pointers */}
          {pointerEntries.map(([pname, pidx], pi) => {
            const x = startX + pidx * (cellWidth + cellGap) + cellWidth / 2;
            const y = startY + cellHeight + 35 + pi * 25;
            
            return (
              <motion.g
                key={pname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x, y }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {/* Pointer Line */}
                <path 
                  d={`M0,-8 L0,-20`} 
                  stroke="#818cf8" 
                  strokeWidth={1.5}
                  strokeDasharray="2 2"
                />
                
                {/* Pointer Arrowhead */}
                <path 
                  d={`M-3,-20 L3,-20 L0,-25 Z`} 
                  fill="#818cf8" 
                />

                {/* Pointer Label Background */}
                <rect
                  x={-12 - (pname.length * 3)}
                  y={-5}
                  width={24 + (pname.length * 6)}
                  height={16}
                  rx={4}
                  fill="rgba(99,102,241,0.18)"
                  stroke="rgba(99,102,241,0.3)"
                  strokeWidth={1}
                />
                
                {/* Pointer Label */}
                <text
                  x={0}
                  y={5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#a5b4fc"
                  fontSize={10}
                  fontWeight="bold"
                  fontFamily="'DM Mono', monospace"
                >
                  {pname}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}