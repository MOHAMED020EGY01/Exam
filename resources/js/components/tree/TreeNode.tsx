import React from 'react';
import { TreeNodeData } from '../../lib/treeHelpers';
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
        />
      )}
    </TreeFolder>
  );
};
