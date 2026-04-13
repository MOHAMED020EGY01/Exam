import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
interface ModalInterface<T> {
    open: boolean;
    children?: React.ReactNode;
    label: string;
    onOpenChange?: (open: boolean) => void;
}
const ModalDynamicAdvanced = <T extends Record<string, any>>({
    open,
    children,
    label,
    onOpenChange,
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
            <DialogContent className="sm:max-w-3xl" showCloseButton={false}>
                <DialogTitle className="text-lg font-semibold">
                    {label}
                </DialogTitle>
                {children}
            </DialogContent>
        </Dialog>
    );
};

export { ModalDynamicAdvanced };
