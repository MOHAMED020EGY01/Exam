/**
 * TreeContext.tsx
 *
 * Purpose:
 * Provides a React Context to share tree state and actions across all tree components
 * without prop drilling. Replaces passing 15+ props through every component layer.
 *
 * Exports:
 * - TreeContextValue   — Type definition for everything the context holds
 * - TreeProvider       — Wrapper component that supplies the context value
 * - useTreeContext     — Custom hook to consume the context (with existence guard)
 */

import React, { createContext, useContext } from 'react';
import { CourseData, ExamsData, TreeNodeData } from '@/interface/global';
import { SearchScope } from './SearchInput';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

/**
 * All discrete CRUD / clipboard operations grouped in one object.
 * Components call e.g. `actions.copy(node)` instead of receiving
 * a separate `onCopy` prop.
 */
export interface TreeActions {
  addCourse:      ()                        => void;
  addExam:        (course: CourseData)      => void;
  editCourse:     (course: CourseData)      => void;
  deleteCourse:   (course: CourseData)      => void;
  editExam:       (exam: ExamsData)         => void;
  deleteExam:     (exam: ExamsData)         => void;
  downloadExam:   (exam: ExamsData)         => void;
  copy:           (node: TreeNodeData)      => void;
  paste:          (node: TreeNodeData)      => void;
  move:           (node: TreeNodeData)      => void;
  duplicate:      (node: TreeNodeData)      => void;
  deleteQuestion: (node: TreeNodeData)      => void;
}

export interface TreeContextValue {
  // ── Tree state ───────────────────────────────────────────
  expandedKeys:   Record<string, boolean>;
  selectedNode:   TreeNodeData | null;
  filteredNodes:  TreeNodeData[];

  // ── Search / filter state ────────────────────────────────
  searchQuery:    string;
  setSearchQuery: (query: string) => void;
  scope:          SearchScope;
  setScope:       (scope: SearchScope) => void;
  isPending:      boolean;

  // ── Tree manipulation helpers ────────────────────────────
  toggleExpand:    (id: string)          => void;
  expandAll:       ()                    => void;
  collapseAll:     ()                    => void;
  setSelectedNode: (node: TreeNodeData)  => void;

  // ── Clipboard state ──────────────────────────────────────
  clipboard?: any;

  // ── Grouped action handlers ──────────────────────────────
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

/**
 * Must be used inside <TreeProvider>.
 * Throws a descriptive error if called outside the provider tree.
 */
export function useTreeContext(): TreeContextValue {
  const ctx = useContext(TreeContext);
  if (!ctx) {
    throw new Error('useTreeContext must be used inside a <TreeProvider>.');
  }
  return ctx;
}
