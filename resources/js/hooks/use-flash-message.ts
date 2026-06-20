/**
 * use-flash-message.ts
 *
 * Purpose:
 * Hook to access server flash messages from page properties.
 *
 * Responsibilities:
 * - Extract `flash_message` property from Inertia usePage props
 *
 * Dependencies:
 * - usePage (Inertia)
 */

import { usePage } from "@inertiajs/react";
export interface FlashMessage {
    code: string;
    message: string;
    title: string;
    type: "success" | "error" | "warning" | "info";
}
export const useFlashMessage = () => {
    const flashMessage = usePage().props.flash_message as FlashMessage | null;
    return flashMessage;
};
