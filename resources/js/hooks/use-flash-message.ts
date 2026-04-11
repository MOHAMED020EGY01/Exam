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
