import React from 'react';
import { TreeNodeData } from '../../lib/treeHelpers';
import { TreeIcon } from './TreeIcon';
import { cn } from '@/lib/utils';

interface TreeItemProps {
  node: TreeNodeData;
  depth: number;
  isSelected: boolean;
  onSelect: (node: TreeNodeData) => void;
}

export const TreeItem: React.FC<TreeItemProps> = ({
  node,
  depth,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(node)}
      style={{ ['--depth' as any]: depth }}
      className={cn(
        "flex items-center gap-2 py-1.5 pr-3 mx-1 my-0.5 rounded-md cursor-pointer transition-colors duration-150 group text-sm select-none",
        "pl-[calc(var(--depth)*10px+12px)] md:pl-[calc(var(--depth)*16px+12px)]",
        isSelected 
          ? "bg-primary/10 text-primary font-medium border-l-2 border-primary pl-[calc(var(--depth)*10px+10px)] md:pl-[calc(var(--depth)*16px+10px)]" 
          : "text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
      )}
    >
      {/* Spacer to align with chevron folders */}
      <span className="w-3.5 h-3.5 flex-shrink-0" />
      
      <TreeIcon type="question" />
      
      <span className="truncate flex-1" title={node.label}>
        {node.label}
      </span>
      
      {/* Indicator badge for questions */}
      <span className="opacity-0 group-hover:opacity-100 text-[10px] text-muted-foreground/60 bg-foreground/5 px-1.5 py-0.5 rounded transition-opacity duration-150">
        Q
      </span>
    </div>
  );
};
