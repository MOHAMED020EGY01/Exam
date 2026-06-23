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
import { BookOpen, FileText, HelpCircle, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function Welcome() {
    const auth = useAuth();
    return (
        <>
            <Head title="Welcome" />
            {auth.isAuth ? (
                <div className="page-container space-y-6 animate-in fade-in-5 duration-300">
                    <div className="flex items-center gap-4 mb-6">
                        <Avatar className="avatar-lg">
                            <AvatarImage src={auth.user?.avatar} alt={auth.user?.name} />
                            <AvatarFallback>
                                <User className="icon-md" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl font-bold text-primary-semantic">
                                Welcome back, {auth.user?.name}!
                            </h1>
                            <p className="text-muted-semantic text-sm">
                                Manage your courses, exams, and questions.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="card-base">
                            <CardHeader className="card-header-bg flex items-center gap-3">
                                <BookOpen className="icon-lg icon-indigo" />
                                <CardTitle>Create Course</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <p className="text-muted-semantic text-sm">
                                    Create a new course and start adding exams.
                                </p>
                            </CardContent>
                            <div className="px-6 pb-6">
                                <Button className="btn-primary btn-size-default w-full" asChild>
                                    <Link href={route("courses.index")}>
                                        Get Started
                                    </Link>
                                </Button>
                            </div>
                        </Card>

                        <Card className="card-base">
                            <CardHeader className="card-header-bg flex items-center gap-3">
                                <FileText className="icon-lg icon-amber" />
                                <CardTitle>Browse Exams</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <p className="text-muted-semantic text-sm">
                                    View and manage all your existing exams.
                                </p>
                            </CardContent>
                            <div className="px-6 pb-6">
                                <Button className="btn-outline btn-size-default w-full" asChild>
                                    <Link href={route("courses.index")}>
                                        View Exams
                                    </Link>
                                </Button>
                            </div>
                        </Card>

                        <Card className="card-base">
                            <CardHeader className="card-header-bg flex items-center gap-3">
                                <HelpCircle className="icon-lg icon-emerald" />
                                <CardTitle>Manage Questions</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <p className="text-muted-semantic text-sm">
                                    Edit and organize your question bank.
                                </p>
                            </CardContent>
                            <div className="px-6 pb-6">
                                <Button className="btn-outline btn-size-default w-full" asChild>
                                    <Link href={route("courses.index")}>
                                        View Questions
                                    </Link>
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className="page-container space-y-10 animate-in fade-in-5 duration-300">
                    <div className="text-center space-y-6 pt-12">
                        <div className="flex justify-center mb-6">
                            <div className="logo-icon rounded-xl brand-icon flex items-center justify-center shadow-lg shadow-primary/20">
                                <BookOpen className="icon-lg fill-current" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-primary-semantic">
                            Welcome to Exam App
                        </h1>
                        <p className="text-muted-semantic text-lg max-w-md mx-auto">
                            Create and manage courses, exams, and questions in one simple platform.
                        </p>
                        <Button className="btn-primary btn-size-lg" asChild>
                            <Link href={route("login")}>
                                Get Started
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                        <Card className="card-page">
                            <CardHeader>
                                <BookOpen className="icon-lg icon-indigo mb-4" />
                                <CardTitle>Organize Courses</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-semantic text-sm">
                                    Create and structure your learning materials with courses.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="card-page">
                            <CardHeader>
                                <FileText className="icon-lg icon-amber mb-4" />
                                <CardTitle>Create Exams</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-semantic text-sm">
                                    Build custom exams with your own questions.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="card-page">
                            <CardHeader>
                                <HelpCircle className="icon-lg icon-emerald mb-4" />
                                <CardTitle>Manage Questions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-semantic text-sm">
                                    Organize your question bank for easy reuse.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </>
    );
}

Welcome.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);

export default Welcome;
