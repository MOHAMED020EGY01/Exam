import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plus} from "lucide-react";
import { Link } from "@inertiajs/react";


interface IPropsExaml extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  onClick?: () => void;
}

export const CardSmall = ({ children, onClick}: IPropsExaml) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "flex flex-col justify-center overflow-hidden transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1 border-muted-foreground/10",
        " bg-card","hover:bg-accent/90",
      )}>
        {children}
    </Card>
  );
}

interface CardCreateProps {
  title: string;
  url?: string;
  onClick?: () => void;
  isLinK: boolean;
}

export const CardCreate = ({ title, url, onClick, isLinK }: CardCreateProps) => {
  return (
    <Card
      onClick={onClick ? () => onClick() : undefined}
      className={cn(
        "group relative flex flex-col justify-center overflow-hidden transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1 border-muted-foreground/10",
        "cursor-pointer",
        "border-dashed border-2 bg-muted/40 hover:bg-muted/60"
      )}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >

      {isLinK ? (
        <Link href={url}>
          <CardContentCreate title={title} />
        </Link>
      ) : (
        <div>
          <CardContentCreate title={title} />
        </div>
      )}
    </Card>
  )
}

const CardContentCreate = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center space-y-3">
    <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
      <Plus className="w-8 h-8" />
    </div>
    <span className="text-lg font-semibold text-primary/80 group-hover:text-primary transition-colors">
      {title || "Create New"}
    </span>
  </div>
);