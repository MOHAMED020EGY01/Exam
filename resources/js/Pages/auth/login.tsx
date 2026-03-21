import { BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggleTheme } from '@/components/ui/mode-toggle';
import { LinkTo } from '@/components/ui/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

export default function Login() {
  const [loading, setLoading] = useState(false);


  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary/30 selection:text-primary-foreground bg-background text-foreground transition-colors duration-300">
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
            <div className="w-full max-w-[400px] bg-card text-card-foreground border border-border rounded-2xl shadow-2xl p-8 md:p-10 transition-all duration-300">
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
                    Sign in with your Google account to continue to Luminous
                  </p>
                </div>

                <div className="w-full">
                  <a
                    href={route('auth.redirect', { provider: "google" })}
                    onClick={(e) => {
                      if (loading) {
                        e.preventDefault();
                        return;
                      }
                      setLoading(true);
                    }}

                    className={cn(
                      "w-full py-4 flex items-center justify-center gap-4",
                      "border rounded-lg  transition-colors"
                    )}
                  >
                    {loading ? (
                      <>
                        <Spinner className="size-4" />
                        <span>Redirecting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          ></path>
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          ></path>
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          ></path>
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                            fill="#EA4335"
                          ></path>
                        </svg>
                        {loading ? "Loading..." : "Continue with Google"}
                      </>
                    )}
                  </a>
                </div>

                <p className="mt-10 text-xs text-muted-foreground">
                  By clicking continue, you agree to our{' '}
                  <a className="underline underline-offset-4 hover:text-primary transition-colors" href="#">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a className="underline underline-offset-4 hover:text-primary transition-colors" href="#">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </motion.main>
        </div>

      </AnimatePresence>

      <footer className="w-full px-8 py-6 flex flex-col md:flex-row justify-between items-center bg-transparent border-t border-border/40">
        <div className="text-muted-foreground text-xs mb-4 md:mb-0">
          © 2024 Luminous Editorial.
        </div>
        <div className="flex gap-6">
          <a className="text-muted-foreground hover:text-foreground transition-colors text-xs" href="#">
            Privacy
          </a>
          <a className="text-muted-foreground hover:text-foreground transition-colors text-xs" href="#">
            Terms
          </a>
          <a className="text-muted-foreground hover:text-foreground transition-colors text-xs" href="#">
            Support
          </a>
        </div>
      </footer>
    </div>
  );
}
