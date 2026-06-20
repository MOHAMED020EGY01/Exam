/**
 * login.tsx
 *
 * Purpose:
 * Renders the login page wrapper.
 *
 * Responsibilities:
 * - Render login card interface
 * - Display theme selection control
 * - Handle redirect trigger link to Google OAuth flow
 *
 * Dependencies:
 * - ModeToggleTheme (Shadcn UI)
 * - Spinner (Shadcn UI)
 * - GoogleSvg (Common)
 */

import { BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggleTheme } from "@/components/ui/mode-toggle";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { GoogleSvg } from "@/components/common/GoogleSvg";

export default function Login() {
    const [loading, setLoading] = useState(false);

    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-primary/30 selection:text-primary-foreground bg-background text-foreground transition-colors duration-300">
            <AnimatePresence mode="wait">
                <div className="grow  flex items-center justify-center relative p-6">
                    <motion.main
                        key="login"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <ModeToggleTheme className="absolute top-8 right-8" />
                        <div className="max-w-[400px] text-card-foreground border border-border rounded-2xl shadow-2xl p-8 md:p-10 transition-all duration-300">
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-8">
                                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                                        <BookOpen className="w-10 h-10 fill-current" />
                                    </div>
                                </div>

                                <div className="space-y-2 mb-10">
                                    <h1 className="text-2xl font-semibold tracking-tight">
                                        Welcome back
                                    </h1>
                                    <p className="text-muted-foreground text-sm">
                                        Sign in with your Google account to
                                        continue to Luminous
                                    </p>
                                </div>

                                <div className="w-full">
                                    <a
                                        href={route("auth.redirect", {
                                            provider: "google",
                                        })}
                                        onClick={(e) => {
                                            if (loading) {
                                                e.preventDefault();
                                                return;
                                            }
                                            setLoading(true);
                                        }}
                                        className={cn(
                                            "w-full py-4 flex items-center justify-center gap-4",
                                            "border rounded-lg  transition-colors",
                                        )}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner className="size-4" />
                                                <span>Redirecting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <GoogleSvg />
                                                {loading
                                                    ? "Loading..."
                                                    : "Continue with Google"}
                                            </>
                                        )}
                                    </a>
                                </div>

                                <p className="mt-10 text-xs text-muted-foreground">
                                    By clicking continue, you agree to our{" "}
                                    <a
                                        className="underline underline-offset-4 hover:text-primary transition-colors"
                                        href="#"
                                    >
                                        Terms of Service
                                    </a>{" "}
                                    and{" "}
                                    <a
                                        className="underline underline-offset-4 hover:text-primary transition-colors"
                                        href="#"
                                    >
                                        Privacy Policy
                                    </a>
                                    .
                                </p>
                            </div>
                        </div>
                    </motion.main>
                </div>
            </AnimatePresence>
            <footer />
        </div>
    );
}
