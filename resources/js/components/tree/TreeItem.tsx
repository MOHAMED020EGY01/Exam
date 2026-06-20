/**
 * TreeItem.tsx
 *
 * Purpose:
 * Component that renders a question leaf node in the explorer tree.
 *
 * Responsibilities:
 * - Render question prompt prefix and label
 * - Display copied badge status when clipboard buffer targets this node
 * - Render dropdown action triggers (copy, move, duplicate, delete)
 *
 * Dependencies:
 * - TreeIcon component
 * - DropdownMenu (Shadcn UI)
 * - Lucide icons
 * - TreeNodeData interface
 */

import React from 'react';
import { TreeNodeData } from '@/interface/global';
import { TreeIcon } from './TreeIcon';
import { cn } from '@/lib/utils';
import {
  MoreVertical,
  Copy,
  Move,
  CopyPlus,
  Trash
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TreeItemProps {
  node: TreeNodeData;
  depth: number;
  isSelected: boolean;
  onSelect: (node: TreeNodeData) => void;

  // Clipboard & Move operations
  clipboard?: any;
  onCopy?: (node: TreeNodeData) => void;
  onMove?: (node: TreeNodeData) => void;
  onDuplicate?: (node: TreeNodeData) => void;
  onDeleteQuestion?: (node: TreeNodeData) => void;
}

export const TreeItem: React.FC<TreeItemProps> = ({
  node,
  depth,
  isSelected,
  onSelect,
  clipboard,
  onCopy,
  onMove,
  onDuplicate,
  onDeleteQuestion,
}) => {
  // Check if this item is currently copied
  const isCopied = clipboard && clipboard.id === node.id;

  return (
    <div
      onClick={() => onSelect(node)}
      style={{ ['--depth' as any]: depth }}
      className={cn(
        "flex items-center gap-2 py-1.5 pr-3 mx-1 my-0.5 rounded-md cursor-pointer transition-all duration-150 group text-sm select-none justify-between",
        "pl-[calc(var(--depth)*10px+12px)] md:pl-[calc(var(--depth)*16px+12px)]",
        isSelected
          ? "bg-primary/10 text-primary font-medium border-l-2 border-primary pl-[calc(var(--depth)*10px+10px)] md:pl-[calc(var(--depth)*16px+10px)]"
          : "text-foreground/80 hover:bg-foreground/5 hover:text-foreground",
        isCopied && "opacity-60 border-2 border-dashed border-primary/45 bg-primary/5 animate-pulse"
      )}
    >
      <div className="flex items-center gap-2 truncate flex-1">
        {/* Spacer to align with chevron folders */}
        <span className="w-3.5 h-3.5 flex-shrink-0" />

        <TreeIcon type="question" />

        <span className="truncate flex-1" title={node.label}>
          {node.label}
        </span>

        {/* Copied indicator */}
        {isCopied ? (
          <span className="text-[9px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-1.5 py-0.2 rounded-full animate-bounce shrink-0">
            Copied
          </span>
        ) : (
          /* Indicator badge for questions */
          <span className="opacity-0 group-hover:opacity-100 text-[10px] text-muted-foreground/60 bg-foreground/5 px-1.5 py-0.5 rounded transition-opacity duration-150 shrink-0">
            Q
          </span>
        )}
      </div>

      {/* Action Trigger Dropdown */}
      <div className="flex items-center flex-shrink-0 animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
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
            {onCopy && (
              <DropdownMenuItem onClick={() => onCopy(node)}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Question
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
                Move Question
              </DropdownMenuItem>
            )}
            {onDeleteQuestion && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDeleteQuestion(node)}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Delete Question
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
