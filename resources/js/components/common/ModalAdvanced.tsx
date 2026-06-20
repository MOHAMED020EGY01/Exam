/**
 * ModalAdvanced.tsx
 *
 * Purpose:
 * Renders an advanced custom modal with user escape validation.
 *
 * Responsibilities:
 * - Handle dialog open/close state
 * - Trigger browser confirm dialog when user attempts to close
 * - Render child content passed inside
 *
 * Dependencies:
 * - Dialog components (Shadcn UI)
 */

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ModalInterface<T> {
    open: boolean;
    children?: React.ReactNode;
    label: string;
    onOpenChange?: (open: boolean) => void;
    className?: string;
}

const ModalDynamicAdvanced = <T extends Record<string, any>>({
    open,
    children,
    label,
    onOpenChange,
    className,
}: ModalInterface<T>) => {
    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            const confirmClose = window.confirm("are you suer to exit this modal?");
            if (!confirmClose) return;
        }
        onOpenChange?.(nextOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className={cn("sm:max-w-xl", className)} showCloseButton={false}>
                <DialogTitle className="text-lg font-semibold sr-only">
                    {label}
                </DialogTitle>
                <DialogDescription className="sr-only">
                    Configure and manage exam details, questions, and choice configurations.
                </DialogDescription>
                {children}
            </DialogContent>
        </Dialog>
    );
};

export { ModalDynamicAdvanced };
