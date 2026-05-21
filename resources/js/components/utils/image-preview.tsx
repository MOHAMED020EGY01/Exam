import { cn } from "@/lib/utils";
import {  ReactNode, useEffect, useState } from "react";

interface Props {
    image: any;
    className?:string
    children?:ReactNode
}

function ImagePreview({ image, className, children }: Props) {
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!image) {
            setPreviewSrc(null);
            return;
        }

        setLoaded(false);

        if (typeof image === "string") {
            setPreviewSrc(`${image}`);
        } else {
            const objectUrl = URL.createObjectURL(image);
            setPreviewSrc(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [image]);

    if (!image || !previewSrc) return null;

    return (
        <div className={cn("relative w-16 h-16 shrink-0", className)}>
            {!loaded && (
                <div className="absolute inset-0 animate-pulse rounded-lg outline-2 outline-dashed outline-card-foreground" />
            )}
            <img
                src={previewSrc}
                alt="Preview"
                onLoad={() => setLoaded(true)}
                className={cn(
                    "w-full h-full object-cover rounded-lg",
                    "outline-2 outline-dashed outline-card-foreground",
                    "transition-all duration-500",
                    loaded ? "opacity-100 scale-100" : "opacity-0 scale-90"
                )}
            />
            {children}
        </div>
    );
}

export default ImagePreview;
