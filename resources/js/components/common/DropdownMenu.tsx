/**
 * DropdownMenu.tsx
 *
 * Purpose:
 * Renders a dropdown menu with support for links, downloads, and modal buttons.
 *
 * Responsibilities:
 * - Render trigger and content items
 * - Differentiate between regular navigation, downloads, and modal triggers
 * - Support custom icons and labels for dropdown items
 *
 * Dependencies:
 * - DropdownMenu components (Shadcn UI)
 * - Inertia Link component
 */

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { DropdownItemInterface } from "@/interface/global";
import { Fragment, ReactNode } from "react";
import { Link } from "@inertiajs/react";

interface Props {
    target: ReactNode;
    items: DropdownItemInterface[];
}

export const DropdownMenuDestructive = ({ target, items }: Props) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div>{target ?? <Button variant="outline">Open</Button>}</div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                    {items?.map((item, index) => (
                        <Fragment key={index}>
                            {item.danger && <DropdownMenuSeparator />}
                            {(!item.openModal && !item.download) && (
                                <DropdownMenuItem
                                    variant={item?.variant}
                                    asChild
                                >
                                    <div>
                                        <Link
                                            className="w-full flex items-center gap-2"
                                            href={item?.href}
                                            method={item?.method || "get"}>
                                            {item?.icon}
                                            {item?.label}
                                        </Link>
                                    </div>
                                </DropdownMenuItem>
                            )}
                            {item.download && (
                                <DropdownMenuItem
                                    variant={item?.variant}
                                    asChild>
                                    <div>
                                        <Link
                                            className="w-full flex items-center gap-2"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (!item?.href) return;
                                                window.location.href = item.href;
                                            }}
                                        >
                                            {item?.icon}
                                            {item?.label}
                                        </Link>
                                    </div>
                                </DropdownMenuItem>
                            )}
                            {item.openModal && (
                                <DropdownMenuItem
                                    key={index}
                                    variant={item?.variant}
                                    asChild
                                >
                                    <div>
                                        <Link
                                            className="w-full flex items-center gap-2"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                item?.openModalFn?.();
                                            }}
                                        >
                                            {item?.icon}
                                            {item?.label}
                                        </Link>
                                    </div>
                                </DropdownMenuItem>
                            )}
                        </Fragment>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
