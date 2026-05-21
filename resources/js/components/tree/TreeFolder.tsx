import React from 'react';
import { TreeNodeData } from '../../lib/treeHelpers';
import { TreeIcon, ChevronIcon } from './TreeIcon';
import { Plus, Pen, Trash, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreeFolderProps {
  node: TreeNodeData;
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onSelect: (node: TreeNodeData) => void;
  children?: React.ReactNode;
  
  // Action triggers
  onAddExam?: (course: any) => void;
  onEditCourse?: (course: any) => void;
  onDeleteCourse?: (course: any) => void;
  onEditExam?: (exam: any) => void;
  onDeleteExam?: (exam: any) => void;
  onDownloadExam?: (exam: any) => void;
}

export const TreeFolder: React.FC<TreeFolderProps> = ({
  node,
  depth,
  isExpanded,
  isSelected,
  onToggle,
  onSelect,
  children,
  onAddExam,
  onEditCourse,
  onDeleteCourse,
  onEditExam,
  onDeleteExam,
  onDownloadExam,
}) => {
  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(node.id);
  };

  const handleRowClick = () => {
    onSelect(node);
  };

  // Prevent parent toggle when clicking inline actions
  const stopPropagation = (fn?: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fn) fn();
  };

  const isCourse = node.type === 'course';
  const isExam = node.type === 'exam';

  return (
    <div className="w-full">
      {/* Folder Row */}
      <div
        onClick={handleRowClick}
        style={{ ['--depth' as any]: depth }}
        className={cn(
          "flex items-center gap-2 py-1.5 pr-3 mx-1 my-0.5 rounded-md cursor-pointer transition-colors duration-150 group text-sm select-none justify-between",
          "pl-[calc(var(--depth)*10px+12px)] md:pl-[calc(var(--depth)*16px+12px)]",
          isSelected 
            ? "bg-primary/10 text-primary font-medium border-l-2 border-primary pl-[calc(var(--depth)*10px+10px)] md:pl-[calc(var(--depth)*16px+10px)]" 
            : "text-foreground hover:bg-foreground/5"
        )}
      >
        <div className="flex items-center gap-2 truncate flex-1">
          {/* Chevron expand/collapse toggle */}
          <ChevronIcon expanded={isExpanded} onClick={handleChevronClick} />
          
          <TreeIcon type={node.type} expanded={isExpanded} />
          
          <span className="truncate font-medium" title={node.label}>
            {node.label}
          </span>
          
          {/* Item count helper badge */}
          {node.children && node.children.length > 0 && (
            <span className="text-[10px] text-muted-foreground/60 bg-foreground/5 px-1 py-0.2 rounded font-normal">
              {node.children.length}
            </span>
          )}
        </div>

        {/* Hover Action Buttons (VSCode style) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
          {isCourse && (
            <>
              {onAddExam && (
                <button
                  onClick={stopPropagation(() => onAddExam(node.originalData))}
                  className="p-1 hover:bg-foreground/10 rounded text-muted-foreground hover:text-foreground transition-colors"
                  title="Create Exam"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
              {onEditCourse && (
                <button
                  onClick={stopPropagation(() => onEditCourse(node.originalData))}
                  className="p-1 hover:bg-foreground/10 rounded text-muted-foreground hover:text-foreground transition-colors"
                  title="Edit Course"
                >
                  <Pen className="w-3.5 h-3.5" />
                </button>
              )}
              {onDeleteCourse && (
                <button
                  onClick={stopPropagation(() => onDeleteCourse(node.originalData))}
                  className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors"
                  title="Delete Course"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}

          {isExam && (
            <>
              {onDownloadExam && (
                <button
                  onClick={stopPropagation(() => onDownloadExam(node.originalData))}
                  className="p-1 hover:bg-foreground/10 rounded text-muted-foreground hover:text-foreground transition-colors"
                  title="Download Exam Zip"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              )}
              {onEditExam && (
                <button
                  onClick={stopPropagation(() => onEditExam(node.originalData))}
                  className="p-1 hover:bg-foreground/10 rounded text-muted-foreground hover:text-foreground transition-colors"
                  title="Edit Exam"
                >
                  <Pen className="w-3.5 h-3.5" />
                </button>
              )}
              {onDeleteExam && (
                <button
                  onClick={stopPropagation(() => onDeleteExam(node.originalData))}
                  className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors"
                  title="Delete Exam"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Folder Children (Rendered recursively) */}
      {isExpanded && children && (
        <div className="flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
};
