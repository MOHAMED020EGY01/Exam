/**
 * ExamDetails.tsx
 *
 * Purpose:
 * Renders the exam detail panel on the right side of the split pane.
 *
 * Responsibilities:
 * - Render exam metadata title, description, and creation time
 * - Render actions (edit, delete, take exam, download package)
 *
 * Dependencies:
 * - Card and Button components (Shadcn UI)
 * - Lucide icons
 * - Inertia Link component
 */

import React from "react";
import { Link } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Pen, Trash, Download } from "lucide-react";
import type { ExamsData, TreeNode as TreeNodeType } from "@/types";

interface ExamDetailsProps {
    selectedNode: TreeNodeType;
    onEditExam: (exam: ExamsData) => void;
    onDeleteExam: (exam: ExamsData) => void;
    onDownloadExam: (exam: ExamsData) => void;
}

export const ExamDetails: React.FC<ExamDetailsProps> = ({
    selectedNode,
    onEditExam,
    onDeleteExam,
    onDownloadExam,
}) => {
    const exam = selectedNode.originalData as ExamsData;
    return (
        <Card className="shadow-sm">
            <CardHeader className="bg-muted/10 border-b border-border">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 icon-amber" />
                            <span className="text-[10px] uppercase font-bold tracking-wider badge-exam px-2 py-0.5 rounded-full">
                                Exam
                            </span>
                        </div>
                        <CardTitle className="text-2xl font-bold mt-2">
                            {selectedNode.label}
                        </CardTitle>
                        <CardDescription className="text-sm mt-1">
                            {exam?.description || "No description provided."}
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                onEditExam(
                                    selectedNode.originalData as ExamsData,
                                )
                            }
                        >
                            <Pen className="w-4 h-4 mr-1.5" />
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                                onDeleteExam(
                                    selectedNode.originalData as ExamsData,
                                )
                            }
                        >
                            <Trash className="w-4 h-4 mr-1.5" />
                            Delete
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-muted/20 border rounded-lg col-span-1">
                        <span className="text-xs text-muted-foreground block">
                            Questions
                        </span>
                        <span className="text-2xl font-bold">
                            {exam?.questions_count || 0}
                        </span>
                    </div>
                    <div className="p-3 bg-muted/20 border rounded-lg col-span-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                            <span className="text-xs text-muted-foreground block">
                                Created
                            </span>
                            <span className="text-xs font-semibold">
                                {exam?.created_at || "N/A"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                    {exam?.course_id && selectedNode.originalId ? (
                        <Button asChild size="lg" className="w-full md:w-auto">
                            <Link
                            // href={route("exams.show", {
                            //     course: exam.course_id,
                            //     exam: selectedNode.originalId,
                            // })}
                            >
                                Take Exam
                            </Link>
                        </Button>
                    ) : (
                        <Button size="lg" className="w-full md:w-auto" disabled>
                            Take Exam
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        onClick={() =>
                            onDownloadExam(
                                selectedNode.originalData as ExamsData,
                            )
                        }
                    >
                        <Download className="w-4 h-4 mr-2" /> Download Package
                        (.elr)
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
