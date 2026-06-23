/**
 * DashboardLayout.tsx
 *
 * Purpose:
 * Main layout wrapper for the authenticated dashboard pages.
 *
 * Responsibilities:
 * - Wrap pages in TooltipProvider
 * - Render Header component
 * - Configure Sonner notification helper
 *
 * Dependencies:
 * - Header component
 * - Toaster (sonner)
 * - TooltipProvider (Shadcn UI)
 */

import { ReactNode, useEffect } from "react";
import { Header } from "./Header";
import { Toaster } from "@/components/ui/sonner";
import { SonnerTypes } from "../common/FlashHelper";
import { TooltipProvider } from "../ui/tooltip";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { router } from "@inertiajs/react";
import { useEchoChannel } from "@/hooks/use-echo-channel";

const DashboardLayout = ({ children }: { children: ReactNode }) => {


    return (
        <TooltipProvider>
            <Header />
            <main className="min-h-screen w-full bg-background text-foreground relative flex flex-col">
                <div className="grow w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 md:px-8 md:py-12">
                    {children}
                </div>
                <Toaster position="top-right" />
                <SonnerTypes />
            </main>
        </TooltipProvider>
    );
};

export { DashboardLayout };
