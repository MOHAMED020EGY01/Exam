/**
 * ClipboardContext.tsx
 *
 * Purpose:
 * Provides React Context for clipboard and move operations, separated from TreeContext.
 *
 * Responsibilities:
 * - Holds clipboard state (clipboard, moveTarget, moveOpen, isClipboardProcessing)
 * - Exposes all clipboard actions
 */

import React, { createContext, useContext } from "react";
import { useClipboard } from "../hooks/useClipboard";
import type { ClipboardContent, TreeNode } from "@/types";

// Types
export interface ClipboardActions {
    copy: (node: TreeNode) => void;
    paste: (destinationNode: TreeNode) => void;
    duplicate: (node: TreeNode) => void;
    move: (node: TreeNode) => void;
    moveConfirm: (destinationId: string | number) => void;
    deleteQuestion: (node: TreeNode) => void;
}

export interface ClipboardContextValue {
    clipboard: ClipboardContent | null;
    moveTarget: TreeNode | null;
    moveOpen: boolean;
    setMoveOpen: (open: boolean) => void;
    isClipboardProcessing: boolean;
    actions: ClipboardActions;
}

// Context
const ClipboardContext = createContext<ClipboardContextValue | undefined>(
    undefined,
);

// Provider
interface ClipboardProviderProps {
    children: React.ReactNode;
}

export const ClipboardProvider: React.FC<ClipboardProviderProps> = ({
    children,
}) => {
    const state = useClipboard();
    const value: ClipboardContextValue = {
        clipboard: state.clipboard,
        moveTarget: state.moveTarget,
        moveOpen: state.moveOpen,
        setMoveOpen: state.setMoveOpen,
        isClipboardProcessing: state.isClipboardProcessing,
        actions: {
            copy: state.handleCopy,
            paste: state.handlePaste,
            duplicate: state.handleDuplicate,
            move: state.handleMove,
            moveConfirm: state.handleMoveConfirm,
            deleteQuestion: state.handleDeleteQuestion,
        },
    };

    return (
        <ClipboardContext.Provider value={value}>
            {children}
        </ClipboardContext.Provider>
    );
};

// Hook
export function useClipboardContext(): ClipboardContextValue {
    const ctx = useContext(ClipboardContext);
    if (!ctx) {
        throw new Error(
            "useClipboardContext must be used inside a <ClipboardProvider>.",
        );
    }
    return ctx;
}
