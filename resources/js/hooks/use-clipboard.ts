/**
 * use-clipboard.ts
 *
 * Purpose:
 * Hook encapsulating tree clipboard and drag-and-drop/move operations.
 *
 * Responsibilities:
 * - Hold copy/paste buffer (clipboard)
 * - Track active move node and target dialog state
 * - Dispatch copy, paste, duplicate, move, and question deletion API requests via Inertia
 *
 * Dependencies:
 * - ClipboardService
 * - Type definitions from @/types
 */

import { useState, useCallback } from "react";
import { ClipboardService } from "@/services";
import type { ClipboardContent, TreeNode } from "@/types";

export function useClipboard() {
    const [clipboard, setClipboard] = useState<ClipboardContent | null>(null);
    const [moveTarget, setMoveTarget] = useState<TreeNode | null>(null);
    const [moveOpen, setMoveOpen] = useState(false);
    const [isClipboardProcessing, setIsClipboardProcessing] = useState(false);

    const handleCopy = useCallback((node: TreeNode) => {
        setClipboard({
            type: node.type,
            id: node.id,
            originalId: node.originalId,
            parentId: node.parentId || "",
            originalData: node.originalData!,
        });
    }, []);

    const handlePaste = useCallback(
        (destinationNode: TreeNode) => {
            if (!clipboard) return;
            setIsClipboardProcessing(true);

            if (clipboard.type === "exam") {
                ClipboardService.pasteExam(clipboard, destinationNode, () =>
                    setIsClipboardProcessing(false),
                );
            } else if (clipboard.type === "question") {
                ClipboardService.pasteQuestion(clipboard, destinationNode, () =>
                    setIsClipboardProcessing(false),
                );
            }
        },
        [clipboard],
    );

    const handleDuplicate = useCallback((node: TreeNode) => {
        setIsClipboardProcessing(true);
        if (node.type === "exam") {
            ClipboardService.duplicateExam(node, () =>
                setIsClipboardProcessing(false),
            );
        } else if (node.type === "question") {
            ClipboardService.duplicateQuestion(node, () =>
                setIsClipboardProcessing(false),
            );
        }
    }, []);

    const handleMove = useCallback((node: TreeNode) => {
        setMoveTarget(node);
        setMoveOpen(true);
    }, []);

    const handleMoveConfirm = useCallback(
        (destinationId: string | number) => {
            if (!moveTarget) return;
            setIsClipboardProcessing(true);

            const onSuccess = () => {
                setMoveOpen(false);
                setMoveTarget(null);
            };

            const onFinish = () => setIsClipboardProcessing(false);

            if (moveTarget.type === "exam") {
                ClipboardService.moveExam(
                    moveTarget,
                    destinationId,
                    onSuccess,
                    onFinish,
                );
            } else if (moveTarget.type === "question") {
                ClipboardService.moveQuestion(
                    moveTarget,
                    destinationId,
                    onSuccess,
                    onFinish,
                );
            }
        },
        [moveTarget],
    );

    const handleDeleteQuestion = useCallback((node: TreeNode) => {
        if (confirm("Are you sure you want to delete this question?")) {
            setIsClipboardProcessing(true);
            ClipboardService.deleteQuestion(node, () =>
                setIsClipboardProcessing(false),
            );
        }
    }, []);

    return {
        clipboard,
        moveTarget,
        moveOpen,
        setMoveOpen,
        isClipboardProcessing,
        handleCopy,
        handlePaste,
        handleDuplicate,
        handleMove,
        handleMoveConfirm,
        handleDeleteQuestion,
    };
}
