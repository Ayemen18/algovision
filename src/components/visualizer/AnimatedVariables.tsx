"use client";

import type { VizVariable } from "@/types/visualizer";
import { motion, AnimatePresence } from "framer-motion";

export function AnimatedVariables({ variables }: { variables: VizVariable[] }) {
  if (!variables || variables.length === 0) return null;

  return (
    <div>
      <p style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555570", marginBottom: 8 }}>
        Variables
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <AnimatePresence mode="popLayout">
          {variables.map(v => (
            <motion.div
              key={v.name}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "6px 10px", borderRadius: 6,
                background: v.changed ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${v.changed ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.05)"}`,
              }}
            >
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#818cf8", fontWeight: 600 }}>
                {v.name}
              </span>
              <motion.span
                key={String(v.value)}
                initial={{ opacity: 0.5, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  fontFamily: "'DM Mono',monospace", fontSize: 11, fontWeight: 700,
                  color: v.changed ? "#00d4ff" : "#f1f1f5",
                }}
              >
                {String(v.value)}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}