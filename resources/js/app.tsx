/**
 * app.tsx
 *
 * Purpose:
 * Entry point of the React application initialized under Laravel Inertia.
 *
 * Responsibilities:
 * - Boot up Inertia.js app
 * - Wrap application in ThemeProvider
 * - Handle custom defaults and page prefetching
 *
 * Dependencies:
 * - createInertiaApp (Inertia)
 * - ThemeProvider (Common components)
 */

import './bootstrap';
import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ThemeProvider } from './components/common/ThemeProvider';

createInertiaApp({
    title: (title) => `${title} - Exam App`,
    resolve: (name) =>
        resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        createRoot(el).render(
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <App {...props} />
            </ThemeProvider>
        );
    },

    defaults: {
        form: {
            recentlySuccessfulDuration: 5000,
        },
        prefetch: {
            cacheFor: "1m",
            hoverDelay: 150,
        },
        visitOptions: (href, options) => {
            return {
                headers: {
                    ...options.headers,
                    "X-Custom-Header": "value",
                },
            };
        },
    },
});
