/**
 * TreeFolder.tsx
 *
 * Purpose:
 * Component that renders course and exam container nodes in the tree structure.
 *
 * Responsibilities:
 * - Render expand/collapse trigger chevrons
 * - Render type icons (course, exam) and item count helper badges
 * - Render action context dropdown actions (create, edit, delete, copy, paste, move, duplicate, download)
 *
 * Dependencies:
 * - TreeIcon and ChevronIcon components
 * - DropdownMenu (Shadcn UI)
 * - Lucide icons
 * - TreeNodeData interface
 */

import React from 'react';
import { TreeNodeData } from '@/interface/global';
import { TreeIcon, ChevronIcon } from './TreeIcon';
import {
  Plus,
  Pen,
  Trash,
  Download,
  Copy,
  Clipboard,
  Move,
  CopyPlus,
  MoreVertical,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

  // Clipboard & Move operations
  clipboard?: any;
  onCopy?: (node: TreeNodeData) => void;
  onPaste?: (node: TreeNodeData) => void;
  onMove?: (node: TreeNodeData) => void;
  onDuplicate?: (node: TreeNodeData) => void;
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
  clipboard,
  onCopy,
  onPaste,
  onMove,
  onDuplicate,
}) => {
  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(node.id);
  };

  const handleRowClick = () => {
    onSelect(node);
  };

  const isCourse = node.type === 'course';
  const isExam = node.type === 'exam';

  // Check if this item is currently copied
  const isCopied = clipboard && clipboard.id === node.id;

  return (
    <div className="w-full">
      {/* Folder Row */}
      <div
        onClick={handleRowClick}
        style={{ ['--depth' as any]: depth }}
        className={cn(
          "flex items-center gap-2 py-1.5 pr-3 mx-1 my-0.5 rounded-md cursor-pointer transition-all duration-150 group text-sm select-none justify-between",
          "pl-[calc(var(--depth)*10px+12px)] md:pl-[calc(var(--depth)*16px+12px)]",
          isSelected
            ? "bg-primary/10 text-primary font-medium border-l-2 border-primary pl-[calc(var(--depth)*10px+10px)] md:pl-[calc(var(--depth)*16px+10px)]"
            : "text-foreground hover:bg-foreground/5",
          isCopied && "opacity-60 border-2 border-dashed border-primary/45 bg-primary/5 animate-pulse"
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

          {/* Copied indicator */}
          {isCopied && (
            <span className="text-[9px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-1.5 py-0.2 rounded-full animate-bounce">
              Copied
            </span>
          )}
        </div>

        {/* Dropdown Action Menu (VSCode style ⋮) */}
        <div className="flex items-center flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-1 hover:bg-foreground/10 rounded text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none h-6 w-6 flex items-center justify-center"
                title="Actions..."
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {isCourse && (
                <>
                  {onAddExam && (
                    <DropdownMenuItem onClick={() => onAddExam(node.originalData)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Exam
                    </DropdownMenuItem>
                  )}
                  {onEditCourse && (
                    <DropdownMenuItem onClick={() => onEditCourse(node.originalData)}>
                      <Pen className="w-4 h-4 mr-2" />
                      Edit Course
                    </DropdownMenuItem>
                  )}
                  {clipboard && clipboard.type === 'exam' && onPaste && (
                    <DropdownMenuItem onClick={() => onPaste(node)}>
                      <Clipboard className="w-4 h-4 mr-2 text-indigo-500" />
                      Paste Exam
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {onDeleteCourse && (
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onDeleteCourse(node.originalData)}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Delete Course
                    </DropdownMenuItem>
                  )}
                </>
              )}

              {isExam && (
                <>
                  {onDownloadExam && (
                    <DropdownMenuItem onClick={() => onDownloadExam(node.originalData)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download Zip
                    </DropdownMenuItem>
                  )}
                  {onEditExam && (
                    <DropdownMenuItem onClick={() => onEditExam(node.originalData)}>
                      <Pen className="w-4 h-4 mr-2" />
                      Edit Exam
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {onCopy && (
                    <DropdownMenuItem onClick={() => onCopy(node)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Exam
                    </DropdownMenuItem>
                  )}
                  {clipboard && clipboard.type === 'question' && onPaste && (
                    <DropdownMenuItem onClick={() => onPaste(node)}>
                      <Clipboard className="w-4 h-4 mr-2 text-indigo-500" />
                      Paste Question
                    </DropdownMenuItem>
                  )}
                  {onDuplicate && (
                    <DropdownMenuItem onClick={() => onDuplicate(node)}>
                      <CopyPlus className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                  )}
                  {onMove && (
                    <DropdownMenuItem onClick={() => onMove(node)}>
                      <Move className="w-4 h-4 mr-2" />
                      Move Exam
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {onDeleteExam && (
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onDeleteExam(node.originalData)}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Delete Exam
                    </DropdownMenuItem>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
