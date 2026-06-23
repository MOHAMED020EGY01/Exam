/**
 * TreeFolder.tsx
 *
 * Purpose:
 * Renders course and exam container nodes in the tree structure.
 *
 * Responsibilities:
 * - Display folder icon, label, and item count
 * - Show/hide expand/collapse chevron
 * - Render dropdown menu with course/exam actions
 * - Render children when expanded
 * - Display "Copied" indicator when node is in clipboard
 *
 * Dependencies:
 * - TreeIcon, ChevronIcon
 * - DropdownMenu (Shadcn UI)
 * - Lucide icons
 * - useTreeContext
 *
 * Notes:
 * - Moved from components/tree to features/tree for feature-based organization
 */

import React from "react";
import type { CourseData, ExamsData, TreeNode as TreeNodeType } from "@/types";
import { useTreeContext } from "./TreeContext";
import { TreeIcon, ChevronIcon } from "./TreeIcon";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TreeFolderProps {
  node: TreeNodeType;
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onSelect: (node: TreeNodeType) => void;
  children?: React.ReactNode;
}

const TreeFolderInner: React.FC<TreeFolderProps> = ({
    node,
    depth,
    isExpanded,
    isSelected,
    onToggle,
    onSelect,
    children,
}) => {
    // Pull all action callbacks and clipboard from context
    const { actions, clipboard } = useTreeContext();

    const isCourse = node.type === "course";
    const isExam = node.type === "exam";
    const isCopied = clipboard?.id === node.id;

    const handleChevronClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggle(node.id);
    };

    return (
        <div className="w-full">
            {/* Folder Row */}
            <div
                onClick={() => onSelect(node)}
                style={{ ["--depth" as any]: depth }}
                className={cn(
                    "flex items-center gap-2 py-1.5 pr-3 mx-1 my-0.5 rounded-md cursor-pointer transition-all duration-150 group text-sm select-none justify-between",
                    "pl-[calc(var(--depth)*10px+12px)] md:pl-[calc(var(--depth)*16px+12px)]",
                    isSelected
                        ? "bg-primary/10 text-primary font-medium border-l-2 border-primary pl-[calc(var(--depth)*10px+10px)] md:pl-[calc(var(--depth)*16px+10px)]"
                        : "text-foreground hover:bg-foreground/5",
                    isCopied &&
                        "opacity-60 border-2 border-dashed border-primary/45 bg-primary/5 animate-pulse",
                )}
            >
                <div className="flex items-center gap-2 truncate flex-1">
                    <ChevronIcon
                        expanded={isExpanded}
                        onClick={handleChevronClick}
                    />
                    <TreeIcon type={node.type} expanded={isExpanded} />
                    <span className="truncate font-medium" title={node.label}>
                        {node.label}
                    </span>

                    {/* Item count badge */}
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

                {/* Dropdown Action Menu */}
                <div
                    className="flex items-center shrink-0"
                    onClick={(e) => e.stopPropagation()}
                >
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
                            {/* ── Course actions ─────────────────────────────── */}
                            {isCourse && (
                                <>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            actions.addExam(
                                                node.originalData as CourseData,
                                            )
                                        }
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Exam
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() =>
                                            actions.editCourse(
                                                node.originalData as CourseData,
                                            )
                                        }
                                    >
                                        <Pen className="w-4 h-4 mr-2" />
                                        Edit Course
                                    </DropdownMenuItem>

                                    {clipboard?.type === "exam" && (
                                        <DropdownMenuItem
                                            onClick={() => actions.paste(node)}
                                        >
                                            <Clipboard className="w-4 h-4 mr-2 text-indigo-500" />
                                            Paste Exam
                                        </DropdownMenuItem>
                                    )}

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        variant="destructive"
                                        onClick={() =>
                                            actions.deleteCourse(
                                                node.originalData as CourseData,
                                            )
                                        }
                                    >
                                        <Trash className="w-4 h-4 mr-2" />
                                        Delete Course
                                    </DropdownMenuItem>
                                </>
                            )}

                            {/* ── Exam actions ────────────────────────────────── */}
                            {isExam && (
                                <>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            actions.downloadExam(
                                                node.originalData as ExamsData,
                                            )
                                        }
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Zip
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() =>
                                            actions.editExam(
                                                node.originalData as ExamsData,
                                            )
                                        }
                                    >
                                        <Pen className="w-4 h-4 mr-2" />
                                        Edit Exam
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        onClick={() => actions.copy(node)}
                                    >
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy Exam
                                    </DropdownMenuItem>

                                    {clipboard?.type === "question" && (
                                        <DropdownMenuItem
                                            onClick={() => actions.paste(node)}
                                        >
                                            <Clipboard className="w-4 h-4 mr-2 text-indigo-500" />
                                            Paste Question
                                        </DropdownMenuItem>
                                    )}

                                    <DropdownMenuItem
                                        onClick={() => actions.duplicate(node)}
                                    >
                                        <CopyPlus className="w-4 h-4 mr-2" />
                                        Duplicate
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => actions.move(node)}
                                    >
                                        <Move className="w-4 h-4 mr-2" />
                                        Move Exam
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        variant="destructive"
                                        onClick={() =>
                                            actions.deleteExam(
                                                node.originalData as ExamsData,
                                            )
                                        }
                                    >
                                        <Trash className="w-4 h-4 mr-2" />
                                        Delete Exam
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Children */}
            {isExpanded && children && (
                <div className="flex flex-col">{children}</div>
            )}
        </div>
    );
};

export const TreeFolder = React.memo(
    TreeFolderInner,
    (prev, next) =>
        prev.node.id === next.node.id &&
        prev.isExpanded === next.isExpanded &&
        prev.isSelected === next.isSelected &&
        // Re-render when clipboard targets this node or leaves it
        (prev as any).__clipboardId === (next as any).__clipboardId,
);

TreeFolder.displayName = "TreeFolder";
