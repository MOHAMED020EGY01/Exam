import { useAuth } from "@/hooks/use-auth";
import { useEchoChannel } from "@/hooks/use-echo-channel";
import { ExamsData } from "@/types";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

export function examUpdateEvent() {
    const user = useAuth();
    useEchoChannel(
        `users.${user.user?.id}`,
        ".exam.updated",
        (e: unknown) => {
            const data = e as { exam: ExamsData };
            toast.success(`Exam "${data.exam.name}" updated`);
            router.reload({
                only: ["courses"],
            });
        },
        [user.user?.id]
    );
}