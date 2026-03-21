import React from "react";

const Footer = () => {
    return (
        <footer className="w-full px-8 py-6 flex flex-col md:flex-row justify-between items-center bg-transparent border-t border-border/40">
            <div className="text-muted-foreground text-xs mb-4 md:mb-0">
                © 2024 Luminous Editorial.
            </div>
            <div className="flex gap-6">
                <a
                    className="text-muted-foreground hover:text-foreground transition-colors text-xs"
                    href="#"
                >
                    Privacy
                </a>
                <a
                    className="text-muted-foreground hover:text-foreground transition-colors text-xs"
                    href="#"
                >
                    Terms
                </a>
                <a
                    className="text-muted-foreground hover:text-foreground transition-colors text-xs"
                    href="#"
                >
                    Support
                </a>
            </div>
        </footer>
    );
}

export default Footer;
