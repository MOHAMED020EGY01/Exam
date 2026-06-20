/**
 * welcome.tsx
 *
 * Purpose:
 * Renders the application welcome/landing page.
 *
 * Responsibilities:
 * - Render splash/landing info for unauthenticated users
 * - Render navigation quick-starts for logged-in users
 *
 * Dependencies:
 * - DashboardLayout
 * - useAuth hook
 */

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Head, Link } from "@inertiajs/react";

function Welcome() {
    const auth = useAuth();
    return (
        <>
            <Head title="Welcome" />
            {auth.isAuth ? (
                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl font-bold">
                        Welcome back {auth.user?.name}!
                    </h1>
                    <p className="text-foreground/80">
                        Here you can manage your courses, exams, and view your
                        progress.
                    </p>
                    <Card className="border-2 border-primary/50 max-w-xs">
                        <CardHeader>
                            <CardTitle>Get Started</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                To get started, you can create a new course and
                                start adding exams to it. You can also view your
                                existing courses and exams, and manage them as
                                needed.
                            </p>
                            <Button className="mt-4" asChild>
                                <div>
                                    <Link href={route("courses.index")}>
                                        View Courses
                                    </Link>
                                </div>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl font-bold">Welcome to Exam App!</h1>
                    <p className="text-foreground/80">
                        Here you can create and manage your courses, create
                        exams, and view please login to access the dashboard and
                        start managing your courses and exams.
                    </p>
                </div>
            )}
        </>
    );
}

Welcome.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);

export default Welcome;
