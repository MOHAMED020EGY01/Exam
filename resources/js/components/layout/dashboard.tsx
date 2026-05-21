import { ReactNode } from "react";
import { Header } from "./header";
import { Toaster } from "@/components/ui/sonner";
import { SonnerTypes } from "../utils/flash-message/flash-helper";
import { TooltipProvider } from "../ui/tooltip";

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
