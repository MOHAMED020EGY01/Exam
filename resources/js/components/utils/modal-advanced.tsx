import { Dialog, DialogContent } from "@/components/ui/dialog";
interface ModalInterface<T> {
    open: boolean;
    children?: React.ReactNode;
}
const ModalDynamicAdvanced = <T extends Record<string, any>>({
    open,
    children,
}: ModalInterface<T>) => {
    return (
        <Dialog open={open}>
            <DialogContent
                className="sm:max-w-3xl"
                showCloseButton={false}
            >
                {children}
            </DialogContent>
        </Dialog>
    );
};

export { ModalDynamicAdvanced };
