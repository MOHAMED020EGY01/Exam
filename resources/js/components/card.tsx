import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plus, Book } from "lucide-react";
import { Badge } from "./ui/badge";
import { Link } from "@inertiajs/react";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  courses?:any;
  footer?: React.ReactNode;
  onClick?: () => void;
  isCreate?: boolean;
}

export function CardSmall({ children, className, title, courses, footer, onClick, isCreate }: IProps) {
  console.log(courses)
  return (
    <Card
      onClick={onClick}
      className={cn(
        "group relative flex flex-col justify-center overflow-hidden transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1 border-muted-foreground/10",
        "cursor-pointer bg-card",
        isCreate ? "border-dashed border-2 bg-muted/40 hover:bg-muted/60" : "hover:bg-accent/90",
        className
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}>
      <div className="absolute inset-0  from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      {isCreate ? (
        <div className="flex flex-col items-center justify-center p-6 space-y-3">
          <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
            <Plus className="w-12 h-12" />
          </div>
          <span className="text-lg font-semibold text-primary/80 group-hover:text-primary transition-colors">
            {title || "Create New"}
          </span>
        </div>
      ) : (
        <>
          <CardHeader
            className="pb-4 space-y-4 relative z-10">
            {courses && (
              <>
                {/* Title */}
                <h3 className="text-xl font-bold text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors">
                  {courses.name}
                </h3>

                {/* Description */}
                <p className="text-base text-muted-foreground leading-relaxed line-clamp-2">
                  {courses.description}
                </p>

                {/* Divider */}
                <div className="h-px bg-border/60" />

                {/* Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg">
                    <Book className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">
                      Exams:
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {courses.exam_count}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <Badge variant="secondary">{courses.diff_for_humans}</Badge>
                  </div>
                </div>
              </>
               )}
          </CardHeader>

          {children && (
            <CardContent className="text-sm text-muted-foreground relative z-10">
              {children}
            </CardContent>
          )}

          {footer && (
            <CardFooter className="pt-4 border-t border-border/50 mt-auto bg-muted/30 relative z-10 flex justify-between items-center">
              {footer}
            </CardFooter>
          )}
        </>
      )}
    </Card>
  );
}

interface IPropsExaml extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  exams?:any;
  footer?: React.ReactNode;
  onClick?: () => void;
  isCreate?: boolean;
  id?: string;
}

export const CardSmallExam = ({children, className, title, exams, footer, onClick, isCreate, id }: IPropsExaml) => {
console.log(id)
  return (
    <Card
      onClick={onClick}
      className={cn(
        "group relative flex flex-col justify-center overflow-hidden transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1 border-muted-foreground/10",
        "cursor-pointer bg-card",
        isCreate ? "border-dashed border-2 bg-muted/40 hover:bg-muted/60" : "hover:bg-accent/90",
        className
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}>
      <div className="absolute inset-0  from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      {isCreate ? (
        <Link 
        href={id ? route('exams.create',{course:id}) : '#'}>
        <div className="flex flex-col items-center justify-center p-6 space-y-3">
          <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
            <Plus className="w-12 h-12" />
          </div>
          <span className="text-lg font-semibold text-primary/80 group-hover:text-primary transition-colors">
            {title || "Create New"}
          </span>
        </div>
        </Link>
      ) : (
        <>
          <CardHeader
            className="pb-4 space-y-4 relative z-10">
            {exams && (
               exams.map((exam,index:number) => (
              <div key={index}>
                {/* Title */}
                <h3 className="text-xl font-bold text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors">
                  {exam.name}
                </h3>

                {/* Description */}
                <p className="text-base text-muted-foreground leading-relaxed line-clamp-2">
                  {exam.description}
                </p>

                {/* Divider */}
                <div className="h-px bg-border/60" />

                {/* Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg">
                    <Book className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">
                      Exams:
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {exam.exam_count}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <Badge variant="secondary">{exam.diff_for_humans}</Badge>
                  </div>
                </div>
              </div>
               ))
            )}
          </CardHeader>

          {children && (
            <CardContent className="text-sm text-muted-foreground relative z-10">
              {children}
            </CardContent>
          )}

          {footer && (
            <CardFooter className="pt-4 border-t border-border/50 mt-auto bg-muted/30 relative z-10 flex justify-between items-center">
              {footer}
            </CardFooter>
          )}
        </>
      )}
    </Card>
  );
}
