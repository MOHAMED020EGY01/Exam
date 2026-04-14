import { DropdownItemInterface } from "@/interface/global"
import { LogOut, PlusIcon, ShareIcon, User } from "lucide-react"
import {Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenuDestructive } from "./dropdown-menu"
import { useAuth } from "@/hooks/use-auth"

export const AvatarBadgeIcon = () => {
    const item: DropdownItemInterface[] = [
        {
            variant: "default",
            href: route('home'),
            label: "profile",
            icon: <User />,
            openModal: false
        },
        {
            variant: "default",
            href: route('home'),
            label: "Share",
            icon: <ShareIcon />,
            openModal: false
        },
        {
            variant: "destructive",
            href: route('logout'),
            label: "logout",
            icon: <LogOut />,
            method: "delete",
            danger: true,
            openModal:false
        }
    ]
    const user = useAuth();
    return (
        <DropdownMenuDestructive
            target={
                <Avatar>
                    <AvatarImage src={user.user?.avatar} alt="@pranathip" />
                    <AvatarFallback>PP</AvatarFallback>
                    <AvatarBadge>
                        <PlusIcon />
                    </AvatarBadge>
                </Avatar>
            }
            items={item}
        />
    )
}