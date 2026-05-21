import { router } from "@inertiajs/react";

export const useLogout = () => {
    const logout = () => {
        router.delete(route('logout'), {
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    return { logout };
};