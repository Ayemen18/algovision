"use client";

import type { VizStep } from "@/types/visualizer";
import { ArrayVisual }     from "./ArrayVisual";
import { HashMapVisual }   from "./HashMapVisual";
import { StackVisual }     from "./StackVisual";
import { VariablesPanel }  from "./VariablesPanel";
import { TreeVisual }      from "./TreeVisual";
import { GraphVisual }     from "./GraphVisual";
import { DpTableVisual }   from "./DpTableVisual";

interface VisualizationPanelProps {
  step:         VizStep;
  totalSteps:   number;
  currentIndex: number;
}

export function VisualizationPanel({ step, totalSteps, currentIndex }: VisualizationPanelProps) {
  const hasContent = step.array?.length || step.hashmap?.length || step.stack || step.variables?.length || step.tree?.length || step.graph?.length || step.dpTable?.length;

  return (
    <div style={{ height: "100%", overflowY: "auto", display: "flex", flexDirection: "column" }}>

      {/* Step indicator strip */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)",
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#71718a", fontWeight: 600 }}>
          Live state
        </span>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#454560" }}>
          {currentIndex + 1} of {totalSteps}
        </span>
      </div>

      <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 30 }}>
        {!hasContent && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, color: "#454560", gap: 8 }}>
            <span style={{ fontSize: 28 }}>○</span>
            <span style={{ fontSize: 13 }}>No data structures active at this step</span>
          </div>
        )}

        {step.array?.map(a => <ArrayVisual key={a.id} array={a} />)}
        {step.hashmap?.map(h => <HashMapVisual key={h.id} hashmap={h} />)}
        {step.tree?.map(t => <TreeVisual key={t.id} tree={t} />)}
        {step.graph?.map(g => <GraphVisual key={g.id} graph={g} />)}
        {step.dpTable?.map(d => <DpTableVisual key={d.id} dpTable={d} />)}
        
        {step.stack && <StackVisual stack={step.stack} />}
        {step.variables && <VariablesPanel variables={step.variables} />}

        {/* Fill remaining space with a subtle decorative pattern instead of dead space */}
        {hasContent && <div style={{ flex: 1, minHeight: 20 }} />}
      </div>
    </div>
  );
}