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
    success?: string;
    error?: string;
    info?: string;
    warning?: string;
}
export const useFlashMessage = () => {
    const flashMessage = usePage().props.flash as FlashMessage | null;
    return flashMessage;
};
