/**
 * FlashHelper.tsx
 *
 * Purpose:
 * Monitors server-side flash message session variables and renders alerts as toast notifications.
 *
 * Responsibilities:
 * - Check for flash messages inside Inertia page props
 * - Call Sonner toast methods matching flash status (success, error, warning, info)
 *
 * Dependencies:
 * - toast/Toaster (sonner)
 * - useFlashMessage hook
 */

"use client";

import { toast } from "sonner";
import { useEffect } from "react";
import { useFlashMessage } from "@/hooks/use-flash-message";

export function SonnerTypes() {
    const { type, message } = useFlashMessage() || {};
    useEffect(() => {
        if (message) {
            switch (type) {
                case "success":
                    toast.success(message + " (" + type + ")");
                    break;
                case "error":
                    toast.error(message);
                    break;
                case "warning":
                    toast.warning(message);
                    break;
                case "info":
                    toast.info(message);
                    break;
                default:
                    toast(message);
            }
        }
    }, [message, type]);

    return null;
}
