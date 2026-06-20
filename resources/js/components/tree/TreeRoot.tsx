/**
 * TreeRoot.tsx
 *
 * Purpose:
 * Renders the top-level container of the Courses Explorer tree.
 *
 * Responsibilities:
 * - Render explorer title actions (expand all, collapse all, add course)
 * - Render scoped SearchInput wrapper
 * - Render virtual root folder (Courses)
 * - Render nested children using RecursiveTree component
 *
 * Dependencies:
 * - SearchInput and RecursiveTree components
 * - Lucide icons
 * - TreeNodeData interface
 */

import React from 'react';
import { TreeNodeData } from '@/lib/treeHelpers';
import { RecursiveTree } from './RecursiveTree';
import { TreeIcon, ChevronIcon } from './TreeIcon';
import { Search, FolderPlus, ChevronsDown, ChevronsUp, FolderTree } from 'lucide-react';
import { SearchInput, SearchScope } from './SearchInput';

interface TreeRootProps {
  filteredNodes: TreeNodeData[];
  expandedKeys: Record<string, boolean>;
  selectedNode: TreeNodeData | null;
  toggleExpand: (id: string) => void;
  setSelectedNode: (node: TreeNodeData) => void;
  expandAll: () => void;
  collapseAll: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  scope: string;
  setScope: (scope: any) => void;
  isPending: boolean;

  // Callback actions
  onAddCourse: () => void;
  onAddExam: (course: any) => void;
  onEditCourse: (course: any) => void;
  onDeleteCourse: (course: any) => void;
  onEditExam: (exam: any) => void;
  onDeleteExam: (exam: any) => void;
  onDownloadExam: (exam: any) => void;

  // Clipboard & Move operations
  clipboard?: any;
  onCopy?: (node: TreeNodeData) => void;
  onPaste?: (node: TreeNodeData) => void;
  onMove?: (node: TreeNodeData) => void;
  onDuplicate?: (node: TreeNodeData) => void;
  onDeleteQuestion?: (node: TreeNodeData) => void;
}

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
  const isRootExpanded = expandedKeys['root'] !== false; // Default expanded to true

  return (
    <div className="flex flex-col h-full bg-background border border-border rounded-xl shadow-sm min-h-[380px] md:min-h-[500px]">
      {/* Explorer Title Bar */}
      <div className="flex items-center justify-between p-3 border-b border-border select-none bg-muted/20">
        <div className="flex items-center gap-2 font-semibold text-xs tracking-wider uppercase text-muted-foreground">
          <FolderTree className="w-4 h-4 text-primary" />
          Explorer
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onAddCourse}
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

      {/* Explorer Search Scoped Input */}
      <div className="p-3 border-b border-border bg-muted/10">
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          scope={scope as SearchScope}
          setScope={setScope}
          isPending={isPending}
        />
      </div>

      {/* Hierarchical Folder Structure List */}
      <div className="flex-1 overflow-y-auto p-2 min-h-[200px] md:min-h-[300px]">
        {/* Virtual Root Folder: Courses */}
        <div>
          <div
            onClick={() => toggleExpand('root')}
            className={`flex items-center gap-2 py-1.5 px-3 mx-1 my-0.5 rounded-md cursor-pointer transition-colors duration-150 text-sm select-none hover:bg-foreground/5 ${
              selectedNode?.id === 'root' 
                ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary pl-2.5' 
                : 'text-foreground'
            }`}
          >
            <ChevronIcon expanded={isRootExpanded} />
            <TreeIcon type="root" />
            <span className="font-semibold truncate">Courses</span>
            <span className="text-[10px] text-muted-foreground/60 bg-foreground/5 px-2 py-0.5 rounded font-normal ml-auto">
              {filteredNodes.length}
            </span>
          </div>

          {/* Root's Children list */}
          {isRootExpanded && (
            <div className="flex flex-col mt-1">
              {filteredNodes.length > 0 ? (
                <RecursiveTree
                  nodes={filteredNodes}
                  depth={1}
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
              ) : (
                <div className="p-8 text-xs text-muted-foreground text-center flex flex-col items-center justify-center gap-2 select-none">
                  <Search className="w-8 h-8 text-muted-foreground/30 stroke-[1.5]" />
                  <span>No results found in scope "{scope === 'all' ? 'All' : scope === 'course' ? 'Courses' : scope === 'exam' ? 'Exams' : 'Questions'}".</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
