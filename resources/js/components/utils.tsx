import {
    Avatar,
    AvatarBadge,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PlusIcon, PencilIcon, ShareIcon, TrashIcon, LogOut } from "lucide-react"
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { ReactNode } from "react"
import { useLogout } from "@/hooks/use-logout"


interface HamburgerProps {
    open: boolean
    setOpen: (value: boolean) => void
}

const Hamburger = ({ open, setOpen }: HamburgerProps) => {
    return (
        <Button
            variant="outline"
            className="flex flex-col gap-1 p-2"
            onClick={() => setOpen(!open)}>
            <div className={cn(
                "hamburger",
                open && "rotate-45 translate-y-1"
            )}></div>
            <div className={cn(
                "hamburger",
                open && "-rotate-45 -translate-y-1"
            )}></div>
            <div className={cn(
                "hamburger",
                open && "hidden"
            )}></div>
        </Button>
    )
}


const AvatarBadgeIcon = () => {

    return (
        <DropdownMenuDestructive
            target={
                <Avatar>
                    <AvatarImage src="https://github.com/pranathip.png" alt="@pranathip" />
                    <AvatarFallback>PP</AvatarFallback>
                    <AvatarBadge>
                        <PlusIcon />
                    </AvatarBadge>
                </Avatar>
            } />
    )
}




interface DropdownMenuDestructiveProps {
    target?: ReactNode
}
const DropdownMenuDestructive = (
    { target }: DropdownMenuDestructiveProps
) => {
    const { logout } = useLogout();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {target}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" >
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <PencilIcon />
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <ShareIcon />
                        Share
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem variant="destructive"
                        onClick={logout}>
                        <LogOut />
                        logout
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


export { Hamburger, AvatarBadgeIcon, DropdownMenuDestructive }