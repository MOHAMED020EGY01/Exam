import { ReactNode, useState } from "react";
import { Footer, Navbar, Sidebar } from "../page-component";
import { Toaster } from "@/components/ui/sonner";
import { SonnerTypes } from "../utils/flash-message/flash-helper";
import { useAuth } from "@/hooks/use-auth";
import { TooltipProvider } from "../ui/tooltip";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);
    const auth = useAuth().isAuth;
    return (
        <TooltipProvider>
            <main className="flex gap-4 min-h-screen p-4 bg-background-secondary">
                {auth && <Sidebar open={open} />}
                <div className="flex flex-col gap-4 w-full mx-auto">
                    <Navbar open={open} setOpen={setOpen} />
                    <div className="grow card-page">{children}</div>
                    <div className="card-page">
                        <Footer />
                        <Toaster position="top-right" />
                        <SonnerTypes />
                    </div>
                </div>
            </main>
        </TooltipProvider>
    );
};

export { DashboardLayout };
