/**
 * TreeContext.tsx
 *
 * Purpose:
 * Provides a React Context to share tree state and actions across all tree components
 * without prop drilling. Replaces passing 15+ props through every component layer.
 *
 * Responsibilities:
 * - Define TreeContextValue interface for all tree state
 * - Define TreeActions interface for grouped operations
 * - Provide TreeProvider component
 * - Export useTreeContext hook for consuming context
 *
 * Dependencies:
 * - React context hooks
 * - Type definitions from @/types
 */

import React, { createContext, useContext } from "react";
import type { CourseData, ExamsData, TreeNode } from "@/types";
import type { SearchScope } from "@/types";
import type { ClipboardContent } from "@/types";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface TreeActions {
  addCourse: () => void;
  addExam: (course: CourseData) => void;
  editCourse: (course: CourseData) => void;
  deleteCourse: (course: CourseData) => void;
  editExam: (exam: ExamsData) => void;
  deleteExam: (exam: ExamsData) => void;
  downloadExam: (exam: ExamsData) => void;
  copy: (node: TreeNode) => void;
  paste: (node: TreeNode) => void;
  move: (node: TreeNode) => void;
  duplicate: (node: TreeNode) => void;
  deleteQuestion: (node: TreeNode) => void;
}

export interface TreeContextValue {
  expandedKeys: Record<string, boolean>;
  selectedNode: TreeNode | null;
  filteredNodes: TreeNode[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  scope: SearchScope;
  setScope: (scope: SearchScope) => void;
  isPending: boolean;
  toggleExpand: (id: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  setSelectedNode: (node: TreeNode | string | null) => void;
  clipboard?: ClipboardContent | null;
  actions: TreeActions;
}

// ─────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────

const TreeContext = createContext<TreeContextValue | undefined>(undefined);

// ─────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────

interface TreeProviderProps {
  value: TreeContextValue;
  children: React.ReactNode;
}

export const TreeProvider: React.FC<TreeProviderProps> = ({ value, children }) => (
  <TreeContext.Provider value={value}>
    {children}
  </TreeContext.Provider>
);

// ─────────────────────────────────────────────────────────────
// Consumer hook
// ─────────────────────────────────────────────────────────────

export function useTreeContext(): TreeContextValue {
  const ctx = useContext(TreeContext);
  if (!ctx) {
    throw new Error("useTreeContext must be used inside a <TreeProvider>.");
  }
  return ctx;
}
