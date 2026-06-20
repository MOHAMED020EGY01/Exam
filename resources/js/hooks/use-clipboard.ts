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
 * - Inertia router
 * - TreeNodeData interface
 */

import { useState } from "react";
import { router } from "@inertiajs/react";
import { QuestionsData, TreeNodeData } from "@/interface/global";

// Declare route function for TS compilation
declare function route(name: string, params?: any): string;

export function useClipboard() {
    const [clipboard, setClipboard] = useState<any>(null);
    const [moveTarget, setMoveTarget] = useState<TreeNodeData | null>(null);
    const [moveOpen, setMoveOpen] = useState(false);
    const [isClipboardProcessing, setIsClipboardProcessing] = useState(false);

    //TODO Copy File Function

    const handleCopy = (node: TreeNodeData) => {
        setClipboard({
            type: node.type,
            id: node.id,
            originalId: node.originalId,
            parentId: node.parentId || "",
            originalData: node.originalData,
        });
    };

    //TODO Paste Function
    const handlePaste = (destinationNode: TreeNodeData) => {
        if (!clipboard) return;

        setIsClipboardProcessing(true);

        if (clipboard.type === "exam") {
            if (destinationNode.type !== "course") return;
            router.post(
                route("exams.paste"),
                {
                    exam_id: clipboard.originalId,
                    destination_course_id: destinationNode.originalId,
                },
                {
                    onFinish: () => setIsClipboardProcessing(false),
                },
            );
        } else if (clipboard.type === "question") {
            if (destinationNode.type !== "exam") return;
            router.post(
                route("questions.paste"),
                {
                    source_exam_id: clipboard.originalData.examId,
                    question_index: clipboard.originalId,
                    destination_exam_id: destinationNode.originalId,
                },
                {
                    onFinish: () => setIsClipboardProcessing(false),
                },
            );
        }
    };

    //TODO Duplicate Function
    const handleDuplicate = (node: TreeNodeData) => {
        setIsClipboardProcessing(true);
        if (node.type === "exam") {
            router.post(
                route("exams.duplicate"),
                {
                    exam_id: node.originalId,
                },
                {
                    onFinish: () => setIsClipboardProcessing(false),
                },
            );
        } else if (node.type === "question") {
            const exam_id = node.originalData as QuestionsData
            router.post(
                route("questions.duplicate"),
                {
                    exam_id: exam_id.examId,
                    question_index: node.originalId,
                },
                {
                    onFinish: () => setIsClipboardProcessing(false),
                },
            );
        }
    };

    //TODO MOVE Function
    const handleMove = (node: TreeNodeData) => {
        setMoveTarget(node);
        setMoveOpen(true);
    };

    //TODO MOVE Confirm Function
    const handleMoveConfirm = (destinationId: string | number) => {
        if (!moveTarget) return;

        setIsClipboardProcessing(true);

        if (moveTarget.type === "exam") {
            router.post(
                route("exams.move"),
                {
                    exam_id: moveTarget.originalId,
                    destination_course_id: destinationId,
                },
                {
                    onSuccess: () => {
                        setMoveOpen(false);
                        setMoveTarget(null);
                    },
                    onFinish: () => setIsClipboardProcessing(false),
                },
            );
        } else if (moveTarget.type === "question") {
            const source_exam_id = moveTarget.originalData as QuestionsData;

            router.post(
                route("questions.move"),
                {
                    source_exam_id: source_exam_id.examId,
                    question_index: moveTarget.originalId,
                    destination_exam_id: destinationId,
                },
                {
                    onSuccess: () => {
                        setMoveOpen(false);
                        setMoveTarget(null);
                    },
                    onFinish: () => setIsClipboardProcessing(false),
                },
            );
        }
    };

    //TODO Delete Question
    const handleDeleteQuestion = (node: TreeNodeData) => {
        if (confirm("Are you sure you want to delete this question?")) {
            setIsClipboardProcessing(true);
            const exam_id = node.originalData as QuestionsData;
            router.post(
                route("questions.delete"),
                {
                    exam_id: exam_id.examId,
                    question_index: node.originalId,
                },
                {
                    onFinish: () => setIsClipboardProcessing(false),
                },
            );
        }
    };

    //TODO Return handle
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
