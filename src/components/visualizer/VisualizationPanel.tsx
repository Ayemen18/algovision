"use client";

import type { VizStep } from "@/types/visualizer";
import { ArrayVisual }     from "./ArrayVisual";
import { HashMapVisual }   from "./HashMapVisual";
import { StackVisual }     from "./StackVisual";
import { VariablesPanel }  from "./VariablesPanel";

export function VisualizationPanel({ step }: { step: VizStep }) {
  const hasContent = step.array?.length || step.hashmap?.length || step.stack || step.variables?.length;

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 28 }}>

      {!hasContent && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#3a3a50", fontSize: 13 }}>
          No state to display for this step
        </div>
      )}

      {step.array?.map(a => <ArrayVisual key={a.id} array={a} />)}
      {step.hashmap?.map(h => <HashMapVisual key={h.id} hashmap={h} />)}
      {step.stack && <StackVisual stack={step.stack} />}
      {step.variables && <VariablesPanel variables={step.variables} />}
    </div>
  );
}