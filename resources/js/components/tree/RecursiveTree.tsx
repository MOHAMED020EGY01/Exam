import React from 'react';
import { TreeNodeData } from '../../lib/treeHelpers';
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
        />
      ))}
    </>
  );
};
