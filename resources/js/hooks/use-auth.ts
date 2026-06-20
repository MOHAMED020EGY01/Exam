/**
 * use-auth.ts
 *
 * Purpose:
 * Hook to access authenticated user data and authentication status.
 *
 * Responsibilities:
 * - Extract auth user properties from Inertia usePage props
 * - Calculate auth flag
 *
 * Dependencies:
 * - usePage (Inertia)
 * - User type definition
 */

import { usePage } from "@inertiajs/react";
import { User } from "../interface/user-Interface";

export const useAuth = () => {
    const { auth } = usePage().props;
    return {
        user: (auth as { user?: User }).user || null,
        isAuth: !!(auth as { user?: User }).user,
    }
}

