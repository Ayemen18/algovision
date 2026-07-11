"use client";

import type { VizStep } from "@/types/visualizer";
import { AnimatedArray }     from "./AnimatedArray";
import { AnimatedHashMap }   from "./AnimatedHashMap";
import { StackVisual }       from "./StackVisual";       // Keeping non-animated ones as they weren't requested to be changed
import { AnimatedVariables } from "./AnimatedVariables";
import { TreeVisual }        from "./TreeVisual";
import { GraphVisual }       from "./GraphVisual";
import { DpTableVisual }     from "./DpTableVisual";
import { motion, AnimatePresence } from "framer-motion";

interface VisualizationPanelProps {
  step:         VizStep;
  totalSteps:   number;
  currentIndex: number;
}

export function AnimatedVisualizationPanel({ step, totalSteps, currentIndex }: VisualizationPanelProps) {
  const hasContent = step.array?.length || step.hashmap?.length || step.stack || step.variables?.length || step.tree?.length || step.graph?.length || step.dpTable?.length;

  return (
    <div style={{ height: "100%", overflowY: "auto", display: "flex", flexDirection: "column" }}>

      {/* Step indicator strip */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)",
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#71718a", fontWeight: 600 }}>
          Live state
        </span>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "#454560" }}>
          {currentIndex + 1} of {totalSteps}
        </span>
      </div>

      <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 20 }}>
        <AnimatePresence mode="popLayout">
          {!hasContent && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, color: "#454560", gap: 6 }}
            >
              <span style={{ fontSize: 24 }}>○</span>
              <span style={{ fontSize: 11 }}>No data structures active at this step</span>
            </motion.div>
          )}

          {step.array?.map(a => <AnimatedArray key={a.id} array={a} />)}
          {step.hashmap?.map(h => <AnimatedHashMap key={h.id} hashmap={h} />)}
          {step.tree?.map(t => <TreeVisual key={t.id} tree={t} />)}
          {step.graph?.map(g => <GraphVisual key={g.id} graph={g} />)}
          {step.dpTable?.map(d => <DpTableVisual key={d.id} dpTable={d} />)}
          
          {step.stack && <StackVisual stack={step.stack} />}
          {step.variables && <AnimatedVariables variables={step.variables} />}
        </AnimatePresence>

        {/* Fill remaining space with a subtle decorative pattern instead of dead space */}
        {hasContent && <div style={{ flex: 1, minHeight: 16 }} />}
      </div>
    </div>
  );
}