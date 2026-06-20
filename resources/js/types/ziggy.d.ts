/**
 * ziggy.d.ts
 *
 * Purpose:
 * Ziggy route helper global type definitions.
 *
 * Responsibilities:
 * - Declare route function overloads and Window's ziggy config object structure
 */

import { RouteParams, Router } from 'ziggy-js';

declare global {
    function route(): Router;
    function route(name: string, params?: RouteParams<typeof name>, absolute?: boolean): string;

    interface Window {
        ziggy: {
            url: string;
            port: number | null;
            defaults: Record<string, any>;
            routes: Record<string, any>;
        };
    }
}

export {};
