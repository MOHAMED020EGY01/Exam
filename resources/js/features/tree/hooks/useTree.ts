/**
 * useTree.ts
 *
 * Purpose:
 * Hook to manage all courses explorer tree state: expansion, selection, and search.
 *
 * Responsibilities:
 * - Hold tree expanded folder keys and selected node
 * - Manage search query + scope with 200 ms debounce via useTransition
 * - Expose toggle / expand / collapse operations
 * - Compute filtered nodes via useMemo
 * - Auto-expand matched folders when search query changes
 *
 * Dependencies:
 * - TreeNormalizer service
 * - Type definitions from @/types
 */

import {
    useState,
    useMemo,
    useCallback,
    useEffect,
    useTransition,
} from "react";
import { TreeNormalizerService } from "@/services";
import type { TreeNode, SearchScope } from "@/types";

export function useTree(initialNodes: unknown) {
    // ── Tree UI state ───────────────────────────────────────────
    const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>(
        {},
    );
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    // ── Search state ────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [scope, setScope] = useState<SearchScope>("all");
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const handler = setTimeout(() => {
            startTransition(() => {
                setDebouncedQuery(searchQuery);
            });
        }, 200);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // ── Safe-guard initial nodes ────────────────────────────────
    const safeInitialNodes = useMemo<TreeNode[]>(() => {
        return Array.isArray(initialNodes)
            ? initialNodes
            : initialNodes && typeof initialNodes === "object"
              ? Object.values(initialNodes)
              : [];
    }, [initialNodes]);

    // ── Recursive node finder ───────────────────────────────────
    const findNodeById = useCallback(
        (nodes: TreeNode[], id: string): TreeNode | null => {
            return TreeNormalizerService.findNodeById(nodes, id);
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

    const handleSetSelectedNode = useCallback(
        (node: TreeNode | string | null) => {
            if (!node) setSelectedNodeId(null);
            else if (typeof node === "string") setSelectedNodeId(node);
            else setSelectedNodeId(node.id);
        },
        [],
    );

    // ── Expansion helpers ───────────────────────────────────────
    const toggleExpand = useCallback((nodeId: string) => {
        setExpandedKeys((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
    }, []);

    const setExpand = useCallback((nodeId: string, isExpanded: boolean) => {
        setExpandedKeys((prev) => ({ ...prev, [nodeId]: isExpanded }));
    }, []);

    const expandAll = useCallback(() => {
        const folderIds =
            TreeNormalizerService.getFolderNodeIds(safeInitialNodes);
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
                ? TreeNormalizerService.filterTree(
                      safeInitialNodes,
                      debouncedQuery,
                      scope,
                  )
                : safeInitialNodes,
        [safeInitialNodes, debouncedQuery, scope],
    );

    // Auto-expand matched folders when query changes
    useEffect(() => {
        if (debouncedQuery.trim()) {
            const folderIds =
                TreeNormalizerService.getFolderNodeIds(filteredNodes);
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
    };
}

export type UseTreeReturn = ReturnType<typeof useTree>;
export type { SearchScope };
