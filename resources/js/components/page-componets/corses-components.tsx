import { Book, EllipsisVertical } from 'lucide-react'
import { Badge } from '../ui/badge'
import { CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { DropdownMenuDestructive } from '../utils/dropdown-menu'
import { Button } from '../ui/button'


function CoursesCard({ courses,items }: { courses: any , items:any}) {
    return (
        <div>
            <CardHeader>
                {/* Title */}
                <CardTitle className="text-xl font-bold text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors flex justify-between">
                    <div>
                        {courses.name}
                    </div>
                    <div>
                    <DropdownMenuDestructive 
                    items={items}
                    target={
                        <Button variant={'ghost'}>
                            <EllipsisVertical />
                        </Button>
                    } />
                    </div>
                </CardTitle>

                {/* Description */}
                <CardDescription className="text-base text-muted-foreground leading-relaxed line-clamp-2">
                    {courses.description}
                </CardDescription>
            </CardHeader>

            {/* Divider */}
            <div className="h-px bg-border/60" />

            {/* Stats */}
            <CardFooter className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg">
                    <Book className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">
                        Exam:
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                        {courses.exam_count}
                    </span>
                </div>
                <div className="text-xs text-muted-foreground">
                    <Badge variant="secondary">{courses.diff_for_humans}</Badge>
                </div>
            </CardFooter>
        </div>
    )
}

export { CoursesCard }