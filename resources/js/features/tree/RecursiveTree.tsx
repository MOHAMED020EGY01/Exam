/**
 * RecursiveTree.tsx
 *
 * Purpose:
 * Renders a list of TreeNode components for a given depth level.
 *
 * Responsibilities:
 * - Map through nodes array and render TreeNode for each
 * - Pass depth to TreeNode for indentation calculation
 * - Use React.memo for performance optimization
 *
 * Dependencies:
 * - TreeNode component
 * - TreeNodeData interface
 *
 * Notes:
 * - Moved from components/tree to features/tree for feature-based organization
 */

import React from 'react';
import { TreeNodeData } from '@/interface/global';
import { TreeNode } from './TreeNode';

interface RecursiveTreeProps {
  nodes: TreeNodeData[];
  depth: number;
}

const RecursiveTreeInner: React.FC<RecursiveTreeProps> = ({ nodes, depth }) => (
  <>
    {nodes.map((node) => (
      <TreeNode key={node.id} node={node} depth={depth} />
    ))}
  </>
);

export const RecursiveTree = React.memo(
  RecursiveTreeInner,
  (prev, next) => prev.depth === next.depth && prev.nodes === next.nodes,
);

RecursiveTree.displayName = 'RecursiveTree';
