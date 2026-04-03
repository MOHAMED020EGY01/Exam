// resources/js/types/ziggy.d.ts
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
