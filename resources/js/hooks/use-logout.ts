/**
 * use-logout.ts
 *
 * Purpose:
 * Hook providing a logout trigger dispatching requests to the backend route.
 *
 * Responsibilities:
 * - Make DELETE call to the logout route
 * - Log any errors on request failures
 *
 * Dependencies:
 * - Inertia router
 */

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