import { usePage } from "@inertiajs/react";
import { User } from "../interface/user-Interface";

export const useAuth = () => {
    const { auth } = usePage().props;
    return {
        user: (auth as { user?: User }).user || null,
        isAuth: !!(auth as { user?: User }).user,
    }
}

