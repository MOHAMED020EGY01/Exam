/**
 * TreeNodeRenderer.tsx
 *
 * Purpose:
 * Decides whether to render a folder node (TreeFolder) or leaf node (TreeItem)
 * based on node.type, and handles recursive child rendering.
 *
 * Responsibilities:
 * - Route rendering based on node type
 * - Render TreeFolder for courses/exams
 * - Render TreeItem for questions
 * - Render RecursiveTree for children
 *
 * Dependencies:
 * - TreeFolder, TreeItem, RecursiveTree
 * - useTreeContext
 *
 */

import React from "react";
import type { TreeNode as TreeNodeType } from "@/types";
import { useTreeContext } from "../context/TreeContext";
import { TreeFolder } from "./TreeFolder";
import { TreeItem } from "./TreeItem";
import { RecursiveTree } from "./RecursiveTree";

interface TreeNodeRendererProps {
    node: TreeNodeType;
    depth: number;
}

export function TreeNodeRenderer({ node, depth }: TreeNodeRendererProps) {
    const { expandedKeys, selectedNode, toggleExpand, setSelectedNode } =
        useTreeContext();

    const isExpanded = !!expandedKeys[node.id];
    const isSelected = selectedNode?.id === node.id;

    if (node.type === "question") {
        return (
            <TreeItem
                node={node}
                depth={depth}
                isSelected={isSelected}
                onSelect={setSelectedNode}
            />
        );
    }

    return (
        <TreeFolder
            node={node}
            depth={depth}
            isExpanded={isExpanded}
            isSelected={isSelected}
            onToggle={toggleExpand}
            onSelect={setSelectedNode}
        >
            {node.children && node.children.length > 0 && (
                <RecursiveTree nodes={node.children} depth={depth + 1} />
            )}
        </TreeFolder>
    );
}
