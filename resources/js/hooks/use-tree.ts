/**
 * use-tree.ts
 *
 * Purpose:
 * Hook to manage all courses explorer tree state: expansion, selection, and search.
 *
 * Changes from previous version:
 * - useSearchScope logic merged directly here (useState + useTransition + debounce)
 *   so the separate use-search-scope.ts file is no longer needed.
 * - expandAll no longer requires nodes argument; it operates on safeInitialNodes internally.
 *
 * Responsibilities:
 * - Hold tree expanded folder keys and selected node
 * - Manage search query + scope with 200 ms debounce via useTransition
 * - Expose toggle / expand / collapse operations
 * - Compute filteredNodes via useMemo
 * - Auto-expand matched folders when search query changes
 *
 * Dependencies:
 * - Tree helper functions (lib/treeHelpers)
 */

import {
    useState,
    useMemo,
    useCallback,
    useEffect,
    useTransition,
} from "react";
import { filterTree, getFolderNodeIds } from "../lib/treeHelpers";
import { TreeNodeData } from "@/interface/global";
import { SearchScope } from "@/features/tree/SearchInput";

export function useTree(initialNodes: any) {
    // ── Tree UI state ───────────────────────────────────────────
    const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>(
        {},
    );
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    // ── Search state (previously in useSearchScope) ─────────────
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [scope, setScope] = useState<SearchScope>("all");
    const [isPending, startTransition] = useTransition();
    const [treeVersion, setTreeVersion] = useState(0);

    const refreshTree = useCallback(() => {
        setTreeVersion((v) => v + 1);
    }, []);
    /** 200 ms debounce — mirrors the old useSearchScope behaviour */
    useEffect(() => {
        const handler = setTimeout(() => {
            startTransition(() => {
                setDebouncedQuery(searchQuery);
            });
        }, 200);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // ── Safe-guard initial nodes ────────────────────────────────
    const safeInitialNodes = useMemo<TreeNodeData[]>(() => {
        return Array.isArray(initialNodes)
            ? initialNodes
            : initialNodes && typeof initialNodes === "object"
              ? Object.values(initialNodes)
              : [];
    }, [initialNodes]);

    // ── Recursive node finder ───────────────────────────────────
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

    const selectedNode = useMemo(
        () =>
            selectedNodeId
                ? findNodeById(safeInitialNodes, selectedNodeId)
                : null,
        [safeInitialNodes, selectedNodeId, findNodeById],
    );

    const handleSetSelectedNode = useCallback((node: any) => {
        if (!node) setSelectedNodeId(null);
        else if (typeof node === "string") setSelectedNodeId(node);
        else setSelectedNodeId(node.id);
    }, []);

    // ── Expansion helpers ───────────────────────────────────────
    const toggleExpand = useCallback((nodeId: string) => {
        setExpandedKeys((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
    }, []);

    const setExpand = useCallback((nodeId: string, isExpanded: boolean) => {
        setExpandedKeys((prev) => ({ ...prev, [nodeId]: isExpanded }));
    }, []);

    const expandAll = useCallback(() => {
        const folderIds = getFolderNodeIds(safeInitialNodes);
        const next: Record<string, boolean> = {};
        folderIds.forEach((id) => {
            next[id] = true;
        });
        setExpandedKeys(next);
    }, [safeInitialNodes]);

    const collapseAll = useCallback(() => {
        setExpandedKeys({});
    }, []);

    // ── Filtered nodes ──────────────────────────────────────────
    const filteredNodes = useMemo(
        () =>
            debouncedQuery.trim()
                ? filterTree(safeInitialNodes, debouncedQuery, scope)
                : safeInitialNodes,
        [safeInitialNodes, debouncedQuery, scope,treeVersion],
    );

    // Auto-expand matched folders when query changes
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

    // ── Public API ──────────────────────────────────────────────
    return {
        expandedKeys,
        selectedNode,
        filteredNodes,
        searchQuery,
        setSearchQuery,
        scope,
        setScope,
        isPending,
        toggleExpand,
        setExpand,
        expandAll,
        collapseAll,
        setSelectedNode: handleSetSelectedNode,
        refreshTree,
    };
}

export type UseTreeReturn = ReturnType<typeof useTree>;
export type { SearchScope };
