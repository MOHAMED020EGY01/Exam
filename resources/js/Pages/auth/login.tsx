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
import { Button } from "@/components/ui/button";

export default function Login() {
    const [loading, setLoading] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-background-light-dark text-foreground transition-colors duration-300">
            <AnimatePresence mode="wait">
                <div className="grow flex items-center justify-center relative p-6">
                    <motion.main
                        key="login"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <ModeToggleTheme className="absolute top-8 right-8" />
                        <div className="login-card bg-card text-card-foreground border border-border rounded-2xl shadow-2xl p-8 md:p-10 transition-all tran-300">
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-8">
                                    <div className="logo-icon rounded-xl brand-icon flex items-center justify-center shadow-lg shadow-primary/20">
                                        <BookOpen className="icon-lg fill-current" />
                                    </div>
                                </div>

                                <div className="space-y-2 mb-10">
                                    <h1 className="text-2xl font-semibold tracking-tight">
                                        Welcome back
                                    </h1>
                                    <p className="text-muted-semantic text-sm">
                                        Sign in with your Google account to
                                        continue to Luminous
                                    </p>
                                </div>

                                <div className="w-full">
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="lg"
                                        className="w-full btn-size-lg"
                                    >
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
                                        >
                                            {loading ? (
                                                <>
                                                    <Spinner className="icon-sm" />
                                                    <span>Redirecting...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <GoogleSvg />
                                                    <span>
                                                        Continue with Google
                                                    </span>
                                                </>
                                            )}
                                        </a>
                                    </Button>
                                </div>

                                <p className="mt-10 text-xs text-muted-semantic">
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
