import { router } from "@inertiajs/react";

export const useLogout = () => {
    const logout = () => {
        router.delete('/logout', {
            onStart: () => {
                console.log('Logging out...');
            },
            onSuccess: () => {
                console.log('Logged out');
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    return { logout };
};