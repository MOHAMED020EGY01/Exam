/**
 * RecursiveTree.tsx
 *
 * Purpose:
 * Renders list of TreeNode components recursively mapping tree layers.
 *
 * Responsibilities:
 * - Map nodes array to individual TreeNode items passing callback triggers
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

export const RecursiveTree: React.FC<RecursiveTreeProps> = ({
  nodes,
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
  return (
    <>
      {nodes.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          depth={depth}
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
      ))}
    </>
  );
};
