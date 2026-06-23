/**
 * Avatar.tsx
 *
 * Purpose:
 * Renders the user avatar with a status badge and links to profile actions.
 *
 * Responsibilities:
 * - Render avatar image fallback to initials
 * - Render drop-down action list (profile, share, logout) on clicks
 *
 * Dependencies:
 * - DropdownMenu component (Shadcn UI & Common)
 * - Avatar components (Shadcn UI)
 * - useAuth hook
 */

import type { DropdownItemInterface } from "@/types";
import { LogOut, PlusIcon, ShareIcon, User } from "lucide-react";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenuDestructive } from "./DropdownMenu";
import { useAuth } from "@/hooks/use-auth";
import { Routes } from "@/services";

export const AvatarBadgeIcon = () => {
    const item: DropdownItemInterface[] = [
        {
            variant: "default",
            label: "profile",
            icon: <User />,
            openModal: false,
        },
        {
            variant: "default",
            label: "Share",
            icon: <ShareIcon />,
            openModal: false,
        },
        {
            variant: "destructive",
            href: Routes.auth.logout(),
            label: "logout",
            icon: <LogOut />,
            method: "delete",
            danger: true,
            openModal: false,
        },
    ];
    const user = useAuth();
    return (
        <DropdownMenuDestructive
            target={
                <Avatar className="size-7 md:size-8">
                    <AvatarImage src={user.user?.avatar} alt="@pranathip" />
                    <AvatarFallback className="text-[10px] md:text-xs">
                        PP
                    </AvatarFallback>
                    <AvatarBadge className="size-2 md:size-2.5 [&>svg]:size-1.5 md:[&>svg]:size-2">
                        <PlusIcon />
                    </AvatarBadge>
                </Avatar>
            }
            items={item}
        />
    );
};
