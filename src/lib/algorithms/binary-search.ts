import type { VizTrace } from "@/types/visualizer";

export const binarySearchTrace: VizTrace = {
  problemSlug: "binary-search",
  language: "python",
  code: [
    "def search(nums, target):",
    "    left, right = 0, len(nums) - 1",
    "    while left <= right:",
    "        mid = (left + right) // 2",
    "        if nums[mid] == target:",
    "            return mid",
    "        elif nums[mid] < target:",
    "            left = mid + 1",
    "        else:",
    "            right = mid - 1",
    "    return -1",
  ],
  steps: [
    {
      stepIndex: 0, line: 1, kind: "normal",
      explanation: "We're searching for target=9 in a sorted array. Binary search works only on sorted data.",
      variables: [{ name: "nums", value: "[1,3,5,7,9,11,13]" }, { name: "target", value: 9 }],
      array: [{ id: "nums", label: "nums", values: [1,3,5,7,9,11,13] }],
    },
    {
      stepIndex: 1, line: 2, kind: "normal",
      explanation: "We initialize two pointers: left at the start (0), right at the end (6).",
      variables: [{ name: "left", value: 0, changed: true }, { name: "right", value: 6, changed: true }],
      array: [{ id: "nums", label: "nums", values: [1,3,5,7,9,11,13], pointers: { left: 0, right: 6 } }],
    },
    {
      stepIndex: 2, line: 3, kind: "compare",
      explanation: "left (0) ≤ right (6), so we continue searching.",
      variables: [{ name: "left", value: 0 }, { name: "right", value: 6 }],
      array: [{ id: "nums", label: "nums", values: [1,3,5,7,9,11,13], pointers: { left: 0, right: 6 } }],
    },
    {
      stepIndex: 3, line: 4, kind: "normal",
      explanation: "mid = (0 + 6) / 2 = 3. We'll check the middle element next.",
      variables: [{ name: "left", value: 0 }, { name: "right", value: 6 }, { name: "mid", value: 3, changed: true }],
      array: [{ id: "nums", label: "nums", values: [1,3,5,7,9,11,13], highlight: [3], pointers: { left: 0, right: 6, mid: 3 } }],
    },
    {
      stepIndex: 4, line: 5, kind: "compare",
      explanation: "nums[3] = 7. Is 7 equal to our target, 9? No — 7 is too small.",
      variables: [{ name: "mid", value: 3 }, { name: "nums[mid]", value: 7 }],
      array: [{ id: "nums", label: "nums", values: [1,3,5,7,9,11,13], highlight: [3], pointers: { left: 0, right: 6, mid: 3 } }],
    },
    {
      stepIndex: 5, line: 8, kind: "normal",
      explanation: "Since 7 < 9, the target must be in the right half. We move left to mid + 1 = 4.",
      variables: [{ name: "left", value: 4, changed: true }, { name: "right", value: 6 }],
      array: [{ id: "nums", label: "nums", values: [1,3,5,7,9,11,13], pointers: { left: 4, right: 6 } }],
    },
    {
      stepIndex: 6, line: 4, kind: "normal",
      explanation: "New mid = (4 + 6) / 2 = 5.",
      variables: [{ name: "left", value: 4 }, { name: "right", value: 6 }, { name: "mid", value: 5, changed: true }],
      array: [{ id: "nums", label: "nums", values: [1,3,5,7,9,11,13], highlight: [5], pointers: { left: 4, right: 6, mid: 5 } }],
    },
    {
      stepIndex: 7, line: 5, kind: "compare",
      explanation: "nums[5] = 11. Is 11 equal to 9? No — 11 is too big this time.",
      variables: [{ name: "mid", value: 5 }, { name: "nums[mid]", value: 11 }],
      array: [{ id: "nums", label: "nums", values: [1,3,5,7,9,11,13], highlight: [5], pointers: { left: 4, right: 6, mid: 5 } }],
    },
    {
      stepIndex: 8, line: 10, kind: "normal",
      explanation: "Since 11 > 9, the target must be in the left half. We move right to mid − 1 = 4.",
      variables: [{ name: "left", value: 4 }, { name: "right", value: 4, changed: true }],
      array: [{ id: "nums", label: "nums", values: [1,3,5,7,9,11,13], pointers: { left: 4, right: 4 } }],
    },
    {
      stepIndex: 9, line: 4, kind: "normal",
      explanation: "left equals right now. mid = (4 + 4) / 2 = 4 — our search has narrowed to one element.",
      variables: [{ name: "left", value: 4 }, { name: "right", value: 4 }, { name: "mid", value: 4, changed: true }],
      array: [{ id: "nums", label: "nums", values: [1,3,5,7,9,11,13], highlight: [4], pointers: { left: 4, right: 4, mid: 4 } }],
    },
    {
      stepIndex: 10, line: 5, kind: "success",
      explanation: "nums[4] = 9. That matches our target exactly!",
      variables: [{ name: "mid", value: 4 }, { name: "nums[mid]", value: 9 }],
      array: [{ id: "nums", label: "nums", values: [1,3,5,7,9,11,13], success: [4] }],
    },
    {
      stepIndex: 11, line: 6, kind: "success",
      explanation: "We return mid = 4 — the index where 9 lives in the array.",
      variables: [{ name: "result", value: 4, changed: true }],
      array: [{ id: "nums", label: "nums", values: [1,3,5,7,9,11,13], success: [4] }],
    },
  ],
  complexity: {
    time:  "O(log n)",
    space: "O(1)",
    timeExplanation:
      "Each step eliminates half the remaining search space, so the number of steps needed grows logarithmically with input size.",
    spaceExplanation:
      "We only use a constant number of variables (left, right, mid) regardless of input size — no extra data structures.",
  },
};