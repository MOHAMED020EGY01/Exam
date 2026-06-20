/**
 * TreeNode.tsx
 *
 * Purpose:
 * Component that decides whether to render a folder node or leaf node based on node type.
 *
 * Responsibilities:
 * - Route to TreeItem for question nodes
 * - Route to TreeFolder for course and exam nodes
 * - Render child levels by nesting RecursiveTree when expanded
 *
 * Dependencies:
 * - TreeFolder and TreeItem components
 * - RecursiveTree component
 * - TreeNodeData interface
 */

import React from 'react';
import { TreeNodeData } from '@/lib/treeHelpers';
import { TreeFolder } from './TreeFolder';
import { TreeItem } from './TreeItem';
import { RecursiveTree } from './RecursiveTree';

interface TreeNodeProps {
  node: TreeNodeData;
  depth: number;
  expandedKeys: Record<string, boolean>;
  selectedNode: TreeNodeData | null;
  toggleExpand: (id: string) => void;
  setSelectedNode: (node: TreeNodeData) => void;
  
  // Action triggers
  onAddExam?: (course: any) => void;
  onEditCourse?: (course: any) => void;
  onDeleteCourse?: (course: any) => void;
  onEditExam?: (exam: any) => void;
  onDeleteExam?: (exam: any) => void;
  onDownloadExam?: (exam: any) => void;

  // Clipboard & Move operations
  clipboard?: any;
  onCopy?: (node: TreeNodeData) => void;
  onPaste?: (node: TreeNodeData) => void;
  onMove?: (node: TreeNodeData) => void;
  onDuplicate?: (node: TreeNodeData) => void;
  onDeleteQuestion?: (node: TreeNodeData) => void;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  depth,
  expandedKeys,
  selectedNode,
  toggleExpand,
  setSelectedNode,
  onAddExam,
  onEditCourse,
  onDeleteCourse,
  onEditExam,
  onDeleteExam,
  onDownloadExam,
  clipboard,
  onCopy,
  onPaste,
  onMove,
  onDuplicate,
  onDeleteQuestion,
}) => {
  const isExpanded = !!expandedKeys[node.id];
  const isSelected = selectedNode?.id === node.id;

  if (node.type === 'question') {
    return (
      <TreeItem
        node={node}
        depth={depth}
        isSelected={isSelected}
        onSelect={setSelectedNode}
        clipboard={clipboard}
        onCopy={onCopy}
        onMove={onMove}
        onDuplicate={onDuplicate}
        onDeleteQuestion={onDeleteQuestion}
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
      onAddExam={onAddExam}
      onEditCourse={onEditCourse}
      onDeleteCourse={onDeleteCourse}
      onEditExam={onEditExam}
      onDeleteExam={onDeleteExam}
      onDownloadExam={onDownloadExam}
      clipboard={clipboard}
      onCopy={onCopy}
      onPaste={onPaste}
      onMove={onMove}
      onDuplicate={onDuplicate}
    >
      {node.children && node.children.length > 0 && (
        <RecursiveTree
          nodes={node.children}
          depth={depth + 1}
          expandedKeys={expandedKeys}
          selectedNode={selectedNode}
          toggleExpand={toggleExpand}
          setSelectedNode={setSelectedNode}
          onAddExam={onAddExam}
          onEditCourse={onEditCourse}
          onDeleteCourse={onDeleteCourse}
          onEditExam={onEditExam}
          onDeleteExam={onDeleteExam}
          onDownloadExam={onDownloadExam}
          clipboard={clipboard}
          onCopy={onCopy}
          onPaste={onPaste}
          onMove={onMove}
          onDuplicate={onDuplicate}
          onDeleteQuestion={onDeleteQuestion}
        />
      )}
    </TreeFolder>
  );
};
