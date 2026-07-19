"use client";

import { useEffect, useRef } from "react";
import type { VizDPTableState } from "@/types/visualizer";

const CELL_W  = 48;
const CELL_H  = 40;
const LABEL_W = 36;
const LABEL_H = 28;
const GAP     = 3;

function cellColor(val: number | string | null, isHighlight: boolean, isFilled: boolean): {
  bg: string; stroke: string; text: string; shadow: string;
} {
  if (isHighlight) return {
    bg: "#1e1b4b", stroke: "#818cf8",
    text: "#a5b4fc", shadow: "drop-shadow(0 0 6px #818cf8)",
  };
  if (isFilled) return {
    bg: "#052e16", stroke: "#4ade80",
    text: "#4ade80", shadow: "none",
  };
  if (val === null) return {
    bg: "#111118", stroke: "rgba(255,255,255,0.04)",
    text: "#333352", shadow: "none",
  };
  return {
    bg: "#1a1a24", stroke: "rgba(255,255,255,0.08)",
    text: "#c8c8d8", shadow: "none",
  };
}

export function AnimatedDPTable({ table }: { table: VizDPTableState }) {
  const rows     = table.rows;
  const numRows  = rows.length;
  const numCols  = rows[0]?.length || 0;
  const hasRowL  = (table.rowLabels?.length || 0) > 0;
  const hasColL  = (table.colLabels?.length || 0) > 0;

  const offsetX  = hasRowL ? LABEL_W + GAP : 0;
  const offsetY  = hasColL ? LABEL_H + GAP : 0;
  const svgW     = offsetX + numCols * (CELL_W + GAP) - GAP + 4;
  const svgH     = offsetY + numRows * (CELL_H + GAP) - GAP + 4;

  const prevRef  = useRef<VizDPTableState | null>(null);

  useEffect(() => {
    return () => { prevRef.current = table; };
  }, [table]);

  if (numRows === 0 || numCols === 0) return null;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ width: 3, height: 14, borderRadius: 2, background: "#00ff88" }} />
        <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#71718a", fontWeight: 700 }}>
          {table.label}
        </p>
        {/* Legend */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          {[
            { color: "#818cf8", label: "Computing" },
            { color: "#4ade80", label: "Filled"    },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: 2, background: l.color }} />
              <span style={{ fontSize: 10, color: "#555570" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <svg width={svgW} viewBox={`0 0 ${svgW} ${svgH}`} style={{ overflow: "visible", display: "block" }}>

          {/* Column labels */}
          {hasColL && table.colLabels!.map((lbl, ci) => (
            <g key={`cl-${ci}`} transform={`translate(${offsetX + ci * (CELL_W + GAP)}, 0)`}>
              <rect x={0} y={0} width={CELL_W} height={LABEL_H} rx={5}
                fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth={1}
              />
              <text x={CELL_W / 2} y={LABEL_H / 2 + 1}
                textAnchor="middle" dominantBaseline="central"
                style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, fontWeight: 600, fill: "#555570" }}
              >
                {lbl}
              </text>
            </g>
          ))}

          {/* Row labels */}
          {hasRowL && table.rowLabels!.map((lbl, ri) => (
            <g key={`rl-${ri}`} transform={`translate(0, ${offsetY + ri * (CELL_H + GAP)})`}>
              <rect x={0} y={0} width={LABEL_W} height={CELL_H} rx={5}
                fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth={1}
              />
              <text x={LABEL_W / 2} y={CELL_H / 2 + 1}
                textAnchor="middle" dominantBaseline="central"
                style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, fontWeight: 600, fill: "#555570" }}
              >
                {lbl}
              </text>
            </g>
          ))}

          {/* Cells */}
          {rows.map((row, ri) =>
            row.map((val, ci) => {
              const isHighlight = table.highlightCell?.[0] === ri && table.highlightCell?.[1] === ci;
              const isFilled    = table.filledCell?.[0] === ri    && table.filledCell?.[1] === ci;
              const wasNull     = prevRef.current?.rows[ri]?.[ci] === null && val !== null;
              const c           = cellColor(val, isHighlight, isFilled || wasNull);

              return (
                <g key={`${ri}-${ci}`}
                  transform={`translate(${offsetX + ci * (CELL_W + GAP)}, ${offsetY + ri * (CELL_H + GAP)})`}
                  style={{ transition: "transform 0.3s ease" }}
                >
                  {/* Glow for highlight */}
                  {isHighlight && (
                    <rect x={-2} y={-2} width={CELL_W + 4} height={CELL_H + 4} rx={8}
                      fill="none" stroke="#818cf8" strokeWidth={1.5} opacity={0.45}
                      style={{ filter: "drop-shadow(0 0 6px #818cf8)" }}
                    />
                  )}
                  <rect x={0} y={0} width={CELL_W} height={CELL_H} rx={6}
                    fill={c.bg} stroke={c.stroke} strokeWidth={1.5}
                    style={{ transition: "fill 0.35s ease, stroke 0.35s ease", filter: c.shadow }}
                  />
                  <text x={CELL_W / 2} y={CELL_H / 2 + 1}
                    textAnchor="middle" dominantBaseline="central"
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: val !== null && String(val).length > 3 ? 10 : 14,
                      fontWeight: 700,
                      fill: c.text,
                      transition: "fill 0.3s",
                    }}
                  >
                    {val === null ? "" : String(val)}
                  </text>
                </g>
              );
            })
          )}
        </svg>
      </div>
    </div>
  );
}