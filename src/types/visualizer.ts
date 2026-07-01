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

export interface VizTreeNode {
  id: string;
  val: string | number;
  left?: VizTreeNode;
  right?: VizTreeNode;
  highlight?: boolean;
}

export interface VizTreeState {
  id: string;
  label: string;
  root: VizTreeNode | null;
}

export interface VizGraphNode {
  id: string;
  val?: string | number;
  highlight?: boolean;
}

export interface VizGraphEdge {
  source: string;
  target: string;
  weight?: string | number;
  highlight?: boolean;
}

export interface VizGraphState {
  id: string;
  label: string;
  nodes: VizGraphNode[];
  edges: VizGraphEdge[];
  directed?: boolean;
}

export interface VizDpTableState {
  id: string;
  label: string;
  rows: number;
  cols: number;
  data: (string | number)[][];
  highlight?: { r: number; c: number }[];
  success?: { r: number; c: number }[];
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
  tree?:       VizTreeState[];
  graph?:      VizGraphState[];
  dpTable?:    VizDpTableState[];
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