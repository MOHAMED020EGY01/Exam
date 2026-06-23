import { toast } from "sonner";
import { useEffect } from "react";
import { useFlashMessage } from "@/hooks/use-flash-message";

export function SonnerTypes() {
    const flash = useFlashMessage();

    useEffect(() => {
        if (!flash) return;

        if (flash.success) {
            toast.success(flash.success);
        }

        if (flash.error) {
            toast.error(flash.error);
        }

        if (flash.info) {
            toast.info(flash.info);
        }

        if (flash.warning) {
            toast.warning(flash.warning);
        }
    }, [flash]);

    return null;
}
