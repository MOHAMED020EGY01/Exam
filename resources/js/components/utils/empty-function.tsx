import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import {
    Book,
    ArrowUpRightIcon
} from "lucide-react"
import { ReactNode } from "react"
import { Button } from "../ui/button"

export const EmptyFunction = ({ title, description ,children}: { title: string, description: string, children: ReactNode }) => {
    return (
        <Empty className="py-16"> 
            <EmptyHeader className="gap-4">
                <EmptyMedia variant="default">
                    <Book className="size-16" />
                </EmptyMedia>

                <EmptyTitle className="text-3xl font-bold">
                    {title}
                </EmptyTitle>

                <EmptyDescription className="text-lg">
                    {description}
                </EmptyDescription>
            </EmptyHeader>

            <EmptyContent className="flex-row justify-center gap-4 mt-4">
                {children}
            </EmptyContent>

            <Button
                variant="link"
                asChild
                className="text-muted-foreground text-sm mt-4"
            >
                <a href="#">
                    Learn More <ArrowUpRightIcon />
                </a>
            </Button>
        </Empty>
    )
}