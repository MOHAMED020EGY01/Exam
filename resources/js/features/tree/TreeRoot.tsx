/**
 * TreeRoot.tsx
 *
 * Purpose:
 * Top-level container of the Courses Explorer tree.
 * Acts as the Context Provider — it builds TreeContextValue from its props
 * and wraps all sub-components inside <TreeProvider>.
 *
 * Responsibilities:
 * - Provide TreeContext to all tree components
 * - Render title bar with explorer controls
 * - Render search bar with scope selector
 * - Render tree content with recursive rendering
 *
 * Dependencies:
 * - TreeContext (TreeProvider, useTreeContext)
 * - SearchInput, RecursiveTree
 * - TreeIcon, ChevronIcon
 * - Lucide icons
 *
 * Notes:
 * - Moved from components/tree to features/tree for feature-based organization
 */

import React, { useMemo } from "react";
import type { CourseData, ExamsData, TreeNode as TreeNodeType, SearchScope } from "@/types";
import { TreeProvider, TreeContextValue, useTreeContext } from "./TreeContext";
import { RecursiveTree } from "./RecursiveTree";
import { TreeIcon, ChevronIcon } from "./TreeIcon";
import { SearchInput } from "./SearchInput";
import {
    Search,
    FolderPlus,
    ChevronsDown,
    ChevronsUp,
    FolderTree,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// TreeRoot props — same external API as before (no breaking change)
// ─────────────────────────────────────────────────────────────

interface TreeRootProps {
    // Data from useTree hook
    filteredNodes: TreeNodeType[];
    expandedKeys: Record<string, boolean>;
    selectedNode: TreeNodeType | null;
    toggleExpand: (id: string) => void;
    setSelectedNode: (node: TreeNodeType | string | null) => void;
    expandAll: () => void;
    collapseAll: () => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    scope: SearchScope;
    setScope: (scope: SearchScope) => void;
    isPending: boolean;

    // Callback actions (passed from parent, forwarded into context)
    onAddCourse: () => void;
    onAddExam: (course: CourseData) => void;
    onEditCourse: (course: CourseData) => void;
    onDeleteCourse: (course: CourseData) => void;
    onEditExam: (exam: ExamsData) => void;
    onDeleteExam: (exam: ExamsData) => void;
    onDownloadExam: (exam: ExamsData) => void;

    // Clipboard & move operations
    clipboard?: any;
    onCopy?: (node: TreeNodeType) => void;
    onPaste?: (node: TreeNodeType) => void;
    onMove?: (node: TreeNodeType) => void;
    onDuplicate?: (node: TreeNodeType) => void;
    onDeleteQuestion?: (node: TreeNodeType) => void;
}

// ─────────────────────────────────────────────────────────────
// TitleBar sub-component
// ─────────────────────────────────────────────────────────────

const TitleBar: React.FC = (props) => {
    console.log("🌳 TreeRoot Render", props);
    const { expandAll, collapseAll, actions } = useTreeContext();

    return (
        <div className="flex items-center justify-between p-3 border-b border-border select-none bg-muted/20">
            <div className="flex items-center gap-2 font-semibold text-xs tracking-wider uppercase text-muted-foreground">
                <FolderTree className="w-4 h-4 text-primary" />
                Explorer
            </div>
            <div className="flex items-center gap-1.5">
                <button
                    onClick={actions.addCourse}
                    className="p-1 hover:bg-foreground/5 rounded text-muted-foreground hover:text-foreground transition-colors"
                    title="Create Course"
                >
                    <FolderPlus className="w-4 h-4" />
                </button>
                <button
                    onClick={expandAll}
                    className="p-1 hover:bg-foreground/5 rounded text-muted-foreground hover:text-foreground transition-colors"
                    title="Expand All"
                >
                    <ChevronsDown className="w-4 h-4" />
                </button>
                <button
                    onClick={collapseAll}
                    className="p-1 hover:bg-foreground/5 rounded text-muted-foreground hover:text-foreground transition-colors"
                    title="Collapse All"
                >
                    <ChevronsUp className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
// SearchBar sub-component
// ─────────────────────────────────────────────────────────────

const SearchBar: React.FC = () => {
    const { searchQuery, setSearchQuery, scope, setScope, isPending } =
        useTreeContext();

    return (
        <div className="p-3 border-b border-border bg-muted/10">
            <SearchInput
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                scope={scope as SearchScope}
                setScope={setScope}
                isPending={isPending}
            />
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
// TreeContent sub-component
// ─────────────────────────────────────────────────────────────

const TreeContent: React.FC = () => {
    const { filteredNodes, expandedKeys, toggleExpand, scope } =
        useTreeContext();

    const isRootExpanded = expandedKeys["root"] !== false; // default true

    return (
        <div className="flex-1 overflow-y-auto p-2 min-h-[200px] md:min-h-[300px]">
            {/* Virtual Root Folder: Courses */}
            <div>
                <div
                    onClick={() => toggleExpand("root")}
                    className="flex items-center gap-2 py-1.5 px-3 mx-1 my-0.5 rounded-md cursor-pointer transition-colors duration-150 text-sm select-none hover:bg-foreground/5 text-foreground"
                >
                    <ChevronIcon expanded={isRootExpanded} />
                    <TreeIcon type="root" />
                    <span className="font-semibold truncate">Courses</span>
                    <span className="text-[10px] text-muted-foreground/60 bg-foreground/5 px-2 py-0.5 rounded font-normal ml-auto">
                        {filteredNodes.length}
                    </span>
                </div>

                {/* Root's children */}
                {isRootExpanded && (
                    <div className="flex flex-col mt-1">
                        {filteredNodes.length > 0 ? (
                            <RecursiveTree nodes={filteredNodes} depth={1} />
                        ) : (
                            <div className="p-8 text-xs text-muted-foreground text-center flex flex-col items-center justify-center gap-2 select-none">
                                <Search className="w-8 h-8 text-muted-foreground/30 stroke-[1.5]" />
                                <span>
                                    No results found in scope "
                                    {scope === "all"
                                        ? "All"
                                        : scope === "course"
                                          ? "Courses"
                                          : scope === "exam"
                                            ? "Exams"
                                            : "Questions"}
                                    ".
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
// TreeRoot — Context Provider + Layout
// ─────────────────────────────────────────────────────────────

export const TreeRoot: React.FC<TreeRootProps> = ({
    filteredNodes,
    expandedKeys,
    selectedNode,
    toggleExpand,
    setSelectedNode,
    expandAll,
    collapseAll,
    searchQuery,
    setSearchQuery,
    scope,
    setScope,
    isPending,
    onAddCourse,
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
    /**
     * Build the context value once per render — useMemo keeps the reference
     * stable so child components that depend on context won't re-render
     * unless something actually changed.
     */
    const contextValue = useMemo<TreeContextValue>(
        () => ({
            // Tree state
            expandedKeys,
            selectedNode,
            filteredNodes,

            // Search state
            searchQuery,
            setSearchQuery,
            scope: scope as SearchScope,
            setScope: setScope as (scope: SearchScope) => void,
            isPending,

            // Tree helpers
            toggleExpand,
            expandAll,
            collapseAll,
            setSelectedNode,

            // Clipboard
            clipboard,

            // Grouped actions
            actions: {
                addCourse: onAddCourse,
                addExam: onAddExam,
                editCourse: onEditCourse,
                deleteCourse: onDeleteCourse,
                editExam: onEditExam,
                deleteExam: onDeleteExam,
                downloadExam: onDownloadExam,
                copy: onCopy ?? (() => {}),
                paste: onPaste ?? (() => {}),
                move: onMove ?? (() => {}),
                duplicate: onDuplicate ?? (() => {}),
                deleteQuestion: onDeleteQuestion ?? (() => {}),
            },
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            expandedKeys,
            selectedNode,
            filteredNodes,
            searchQuery,
            setSearchQuery,
            scope,
            setScope,
            isPending,
            toggleExpand,
            expandAll,
            collapseAll,
            setSelectedNode,
            clipboard,
            onAddCourse,
            onAddExam,
            onEditCourse,
            onDeleteCourse,
            onEditExam,
            onDeleteExam,
            onDownloadExam,
            onCopy,
            onPaste,
            onMove,
            onDuplicate,
            onDeleteQuestion,
        ],
    );

    return (
        <TreeProvider value={contextValue}>
            <div className="flex flex-col h-full bg-background border border-border rounded-xl shadow-sm min-h-[380px] md:min-h-[500px]">
                <TitleBar />
                <SearchBar />
                <TreeContent />
            </div>
        </TreeProvider>
    );
};
