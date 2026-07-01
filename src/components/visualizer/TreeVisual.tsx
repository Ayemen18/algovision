"use client";

import { useMemo } from "react";
import type { VizTreeState, VizTreeNode } from "@/types/visualizer";
import { motion } from "framer-motion";

interface PositionedNode extends VizTreeNode {
  x: number;
  y: number;
}

interface TreeEdge {
  source: PositionedNode;
  target: PositionedNode;
  id: string;
}

export function TreeVisual({ tree }: { tree: VizTreeState }) {
  // Layout calculations
  const nodeRadius = 20;
  const horizontalSpacing = 50;
  const verticalSpacing = 70;
  const startY = 40;

  const { nodes, edges, width, height } = useMemo(() => {
    if (!tree.root) return { nodes: [], edges: [], width: 0, height: 0 };

    const positionedNodes: PositionedNode[] = [];
    const treeEdges: TreeEdge[] = [];
    
    let currentXIndex = 0;
    let maxDepth = 0;

    // First pass: in-order traversal to determine X positions (based on index) and Y positions (based on depth)
    const traverse = (node: VizTreeNode, depth: number) => {
      if (depth > maxDepth) maxDepth = depth;
      
      if (node.left) {
        traverse(node.left, depth + 1);
      }
      
      const x = currentXIndex * horizontalSpacing + nodeRadius + 20; // 20 padding
      const y = depth * verticalSpacing + startY;
      
      const pNode: PositionedNode = { ...node, x, y };
      positionedNodes.push(pNode);
      currentXIndex++;

      if (node.right) {
        traverse(node.right, depth + 1);
      }
      
      return pNode;
    };

    const rootPNode = traverse(tree.root, 0);

    // Second pass: create edges based on the positioned nodes
    // We need a quick way to find the positioned node for a given original node.
    // We can map by ID.
    const nodeMap = new Map<string, PositionedNode>();
    positionedNodes.forEach(pn => nodeMap.set(pn.id, pn));

    const buildEdges = (node: VizTreeNode) => {
      const pSource = nodeMap.get(node.id)!;
      if (node.left) {
        const pTarget = nodeMap.get(node.left.id)!;
        treeEdges.push({ source: pSource, target: pTarget, id: `${node.id}-${node.left.id}` });
        buildEdges(node.left);
      }
      if (node.right) {
        const pTarget = nodeMap.get(node.right.id)!;
        treeEdges.push({ source: pSource, target: pTarget, id: `${node.id}-${node.right.id}` });
        buildEdges(node.right);
      }
    };

    buildEdges(tree.root);

    const totalWidth = currentXIndex * horizontalSpacing + 40;
    const totalHeight = maxDepth * verticalSpacing + startY + nodeRadius * 2 + 20;

    return {
      nodes: positionedNodes,
      edges: treeEdges,
      width: totalWidth,
      height: totalHeight
    };
  }, [tree.root]);

  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555570", marginBottom: 10 }}>
        {tree.label} {!tree.root && <span style={{ color: "#3a3a50" }}>(empty)</span>}
      </p>

      {tree.root ? (
        <div style={{ position: "relative", width: "100%", overflowX: "auto", display: "flex", justifyContent: "center" }}>
          <svg 
            width={Math.max(width, 300)} 
            height={height}
            style={{ minWidth: width }}
          >
            {/* Draw edges first so they are behind nodes */}
            {edges.map(edge => {
              const isHighlight = edge.source.highlight && edge.target.highlight;
              return (
                <motion.line
                  key={edge.id}
                  x1={edge.source.x}
                  y1={edge.source.y}
                  x2={edge.target.x}
                  y2={edge.target.y}
                  stroke={isHighlight ? "rgba(99,102,241,0.6)" : "rgba(255,255,255,0.15)"}
                  strokeWidth={2}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                />
              );
            })}

            {/* Draw nodes */}
            {nodes.map(node => {
              const isHighlight = node.highlight;
              
              const bgFill = isHighlight ? "rgba(99,102,241,0.2)" : "rgba(30,30,40,1)";
              const strokeColor = isHighlight ? "rgba(99,102,241,0.8)" : "rgba(255,255,255,0.2)";
              const textColor = isHighlight ? "#a5b4fc" : "#e2e2e8";
              const scale = isHighlight ? 1.1 : 1;

              return (
                <motion.g
                  key={node.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale, opacity: 1, x: node.x, y: node.y }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <circle
                    r={nodeRadius}
                    fill={bgFill}
                    stroke={strokeColor}
                    strokeWidth={2}
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={textColor}
                    fontSize={14}
                    fontWeight="bold"
                    fontFamily="'DM Mono', monospace"
                  >
                    {node.val}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </div>
      ) : (
        <div style={{
          height: 52, borderRadius: 10, border: "1px dashed rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 12, color: "#3a3a50" }}>Tree is empty</span>
        </div>
      )}
    </div>
  );
}
