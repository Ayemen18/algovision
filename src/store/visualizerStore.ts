import { create } from "zustand";
import type { VizTrace } from "@/types/visualizer";

interface VisualizerStore {
  trace:       VizTrace | null;
  currentStep: number;
  isPlaying:   boolean;
  speed:       number;        // ms between steps

  setTrace:      (trace: VizTrace) => void;
  goToStep:      (index: number) => void;
  nextStep:      () => void;
  prevStep:      () => void;
  togglePlay:    () => void;
  setPlaying:    (playing: boolean) => void;
  setSpeed:      (speed: number) => void;
  reset:         () => void;
}

export const useVisualizerStore = create<VisualizerStore>((set, get) => ({
  trace:       null,
  currentStep: 0,
  isPlaying:   false,
  speed:       1500,

  setTrace: (trace) => set({ trace, currentStep: 0, isPlaying: false }),

  goToStep: (index) => {
    const { trace } = get();
    if (!trace) return;
    const clamped = Math.max(0, Math.min(index, trace.steps.length - 1));
    set({ currentStep: clamped });
  },

  nextStep: () => {
    const { trace, currentStep } = get();
    if (!trace) return;
    if (currentStep >= trace.steps.length - 1) {
      set({ isPlaying: false });
      return;
    }
    set({ currentStep: currentStep + 1 });
  },

  prevStep: () => {
    const { currentStep } = get();
    set({ currentStep: Math.max(0, currentStep - 1) });
  },

  togglePlay: () => {
    const { trace, currentStep, isPlaying } = get();
    if (!trace) return;
    // If at the end, restart
    if (!isPlaying && currentStep >= trace.steps.length - 1) {
      set({ currentStep: 0, isPlaying: true });
      return;
    }
    set({ isPlaying: !isPlaying });
  },

  setPlaying: (isPlaying) => set({ isPlaying }),
  setSpeed:   (speed)     => set({ speed }),

  reset: () => set({ currentStep: 0, isPlaying: false }),
}));