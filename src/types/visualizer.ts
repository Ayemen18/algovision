// ─── Language ─────────────────────────────────────────────────────────────────

export type VizLanguage = "python" | "javascript" | "typescript" | "java" | "cpp";

// ─── Shared ───────────────────────────────────────────────────────────────────

export interface VizVariable {
  name:     string;
  value:    string | number | boolean | null;
  changed?: boolean;
}

// ─── Array ───────────────────────────────────────────────────────────────────

export interface VizArrayState {
  id:        string;
  label:     string;
  values:    (number | string)[];
  highlight?: number[];
  success?:   number[];
  pointers?:  Record<string, number>;
}

// ─── HashMap ─────────────────────────────────────────────────────────────────

export interface VizHashMapState {
  id:            string;
  label:         string;
  entries:       [string, string | number][];
  highlightKey?: string;
}

// ─── Stack / Queue ────────────────────────────────────────────────────────────

export interface VizStackState {
  id:        string;
  label:     string;
  kind:      "stack" | "queue";        // stack = LIFO top-view, queue = FIFO left-right
  items:     (string | number)[];      // index 0 = bottom of stack / front of queue
  highlight?: number;                  // index of currently active item
}

// ─── Linked List ─────────────────────────────────────────────────────────────

export interface VizListNode {
  id:       string;
  value:    string | number;
  nextId:   string | null;
  active?:  boolean;
  visited?: boolean;
  highlight?: boolean;
}

export interface VizLinkedListState {
  id:      string;
  label:   string;
  nodes:   VizListNode[];             // ordered — nodes[0] is head
  headId:  string | null;
  pointers?: Record<string, string>; // name → nodeId e.g. { slow: "n2", fast: "n4" }
}

// ─── Tree ─────────────────────────────────────────────────────────────────────

export interface VizTreeNode {
  id:       string;
  value:    string | number | null;  // null = empty/null node
  leftId:   string | null;
  rightId:  string | null;
  active?:  boolean;
  visited?: boolean;
  highlight?: boolean;
}

export interface VizTreeState {
  id:     string;
  label:  string;
  nodes:  Record<string, VizTreeNode>;
  rootId: string | null;
}

// ─── Graph ────────────────────────────────────────────────────────────────────

export interface VizGraphNode {
  id:       string;
  label:    string | number;
  active?:  boolean;
  visited?: boolean;
  inQueue?: boolean;
  x?:       number;    // optional pre-computed layout position (0–100 %)
  y?:       number;
}

export interface VizGraphEdge {
  from:      string;
  to:        string;
  active?:   boolean;
  directed?: boolean;
  weight?:   number;
}

export interface VizGraphState {
  id:       string;
  label:    string;
  nodes:    VizGraphNode[];
  edges:    VizGraphEdge[];
  directed?: boolean;
}

// ─── DP Table ─────────────────────────────────────────────────────────────────

export interface VizDPTableState {
  id:          string;
  label:       string;
  rows:        (number | string | null)[][];   // 2D grid; null = not-yet-filled
  rowLabels?:  string[];
  colLabels?:  string[];
  highlightCell?: [number, number];            // [row, col] currently being computed
  filledCell?:    [number, number];            // [row, col] just filled in
}

// ─── Step ─────────────────────────────────────────────────────────────────────

export interface VizStep {
  stepIndex:   number;
  line:        number | Partial<Record<VizLanguage, number>>;
  explanation: string;
  kind?:       "normal" | "compare" | "success" | "error";

  // Data structures — include whichever are relevant to this step
  variables?:  VizVariable[];
  array?:      VizArrayState[];
  hashmap?:    VizHashMapState[];
  stack?:      VizStackState[];
  linkedList?: VizLinkedListState[];
  tree?:       VizTreeState;
  graph?:      VizGraphState;
  dpTable?:    VizDPTableState;
}

// ─── Trace ───────────────────────────────────────────────────────────────────

export interface VizTrace {
  problemSlug: string;
  code:        Partial<Record<VizLanguage, string[]>>;
  steps:       VizStep[];
  complexity: {
    time:              string;
    space:             string;
    timeExplanation:   string;
    spaceExplanation:  string;
  };
}

// ─── Utility ─────────────────────────────────────────────────────────────────

export function resolveLine(step: VizStep, lang: VizLanguage): number {
  if (typeof step.line === "number") return step.line;
  return step.line[lang] ?? (Object.values(step.line)[0] as number) ?? 1;
}