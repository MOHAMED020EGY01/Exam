/**
 * CourseDetails.tsx
 *
 * Purpose:
 * Renders the course detail panel on the right side of the split pane.
 *
 * Responsibilities:
 * - Render course metadata title, description, and creation time
 * - Render actions (edit, delete)
 * - Render a sub-list of exams belonging to this course
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
import {
    Book,
    FileText,
    Calendar,
    Pen,
    Trash,
    Plus,
    Eye,
    Download,
} from "lucide-react";
import { CourseData, ExamsData, TreeNodeData } from "@/interface/global";

interface CourseDetailsProps {
    selectedNode: TreeNodeData;
    selectedNodeExams: ExamsData[];
    onEditCourse: (course: CourseData) => void;
    onDeleteCourse: (course: CourseData) => void;
    onAddExam: (course: CourseData) => void;
    onDownloadExam: (exam: ExamsData) => void;
}

export const CourseDetails: React.FC<CourseDetailsProps> = ({
    selectedNode,
    selectedNodeExams,
    onEditCourse,
    onDeleteCourse,
    onAddExam,
    onDownloadExam,
}) => {
    const course = selectedNode.originalData as CourseData;
    return (
        <Card className="shadow-sm">
            <CardHeader className="bg-muted/10 border-b border-border">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Book className="w-5 h-5 icon-indigo" />
                            <span className="text-[10px] uppercase font-bold tracking-wider badge-course px-2 py-0.5 rounded-full">
                                Course
                            </span>
                        </div>
                        <CardTitle className="text-2xl font-bold mt-2">
                            {selectedNode.label}
                        </CardTitle>
                        <CardDescription className="text-sm mt-1">
                            {course?.description || "No description provided."}
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                onEditCourse(selectedNode.originalData as CourseData)
                            }
                        >
                            <Pen className="w-4 h-4 mr-1.5" />
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                                onDeleteCourse(selectedNode.originalData as CourseData)
                            }
                        >
                            <Trash className="w-4 h-4 mr-1.5" />
                            Delete
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/20 border rounded-lg">
                        <span className="text-xs text-muted-foreground block">
                            Exams Count
                        </span>
                        <span className="text-2xl font-bold">
                            {selectedNodeExams.length}
                        </span>
                    </div>
                    <div className="p-3 bg-muted/20 border rounded-lg flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                            <span className="text-xs text-muted-foreground block">
                                Created
                            </span>
                            <span className="text-xs font-semibold">
                                {course?.created_at || "N/A"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h4 className="text-sm font-semibold text-foreground">
                            Course Exams ({selectedNodeExams.length})
                        </h4>
                        <Button
                            size="xs"
                            onClick={() => onAddExam(selectedNode.originalData as CourseData)}
                        >
                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Exam
                        </Button>
                    </div>
                    {selectedNodeExams.length > 0 ? (
                        <div className="border rounded-lg overflow-hidden divide-y">
                            {selectedNodeExams.map((exam: ExamsData) => (
                                <div
                                    key={exam?.id || String(Math.random())}
                                    className="flex justify-between items-center p-3 hover:bg-muted/10 transition-colors text-sm"
                                >
                                    <div className="flex items-center gap-2 font-medium">
                                        <FileText className="w-4 h-4 icon-amber" />
                                        {exam?.name || "Unnamed Exam"}
                                        <span className="text-[10px] text-muted-foreground">
                                            ({exam?.questions_count || 0}{" "}
                                            Questions)
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {selectedNode.originalId && exam?.id ? (
                                            <Button
                                                asChild
                                                size="xs"
                                                variant="outline"
                                            >
                                                <Link
                                                // href={route("exams.show", {
                                                //     course: selectedNode.originalId,
                                                //     exam: exam.id,
                                                // })}
                                                >
                                                    <Eye className="w-3.5 h-3.5 mr-1" />{" "}
                                                    View
                                                </Link>
                                            </Button>
                                        ) : (
                                            <Button
                                                size="xs"
                                                variant="outline"
                                                disabled
                                            >
                                                <Eye className="w-3.5 h-3.5 mr-1" />{" "}
                                                View
                                            </Button>
                                        )}
                                        <Button
                                            size="xs"
                                            variant="outline"
                                            onClick={() => onDownloadExam(exam)}
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground text-center py-4 border border-dashed rounded-lg bg-muted/5">
                            No exams created in this course yet.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
