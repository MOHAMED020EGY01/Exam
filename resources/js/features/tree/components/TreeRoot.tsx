/**
 * TreeRoot.tsx
 *
 * Purpose:
 * Top-level container of the Courses Explorer tree.
 * Uses existing TreeContext (provided by Home.tsx)
 *
 * Responsibilities:
 * - Render title bar with explorer controls
 * - Render search bar with scope selector
 * - Render tree content with recursive rendering
 *
 * Dependencies:
 * - TreeContext (useTreeContext)
 * - SearchInput, RecursiveTree
 * - TreeIcon, ChevronIcon
 * - Lucide icons
 */

import React from "react";
import type { SearchScope } from "@/types";
import { useTreeContext } from "../context/TreeContext";
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
// TitleBar sub-component
// ─────────────────────────────────────────────────────────────

const TitleBar: React.FC = () => {
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
// TreeRoot — Layout
// ─────────────────────────────────────────────────────────────

export const TreeRoot: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-background border border-border rounded-xl shadow-sm min-h-[380px] md:min-h-[500px]">
      <TitleBar />
      <SearchBar />
      <TreeContent />
    </div>
  );
};
