/**
 * RecursiveTree.tsx
 *
 * Purpose:
 * Renders a list of TreeNode components for a given depth level.
 *
 * Changes from previous version:
 * - Props reduced to `nodes` and `depth` only.
 * - All shared state / actions are now consumed via useTreeContext()
 *   inside each TreeNode, so this component no longer needs to forward them.
 * - React.memo applied with a comparison on nodes array identity and depth,
 *   preventing unnecessary re-renders when only context values change.
 *
 * Dependencies:
 * - TreeNode component
 * - TreeNodeData interface
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
