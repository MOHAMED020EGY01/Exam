import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";

export const Pagination = (props: { links: any[] }) => {
    const firstThree = props.links.slice(0, 3);
    const lastThree = props.links.slice(-3);

    let displayedLinks: any[] = [...firstThree];

    if (props.links.length > 5) {
        displayedLinks.push({ label: "...", url: null, active: false });
    }
    
    let finalLinks: any[] = [...firstThree];

    if (props.links.length > 5) {
        finalLinks.push({ label: "...", url: null, active: false });
        lastThree.forEach(link => {
            const exists = finalLinks.some(l => l.url === link.url);
            if (!exists) {
                finalLinks.push(link);
            }
        });
    } else {
        finalLinks = props.links;
    }
    return (
        <nav className="flex items-center justify-center gap-1 mt-2">
            {finalLinks.map((link: any, index: number) => (
                <Link
                    key={index}
                    href={link.url || "#"}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={cn(
                        "min-w-[40px] h-10 px-3 flex items-center justify-center rounded-lg text-sm font-semibold transition-all border",
                        link.active
                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105 z-10"
                            : "bg-background border-input hover:bg-accent hover:border-accent-foreground",
                        !link.url && "opacity-40 cursor-not-allowed pointer-events-none bg-muted/50"
                    )}
                    preserveState
                    preserveScroll
                />
            ))}
        </nav>
    );
};
