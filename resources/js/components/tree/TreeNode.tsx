/**
 * TreeNode.tsx
 *
 * Purpose:
 * Decides whether to render a folder node (TreeFolder) or leaf node (TreeItem)
 * based on node.type, and handles recursive child rendering.
 *
 * Changes from previous version:
 * - Props reduced to `node` and `depth` only.
 * - expandedKeys, selectedNode, toggleExpand, setSelectedNode and all action
 *   callbacks are now read from useTreeContext() instead of being passed as props.
 * - React.memo applied with comparison on node.id and depth for performance.
 *
 * Dependencies:
 * - TreeFolder, TreeItem, RecursiveTree
 * - useTreeContext
 */

import React from 'react';
import { TreeNodeData } from '@/interface/global';
import { useTreeContext } from './TreeContext';
import { TreeFolder } from './TreeFolder';
import { TreeItem } from './TreeItem';
import { RecursiveTree } from './RecursiveTree';

interface TreeNodeProps {
  node:  TreeNodeData;
  depth: number;
}

const TreeNodeInner: React.FC<TreeNodeProps> = ({ node, depth }) => {
  const { expandedKeys, selectedNode, toggleExpand, setSelectedNode } = useTreeContext();

  const isExpanded = !!expandedKeys[node.id];
  const isSelected = selectedNode?.id === node.id;

  if (node.type === 'question') {
    return (
      <TreeItem
        node={node}
        depth={depth}
        isSelected={isSelected}
        onSelect={setSelectedNode}
      />
    );
  }

  return (
    <TreeFolder
      node={node}
      depth={depth}
      isExpanded={isExpanded}
      isSelected={isSelected}
      onToggle={toggleExpand}
      onSelect={setSelectedNode}
    >
      {node.children && node.children.length > 0 && (
        <RecursiveTree nodes={node.children} depth={depth + 1} />
      )}
    </TreeFolder>
  );
};

export const TreeNode = React.memo(
  TreeNodeInner,
  (prev, next) =>
    prev.node.id === next.node.id &&
    prev.depth   === next.depth,
);

TreeNode.displayName = 'TreeNode';
