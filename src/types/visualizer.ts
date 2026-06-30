// ─── Core visualization types ──────────────────────────────────────────────────

export type VizLanguage = "python" | "javascript" | "typescript" | "java" | "cpp";

export interface VizVariable {
  name:  string;
  value: string | number | boolean | null;
  changed?: boolean;
}

export interface VizArrayState {
  id:        string;
  label:     string;
  values:    (number | string)[];
  highlight?: number[];
  success?:   number[];
  pointers?:  Record<string, number>;
}

export interface VizHashMapState {
  id:      string;
  label:   string;
  entries: [string, string | number][];
  highlightKey?: string;
}

export interface VizStackFrame {
  label:     string;
  detail?:   string;
  active?:   boolean;
}

export interface VizStackState {
  id:     string;
  label:  string;
  frames: VizStackFrame[];
}

export interface VizStep {
  stepIndex:   number;
  /** line number is per-language since line counts differ across languages */
  line:        number | Partial<Record<VizLanguage, number>>;
  explanation: string;
  variables?:  VizVariable[];
  array?:      VizArrayState[];
  hashmap?:    VizHashMapState[];
  stack?:      VizStackState;
  kind?: "normal" | "compare" | "success" | "error";
}

export interface VizTrace {
  problemSlug: string;
  /** code for every supported language, keyed by language id */
  code: Partial<Record<VizLanguage, string[]>>;
  steps: VizStep[];
  complexity: {
    time:    string;
    space:   string;
    timeExplanation:  string;
    spaceExplanation: string;
  };
}

/** Resolve the active line number for a given language at a given step */
export function resolveLine(step: VizStep, lang: VizLanguage): number {
  if (typeof step.line === "number") return step.line;
  return step.line[lang] ?? Object.values(step.line)[0] ?? 1;
}