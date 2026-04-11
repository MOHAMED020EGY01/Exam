import { Link } from "@inertiajs/react";
import { Book, HomeIcon, InfoIcon, PhoneIcon, Sheet } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggleTheme } from "@/components/ui/mode-toggle";
import { openSetOpenInterface } from "@/interface/global";
import { Hamburger } from "@/components/utils/hamburger";
import { AvatarBadgeIcon } from "@/components/utils/avatar";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const content = [
    { icon: HomeIcon, name: "Home", link: route("home") },
    { icon: Book, name: "Courses", link: route("courses.index") },
    { icon: Sheet, name: "Exam", link: route("exams.all") },
];

const Sidebar = ({ open = false }: { open: boolean }) => {
    return (
        <div className={cn("card-page", open ? "w-64 p-4" : "w-16 p-0 py-4")}>
            <ul className="flex flex-col gap-4 ">
                {content.map((item, index) => (
                    <li
                        key={index}
                        className="hover:bg-foreground/10 p-2 rounded-lg"
                    >
                        <Link href={item.link}>
                            <div
                                className={cn(
                                    "flex items-center gap-2",
                                    open ? "justify-start" : "justify-center",
                                )}
                            >
                                <Tooltip>
                                    <TooltipTrigger>
                                        <item.icon />
                                    </TooltipTrigger>
                                    {!open && (
                                        <TooltipContent side="right">
                                            {<span>{item.name}</span>}
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                                {open && <span>{item.name}</span>}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const footer = [
    { text: "Privacy", href: "#" },
    { text: "Terms", href: "#" },
    { text: "Contact", href: "#" },
];

const Footer = () => {
    const data = new Date();
    return (
        <footer className="w-full flex-just-bet-gap-4">
            <div className="text-mute">
                &copy; {data.getFullYear()} Mohamed Hussein
            </div>
            <div className="flex gap-6">
                {footer.map((item, index) => (
                    <Link key={index} className="text-mute" href={item.href}>
                        {item.text}
                    </Link>
                ))}
            </div>
        </footer>
    );
};

const Navbar = ({ open, setOpen }: openSetOpenInterface) => {
    const user = useAuth();
    return (
        <div className="card-page text-xs">
            <div className="flex justify-between">
                {user?.isAuth && <Hamburger open={open} setOpen={setOpen} />}
                {user?.isAuth ? (
                    <div className="flex items-center gap-2">
                        <ModeToggleTheme />
                        <AvatarBadgeIcon />
                    </div>
                ) : (
                    <div className="flex gap-2 ml-auto">
                        <Button asChild>
                            <div>
                                <Link href={route("login")}>Login</Link>
                            </div>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export { Footer, Sidebar, Navbar };
