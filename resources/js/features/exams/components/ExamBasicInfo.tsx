/**
 * ExamBasicInfo.tsx
 *
 * Purpose:
 * Renders the basic exam configuration form inputs (Step 1).
 *
 * Responsibilities:
 * - Render title and description fields for the exam
 * - Display reference card of the parent Course
 * - Handle input transitions and display validation messages
 *
 * Dependencies:
 * - Input/Textarea components (Shadcn UI)
 * - Lucide Book icon
 *
 * Notes:
 * - Type-safe: Uses CourseData from @/types
 */

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Book } from "lucide-react";
import type { CourseData } from "@/types";

interface ExamBasicInfoProps {
    data: {
        name: string;
        description: string;
    };
    errors: Record<string, string>;
    setData: (key: "name" | "description", value: string) => void;
    course?: CourseData;
}
export function ExamBasicInfo({ errors, data, setData, course }: ExamBasicInfoProps) {
    return (
        <div className="space-y-5 animate-in fade-in-5 duration-300">
            {/* 🔹 Related Course */}
            {course && (
                <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase font-bold tracking-wider">
                        Related Course
                    </Label>
                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 border-dashed">
                        <Book className="w-5 h-5 icon-indigo shrink-0" />
                        <div className="flex-1 min-w-0">
                            <span className="font-semibold text-sm block truncate">
                                {course.name}
                            </span>
                            <span className="text-xs text-muted-foreground block truncate">
                                {course.description || "No description"}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* 🔹 Name */}
            <div className="space-y-2">
                <Label htmlFor="exam-name" className="text-sm font-semibold">
                    Exam Title
                </Label>
                <Input
                    id="exam-name"
                    value={data.name}
                    placeholder="Enter exam title (e.g. Midterm 2026)"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setData("name", e.target.value)
                    }
                    className={cn(
                        "h-10 transition-all focus-visible:ring-primary",
                        errors.name &&
                            "border-destructive focus-visible:ring-destructive",
                    )}
                />
                {errors.name && (
                    <p className="text-destructive text-xs font-medium mt-1">
                        {errors.name}
                    </p>
                )}
            </div>

            {/* 🔹 Description */}
            <div className="space-y-2">
                <Label
                    htmlFor="exam-description"
                    className="text-sm font-semibold"
                >
                    Description
                </Label>
                <Textarea
                    id="exam-description"
                    value={data.description}
                    placeholder="Write a short description or guidelines for the exam..."
                    rows={4}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setData("description", e.target.value)
                    }
                    className={cn(
                        "min-h-[100px] resize-y transition-all focus-visible:ring-primary",
                        errors.description &&
                            "border-destructive focus-visible:ring-destructive",
                    )}
                />
                {errors.description && (
                    <p className="text-destructive text-xs font-medium mt-1">
                        {errors.description}
                    </p>
                )}
            </div>
        </div>
    );
}
