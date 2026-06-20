/**
 * global.d.ts
 *
 * Purpose:
 * Global TypeScript type definitions and window augmentations.
 *
 * Responsibilities:
 * - Augment Window interface with Axios and Ziggy route functions
 */

import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { AxiosInstance } from 'axios';
import { route as ziggyRoute } from 'ziggy-js'; // لو بتستخدم Ziggy

declare global {
    interface Window {
        axios: AxiosInstance;
    }

    var route: typeof ziggyRoute;
}

declare module '@inertiajs/react' {
    interface PageProps extends InertiaPageProps {}
}
