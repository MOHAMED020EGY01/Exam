/**
 * use-tree.ts
 *
 * Purpose:
 * Hook to manage courses explorer tree states (expansion states, selected node, search filters).
 *
 * Responsibilities:
 * - Hold tree expanded folder keys and selected node ID
 * - Provide search scoped query filtering
 * - Expose toggle / expand operations on tree nodes
 *
 * Dependencies:
 * - useSearchScope hook
 * - Tree helper functions (lib/treeHelpers)
 */

import { useState, useMemo, useCallback, useEffect } from "react";
import { filterTree, getFolderNodeIds } from "../lib/treeHelpers";
import { useSearchScope, SearchScope } from "./use-search-scope";
import { TreeNodeData } from "@/interface/global";

export function useTree(initialNodes: any) {
    const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>(
        {},
    );
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    // Hook-based Scoped search with debouncing & useTransition
    const {
        searchQuery,
        setSearchQuery,
        debouncedQuery,
        scope,
        setScope,
        isPending,
    } = useSearchScope();

    // Safeguard initial nodes input to ensure it is always an array
    const safeInitialNodes = useMemo(() => {
        return Array.isArray(initialNodes)
            ? initialNodes
            : initialNodes && typeof initialNodes === "object"
              ? Object.values(initialNodes)
              : [];
    }, [initialNodes]);

    // Recursively find a node by ID in tree
    const findNodeById = useCallback(
        (nodes: TreeNodeData[], id: string): TreeNodeData | null => {
            for (const node of nodes) {
                if (node.id === id) return node;
                if (node.children && node.children.length > 0) {
                    const found = findNodeById(node.children, id);
                    if (found) return found;
                }
            }
            return null;
        },
        [],
    );

    const selectedNode = useMemo(() => {
        if (!selectedNodeId) return null;
        return findNodeById(safeInitialNodes, selectedNodeId);
    }, [safeInitialNodes, selectedNodeId, findNodeById]);

    const handleSetSelectedNode = useCallback((node: any) => {
        if (!node) {
            setSelectedNodeId(null);
        } else if (typeof node === "string") {
            setSelectedNodeId(node);
        } else {
            setSelectedNodeId(node.id);
        }
    }, []);

    // Toggle node expansion state
    const toggleExpand = useCallback((nodeId: string) => {
        setExpandedKeys((prev) => ({
            ...prev,
            [nodeId]: !prev[nodeId],
        }));
    }, []);

    // Set expand state for a node explicitly
    const setExpand = useCallback((nodeId: string, isExpanded: boolean) => {
        setExpandedKeys((prev) => ({
            ...prev,
            [nodeId]: isExpanded,
        }));
    }, []);

    // Expand all folders in the current tree
    const expandAll = useCallback((nodes: TreeNodeData[]) => {
        const safeNodes = Array.isArray(nodes) ? nodes : [];
        const folderIds = getFolderNodeIds(safeNodes);
        const newExpanded: Record<string, boolean> = {};
        folderIds.forEach((id) => {
            newExpanded[id] = true;
        });
        setExpandedKeys(newExpanded);
    }, []);

    // Collapse all folders
    const collapseAll = useCallback(() => {
        setExpandedKeys({});
    }, []);

    // Filter tree based on query
    const filteredNodes = useMemo(() => {
        if (!debouncedQuery.trim()) {
            return safeInitialNodes;
        }
        return filterTree(safeInitialNodes, debouncedQuery, scope);
    }, [safeInitialNodes, debouncedQuery, scope]);

    // Auto-expand matched nodes in useEffect
    useEffect(() => {
        if (debouncedQuery.trim()) {
            const folderIds = getFolderNodeIds(filteredNodes);
            setExpandedKeys((prev) => {
                const merged = { ...prev };
                folderIds.forEach((id) => {
                    merged[id] = true;
                });
                return merged;
            });
        }
    }, [debouncedQuery, filteredNodes]);

    return {
        expandedKeys,
        selectedNode,
        searchQuery,
        setSearchQuery,
        scope,
        setScope,
        isPending,
        filteredNodes,
        toggleExpand,
        setExpand,
        expandAll: () => expandAll(safeInitialNodes),
        collapseAll,
        setSelectedNode: handleSetSelectedNode,
    };
}

export type UseTreeReturn = ReturnType<typeof useTree>;
export type { SearchScope };
