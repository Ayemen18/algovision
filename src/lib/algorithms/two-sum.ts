import type { VizTrace } from "@/types/visualizer";

export const twoSumTrace: VizTrace = {
  problemSlug: "two-sum",
  language: "python",
  code: [
    "def two_sum(nums, target):",
    "    seen = {}",
    "    for i, num in enumerate(nums):",
    "        diff = target - num",
    "        if diff in seen:",
    "            return [seen[diff], i]",
    "        seen[num] = i",
    "    return []",
  ],
  steps: [
    {
      stepIndex: 0, line: 1, kind: "normal",
      explanation: "We define two_sum, taking the array nums and the target sum we're looking for.",
      variables: [
        { name: "nums",   value: "[2, 7, 11, 15]" },
        { name: "target", value: 9 },
      ],
      array: [{ id: "nums", label: "nums", values: [2, 7, 11, 15] }],
    },
    {
      stepIndex: 1, line: 2, kind: "normal",
      explanation: "We create an empty hashmap called seen — this will store each number we've visited and its index.",
      variables: [
        { name: "nums",   value: "[2, 7, 11, 15]" },
        { name: "target", value: 9 },
        { name: "seen",   value: "{}", changed: true },
      ],
      array:   [{ id: "nums", label: "nums", values: [2, 7, 11, 15] }],
      hashmap: [{ id: "seen", label: "seen", entries: [] }],
    },
    {
      stepIndex: 2, line: 3, kind: "normal",
      explanation: "We start looping. On this iteration, i=0 and num=2 — the first element.",
      variables: [
        { name: "i",   value: 0, changed: true },
        { name: "num", value: 2, changed: true },
      ],
      array:   [{ id: "nums", label: "nums", values: [2, 7, 11, 15], highlight: [0] }],
      hashmap: [{ id: "seen", label: "seen", entries: [] }],
    },
    {
      stepIndex: 3, line: 4, kind: "normal",
      explanation: "We calculate diff: the number we'd need to find to complete the pair. 9 − 2 = 7.",
      variables: [
        { name: "i",    value: 0 },
        { name: "num",  value: 2 },
        { name: "diff", value: 7, changed: true },
      ],
      array:   [{ id: "nums", label: "nums", values: [2, 7, 11, 15], highlight: [0] }],
      hashmap: [{ id: "seen", label: "seen", entries: [] }],
    },
    {
      stepIndex: 4, line: 5, kind: "compare",
      explanation: "Is 7 already in seen? Not yet — seen is still empty. So we move on.",
      variables: [
        { name: "i", value: 0 }, { name: "num", value: 2 }, { name: "diff", value: 7 },
      ],
      array:   [{ id: "nums", label: "nums", values: [2, 7, 11, 15], highlight: [0] }],
      hashmap: [{ id: "seen", label: "seen", entries: [] }],
    },
    {
      stepIndex: 5, line: 7, kind: "normal",
      explanation: "We record that we've seen 2 at index 0. Now seen = { 2: 0 }.",
      variables: [
        { name: "i", value: 0 }, { name: "num", value: 2 },
      ],
      array:   [{ id: "nums", label: "nums", values: [2, 7, 11, 15], highlight: [0] }],
      hashmap: [{ id: "seen", label: "seen", entries: [["2", 0]], highlightKey: "2" }],
    },
    {
      stepIndex: 6, line: 3, kind: "normal",
      explanation: "Next iteration: i=1, num=7.",
      variables: [
        { name: "i", value: 1, changed: true }, { name: "num", value: 7, changed: true },
      ],
      array:   [{ id: "nums", label: "nums", values: [2, 7, 11, 15], highlight: [1] }],
      hashmap: [{ id: "seen", label: "seen", entries: [["2", 0]] }],
    },
    {
      stepIndex: 7, line: 4, kind: "normal",
      explanation: "diff = 9 − 7 = 2. We're looking for a 2 in our hashmap.",
      variables: [
        { name: "i", value: 1 }, { name: "num", value: 7 }, { name: "diff", value: 2, changed: true },
      ],
      array:   [{ id: "nums", label: "nums", values: [2, 7, 11, 15], highlight: [1] }],
      hashmap: [{ id: "seen", label: "seen", entries: [["2", 0]] }],
    },
    {
      stepIndex: 8, line: 5, kind: "success",
      explanation: "Is 2 in seen? Yes! We stored it at index 0 in the previous step. We found our pair.",
      variables: [
        { name: "i", value: 1 }, { name: "num", value: 7 }, { name: "diff", value: 2 },
      ],
      array:   [{ id: "nums", label: "nums", values: [2, 7, 11, 15], highlight: [1], success: [0] }],
      hashmap: [{ id: "seen", label: "seen", entries: [["2", 0]], highlightKey: "2" }],
    },
    {
      stepIndex: 9, line: 6, kind: "success",
      explanation: "We return [seen[diff], i] → [0, 1]. nums[0] + nums[1] = 2 + 7 = 9. ✓",
      variables: [
        { name: "result", value: "[0, 1]", changed: true },
      ],
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