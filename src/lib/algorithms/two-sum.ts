import type { VizTrace } from "@/types/visualizer";

// ─── Code in all 5 languages, line-for-line mapped to the same logical steps ──

const CODE = {
  python: [
    "def two_sum(nums, target):",
    "    seen = {}",
    "    for i, num in enumerate(nums):",
    "        diff = target - num",
    "        if diff in seen:",
    "            return [seen[diff], i]",
    "        seen[num] = i",
    "    return []",
  ],
  javascript: [
    "function twoSum(nums, target) {",
    "  const seen = {};",
    "  for (let i = 0; i < nums.length; i++) {",
    "    const num = nums[i];",
    "    const diff = target - num;",
    "    if (diff in seen) {",
    "      return [seen[diff], i];",
    "    }",
    "    seen[num] = i;",
    "  }",
    "  return [];",
    "}",
  ],
  typescript: [
    "function twoSum(nums: number[], target: number): number[] {",
    "  const seen: Record<number, number> = {};",
    "  for (let i = 0; i < nums.length; i++) {",
    "    const num = nums[i];",
    "    const diff = target - num;",
    "    if (diff in seen) {",
    "      return [seen[diff], i];",
    "    }",
    "    seen[num] = i;",
    "  }",
    "  return [];",
    "}",
  ],
  java: [
    "public int[] twoSum(int[] nums, int target) {",
    "    Map<Integer, Integer> seen = new HashMap<>();",
    "    for (int i = 0; i < nums.length; i++) {",
    "        int num = nums[i];",
    "        int diff = target - num;",
    "        if (seen.containsKey(diff)) {",
    "            return new int[]{seen.get(diff), i};",
    "        }",
    "        seen.put(num, i);",
    "    }",
    "    return new int[]{};",
    "}",
  ],
  cpp: [
    "vector<int> twoSum(vector<int>& nums, int target) {",
    "    unordered_map<int, int> seen;",
    "    for (int i = 0; i < nums.size(); i++) {",
    "        int num = nums[i];",
    "        int diff = target - num;",
    "        if (seen.count(diff)) {",
    "            return {seen[diff], i};",
    "        }",
    "        seen[num] = i;",
    "    }",
    "    return {};",
    "}",
  ],
};

// Maps logical step -> { python: line, javascript: line, ... }
// Logical steps: 0=def, 1=init seen, 2=loop start, 3=diff calc, 4=if check, 5=return found, 6=store seen, 7=final return

const LINES = {
  def:        { python: 1, javascript: 1, typescript: 1, java: 1,  cpp: 1  },
  initSeen:   { python: 2, javascript: 2, typescript: 2, java: 2,  cpp: 2  },
  loopStart:  { python: 3, javascript: 3, typescript: 3, java: 3,  cpp: 3  },
  diffCalc:   { python: 4, javascript: 5, typescript: 5, java: 5,  cpp: 5  },
  ifCheck:    { python: 5, javascript: 6, typescript: 6, java: 6,  cpp: 6  },
  returnFound:{ python: 6, javascript: 7, typescript: 7, java: 7,  cpp: 7  },
  storeSeen:  { python: 7, javascript: 9, typescript: 9, java: 9,  cpp: 9  },
};

export const twoSumTrace: VizTrace = {
  problemSlug: "two-sum",
  code: CODE,
  steps: [
    {
      stepIndex: 0, line: LINES.def, kind: "normal",
      explanation: "We define two_sum, taking the array nums and the target sum we're looking for.",
      variables: [{ name: "nums", value: "[2, 7, 11, 15]" }, { name: "target", value: 9 }],
      array: [{ id: "nums", label: "nums", values: [2, 7, 11, 15] }],
    },
    {
      stepIndex: 1, line: LINES.initSeen, kind: "normal",
      explanation: "We create an empty hashmap called seen — this will store each number we've visited and its index.",
      variables: [{ name: "nums", value: "[2, 7, 11, 15]" }, { name: "target", value: 9 }, { name: "seen", value: "{}", changed: true }],
      array:   [{ id: "nums", label: "nums", values: [2, 7, 11, 15] }],
      hashmap: [{ id: "seen", label: "seen", entries: [] }],
    },
    {
      stepIndex: 2, line: LINES.loopStart, kind: "normal",
      explanation: "We start looping. On this iteration, i=0 and num=2 — the first element.",
      variables: [{ name: "i", value: 0, changed: true }, { name: "num", value: 2, changed: true }],
      array:   [{ id: "nums", label: "nums", values: [2, 7, 11, 15], highlight: [0] }],
      hashmap: [{ id: "seen", label: "seen", entries: [] }],
    },
    {
      stepIndex: 3, line: LINES.diffCalc, kind: "normal",
      explanation: "We calculate diff: the number we'd need to find to complete the pair. 9 − 2 = 7.",
      variables: [{ name: "i", value: 0 }, { name: "num", value: 2 }, { name: "diff", value: 7, changed: true }],
      array:   [{ id: "nums", label: "nums", values: [2, 7, 11, 15], highlight: [0] }],
      hashmap: [{ id: "seen", label: "seen", entries: [] }],
    },
    {
      stepIndex: 4, line: LINES.ifCheck, kind: "compare",
      explanation: "Is 7 already in seen? Not yet — seen is still empty. So we move on.",
      variables: [{ name: "i", value: 0 }, { name: "num", value: 2 }, { name: "diff", value: 7 }],
      array:   [{ id: "nums", label: "nums", values: [2, 7, 11, 15], highlight: [0] }],
      hashmap: [{ id: "seen", label: "seen", entries: [] }],
    },
    {
      stepIndex: 5, line: LINES.storeSeen, kind: "normal",
      explanation: "We record that we've seen 2 at index 0. Now seen = { 2: 0 }.",
      variables: [{ name: "i", value: 0 }, { name: "num", value: 2 }],
      array:   [{ id: "nums", label: "nums", values: [2, 7, 11, 15], highlight: [0] }],
      hashmap: [{ id: "seen", label: "seen", entries: [["2", 0]], highlightKey: "2" }],
    },
    {
      stepIndex: 6, line: LINES.loopStart, kind: "normal",
      explanation: "Next iteration: i=1, num=7.",
      variables: [{ name: "i", value: 1, changed: true }, { name: "num", value: 7, changed: true }],
      array:   [{ id: "nums", label: "nums", values: [2, 7, 11, 15], highlight: [1] }],
      hashmap: [{ id: "seen", label: "seen", entries: [["2", 0]] }],
    },
    {
      stepIndex: 7, line: LINES.diffCalc, kind: "normal",
      explanation: "diff = 9 − 7 = 2. We're looking for a 2 in our hashmap.",
      variables: [{ name: "i", value: 1 }, { name: "num", value: 7 }, { name: "diff", value: 2, changed: true }],
      array:   [{ id: "nums", label: "nums", values: [2, 7, 11, 15], highlight: [1] }],
      hashmap: [{ id: "seen", label: "seen", entries: [["2", 0]] }],
    },
    {
      stepIndex: 8, line: LINES.ifCheck, kind: "success",
      explanation: "Is 2 in seen? Yes! We stored it at index 0 in the previous step. We found our pair.",
      variables: [{ name: "i", value: 1 }, { name: "num", value: 7 }, { name: "diff", value: 2 }],
      array:   [{ id: "nums", label: "nums", values: [2, 7, 11, 15], highlight: [1], success: [0] }],
      hashmap: [{ id: "seen", label: "seen", entries: [["2", 0]], highlightKey: "2" }],
    },
    {
      stepIndex: 9, line: LINES.returnFound, kind: "success",
      explanation: "We return [seen[diff], i] → [0, 1]. nums[0] + nums[1] = 2 + 7 = 9. ✓",
      variables: [{ name: "result", value: "[0, 1]", changed: true }],
      array: [{ id: "nums", label: "nums", values: [2, 7, 11, 15], success: [0, 1] }],
    },
  ],
  complexity: {
    time:  "O(n)",
    space: "O(n)",
    timeExplanation:
      "We traverse the array once. Each hashmap lookup and insertion is O(1) on average, so the total time is linear in the size of the input.",
    spaceExplanation:
      "In the worst case, we store every element in the hashmap before finding a pair (or finishing without one), giving O(n) extra space.",
  },
};