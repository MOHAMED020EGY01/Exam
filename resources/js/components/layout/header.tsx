import { useAuth } from "@/hooks/use-auth";
import { ModeToggleTheme } from "@/components/ui/mode-toggle";
import { AvatarBadgeIcon } from "@/components/utils/avatar";

export const Header = () => {
    const user = useAuth();
    if (!user?.isAuth) return null;

    return (
        <div className="fixed top-2.5 right-2.5 md:top-4 md:right-4 z-50 flex items-center gap-1.5 md:gap-2.5 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-border/60 bg-background/80 backdrop-blur-md shadow-sm select-none transition-all duration-300 hover:shadow-md hover:border-border">
            <ModeToggleTheme className="w-7 h-7 md:w-8 md:h-8 p-1 md:p-1.5 rounded-full shrink-0" />
            <div className="w-px h-3.5 md:h-4 bg-border/80 shrink-0" />
            <AvatarBadgeIcon />
        </div>
    );
};
