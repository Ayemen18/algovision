"use client";

import { useEffect, useRef } from "react";
import { useVisualizerStore } from "@/store/visualizerStore";
import { motion } from "framer-motion";

const KIND_DOT_COLOR: Record<string, string> = {
  normal: "#818cf8", compare: "#fbbf24", success: "#4ade80", error: "#fb7185",
};

export function AnimatedPlaybackControls() {
  const {
    trace, currentStep, isPlaying, speed,
    nextStep, prevStep, togglePlay, goToStep, setSpeed,
  } = useVisualizerStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => { nextStep(); }, speed);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, speed, nextStep]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space")      { e.preventDefault(); togglePlay(); }
      if (e.code === "ArrowRight") { e.preventDefault(); nextStep(); }
      if (e.code === "ArrowLeft")  { e.preventDefault(); prevStep(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [togglePlay, nextStep, prevStep]);

  if (!trace) return null;

  const total     = trace.steps.length;
  const progress  = ((currentStep + 1) / total) * 100;
  const isAtEnd   = currentStep === total - 1;
  const isAtStart = currentStep === 0;

  return (
    <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "#0c0c12", flexShrink: 0 }}>

      {/* Progress bar / scrubber */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "#666680" }}>
            Step {currentStep + 1} / {total}
          </span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "#666680" }}>
            {Math.round(progress)}%
          </span>
        </div>

        <div style={{ position: "relative", height: 16, display: "flex", alignItems: "center" }}>
          {/* Track */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct  = (e.clientX - rect.left) / rect.width;
              goToStep(Math.round(pct * (total - 1)));
            }}
            style={{
              position: "absolute", left: 0, right: 0, height: 4, borderRadius: 2,
              background: "rgba(255,255,255,0.06)", cursor: "pointer",
            }}
          >
            <motion.div 
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                height: "100%", borderRadius: 2, background: "linear-gradient(90deg, #6366f1, #818cf8)",
              }} 
            />
          </div>

          {/* Step markers */}
          {trace.steps.map((s, i) => {
            const leftPct = total === 1 ? 0 : (i / (total - 1)) * 100;
            const isDone  = i <= currentStep;
            const isNow   = i === currentStep;
            const dotColor = isDone ? (KIND_DOT_COLOR[s.kind || "normal"] || "#818cf8") : "rgba(255,255,255,0.15)";
            return (
              <motion.div
                key={i}
                onClick={() => goToStep(i)}
                title={s.explanation.slice(0, 40)}
                animate={{
                  width: isNow ? 10 : 6,
                  height: isNow ? 10 : 6,
                  backgroundColor: dotColor,
                  border: isNow ? "2px solid #fff" : "0px solid transparent",
                  boxShadow: isNow ? `0 0 8px ${dotColor}` : "none",
                  zIndex: isNow ? 3 : 2,
                }}
                style={{
                  position: "absolute", left: `${leftPct}%`, top: "50%",
                  transform: "translate(-50%, -50%)",
                  borderRadius: "50%", cursor: "pointer",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Controls row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button onClick={() => goToStep(0)} disabled={isAtStart} style={ctrlBtnStyle(isAtStart)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 19l-7-7 7-7M18 19l-7-7 7-7"/></svg>
          </button>
          <button onClick={prevStep} disabled={isAtStart} style={ctrlBtnStyle(isAtStart)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
          </button>

          <motion.button 
            onClick={togglePlay} 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(145deg, #6366f1, #4f46e5)",
              border: "1px solid rgba(129,140,248,0.5)", color: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 16px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 2 }}><path d="M8 5v14l11-7z"/></svg>
            )}
          </motion.button>

          <button onClick={nextStep} disabled={isAtEnd} style={ctrlBtnStyle(isAtEnd)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
          </button>
          <button onClick={() => goToStep(total - 1)} disabled={isAtEnd} style={ctrlBtnStyle(isAtEnd)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 5l7 7-7 7M6 5l7 7-7 7"/></svg>
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, color: "#666680" }}>Speed</span>
          {[
            { label: "0.5x", val: 3000 },
            { label: "1x",   val: 1500 },
            { label: "2x",   val: 750  },
            { label: "4x",   val: 375  },
          ].map(s => (
            <motion.button 
              key={s.label} 
              onClick={() => setSpeed(s.val)}
              animate={{
                background: speed === s.val ? "rgba(99,102,241,0.2)" : "transparent",
                borderColor: speed === s.val ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)",
                color: speed === s.val ? "#a5b4fc" : "#666680",
              }}
              style={{
                padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                border: `1px solid transparent`,
                cursor: "pointer",
              }}
            >
              {s.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 6 }}>
        <span style={{ fontSize: 9, color: "#34344a" }}>Space to play/pause · ← → to step</span>
      </div>
    </div>
  );
}

function ctrlBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    width: 26, height: 26, borderRadius: 6,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: disabled ? "#34344a" : "#9898b0",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    opacity: disabled ? 0.4 : 1,
    transition: "all 0.15s",
  };
}