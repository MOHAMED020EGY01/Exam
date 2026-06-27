
import { useAuth } from "@/hooks/use-auth";
import { useEchoChannel } from "@/hooks/use-echo-channel";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

export function questionDeleteEvent() {
    const user = useAuth();
    useEchoChannel(
        `users.${user.user?.id}`,
        ".question.delete",
        (e: unknown) => {
            const data = e as {
                message: string;
                status: string;
            };
            switch (data.status) {
                case "success":
                    toast.success(data.message);
                    break;
                case "error":
                    toast.error(data.message);
                    break;
                default:
                    toast.error(data.message);
                    break;
            }
            router.reload({
                only: ["courses"],
            });
        },
        [user.user?.id]
    );
}