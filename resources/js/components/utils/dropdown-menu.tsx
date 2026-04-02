import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import { DropdownItemInterface } from "@/interface/global"
import { Fragment, ReactNode } from "react"
import { Link } from "@inertiajs/react"
interface Props{
    target:ReactNode
    items: DropdownItemInterface[]
}
export const DropdownMenuDestructive = ({ target, items }: Props) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {target ?? <Button variant="outline">Open</Button>}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" >
                <DropdownMenuGroup>
                    {items?.map((item, index) => (
                        <Fragment key={index}>
                            {item.danger && (
                                <DropdownMenuSeparator />
                            )}
                            {!item.openModal && (
                                <DropdownMenuItem variant={item?.variant} asChild>
                                <Link
                                    className="w-full"
                                    href={item?.href} method={item?.method || "get"}>
                                    {item?.icon}
                                    {item?.label}
                                </Link>
                            </DropdownMenuItem>
                            )}
                            {item.openModal && (
                                <DropdownMenuItem key={index} variant={item?.variant} asChild>
                                    <Link
                                        className="w-full"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            item?.openModalFn?.();
                                        }}
                                    >
                                        {item?.icon}
                                        {item?.label}
                                    </Link>
                                </DropdownMenuItem>
                            )}
                        </Fragment>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
