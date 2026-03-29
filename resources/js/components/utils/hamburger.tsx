import { cn } from "@/lib/utils"
import { Button } from "../ui/button"

interface HamburgerProps {
    open: boolean
    setOpen: (value: boolean) => void
}

export const Hamburger = ({ open, setOpen }: HamburgerProps) => {
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