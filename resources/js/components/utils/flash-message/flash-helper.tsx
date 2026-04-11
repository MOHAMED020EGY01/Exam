"use client";

import { toast, Toaster } from "sonner";
import { useEffect } from "react";
import { useFlashMessage } from "@/hooks/use-flash-message";

export function SonnerTypes() {
    const { type, message, title } = useFlashMessage() || {};
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
    }, [message]);

    return null;
}
