import { Link } from "@inertiajs/react";
import { HomeIcon, InfoIcon, PhoneIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {AvatarBadgeIcon, Hamburger} from "./utils";
import { ModeToggleTheme } from "./ui/mode-toggle";

const content = [
    {icon: HomeIcon,name: "Home", link: "/"},
    {icon: InfoIcon,name: "About", link: "/about"},
    {icon: PhoneIcon,name: "Contact", link: "/contact"},
]
interface Props {
    open?:boolean;
}
const Sidebar = ({open = false}:Props) => {
  return (
    <div className={cn(
    "card-page tran-300",
        open ? 'w-64 p-4' : 'w-16 p-0 py-4'
    )}>
        <ul className="flex flex-col gap-4 ">
            {content.map((item, index) => (
                <li key={index} className="hover:bg-foreground/10 p-2 rounded-lg">
                    <div className={cn(
                        "flex items-center gap-2",
                        open ? 'justify-start' : 'justify-center'
                    )}>
                    <item.icon />
                    {open && <span>{item.name}</span>}
                    </div>
                </li>
            ))}
        </ul>
    </div>
  )
}


const footer = [
    {text: "Privacy",href: "#"},
    {text: "Terms",href: "#"},
    {text: "Contact",href: "#"},
]

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
}


interface NavbarProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}
const Navbar = ({open, setOpen}: NavbarProps) => {
    return (
        <div className="card-page text-xs">
            <div className="flex justify-between">
                <Hamburger open={open} setOpen={setOpen} />
                <div className="flex items-center gap-2">
                    <ModeToggleTheme />
                    <AvatarBadgeIcon />
                </div>
            </div>
        </div>
    );
};


export {Footer , Sidebar, Navbar}