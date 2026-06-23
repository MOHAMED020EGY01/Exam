/**
 * Home.tsx
 *
 * Purpose:
 * Main Courses Explorer page component mapping courses, exams, and question trees.
 *
 * Changes from previous version:
 * - All handler functions are now wrapped with useCallback to prevent
 *   unnecessary re-creation on each render, keeping TreeRoot's context
 *   value stable and avoiding cascading re-renders inside the tree.
 *
 * Responsibilities:
 * - Render hierarchical explorer navigation tree on the left
 * - Render contextual detail panels dynamically on the right based on selection
 * - Coordinate course and exam creation, editing, and deletion via modals
 * - Support clipboard copy, paste, duplicate, and move tree node actions
 *
 * Dependencies:
 * - useTree and useClipboard hooks
 * - CourseDetails, ExamDetails, QuestionDetails, and ExplorerEmptyState components
 * - DashboardLayout
 */

import { ReactNode, useState, useMemo, useCallback, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ModalDynamic } from "@/components/common/Modal";
import { ModalDynamicAdvanced } from "@/components/common/ModalAdvanced";
import { ExamModalFormQuestions } from "@/features/exams/components/exam-components";
import { FieldForm } from "@/interface/modal-interface";
import { useTree } from "@/hooks/use-tree";
import { normalizeCoursesToTree } from "@/lib/treeHelpers";
import { courseService } from "@/services/courseService";
import { TreeRoot } from "@/features/tree/TreeRoot";
import { MoveModal } from "@/features/tree/MoveModal";
import { useClipboard } from "@/hooks/use-clipboard";
import { CourseDetails } from "@/components/page/CourseDetails";
import { ExamDetails } from "@/components/page/ExamDetails";
import { QuestionDetails } from "@/components/page/QuestionDetails";
import { ExplorerEmptyState } from "@/components/page/ExplorerEmptyState";
import { CourseData, ExamsData, QuestionsData } from "@/interface/global";
import { useAuth } from "@/hooks/use-auth";
import { useEchoChannel } from "@/hooks/use-echo-channel";
import { toast } from "sonner";
import { router } from "@inertiajs/react";

interface Props {
    courses: CourseData[];
}

const form = [
    { field: "name", type: "input" },
    { field: "description", type: "input" },
] as FieldForm[];

function Home({ courses }: Props) {
    const user = useAuth();
    useEchoChannel(
        `users.${user.user?.id}`,
        ".exam.created",
        (e: any) => {
            toast.success(`Exam "${e.exam.name}" created`);
            router.reload({
                only: ["courses"],
                onSuccess: () => {
                    refreshTree();
                },
            });
        },
        [user.user?.id],
    );

    useEchoChannel(
        `users.${user.user?.id}`,
        ".exam.updated",
        (e: any) => {
            toast.success(`Exam "${e.exam.name}" updated`);
            router.reload({
                only: ["courses"],
            });
        },
        [user.user?.id],
    );
    // Stabilise the courses reference — prevents downstream memo invalidation
    const safeCourses = useMemo((): CourseData[] => courses, [courses]);

    useEffect(() => {
        console.log("Courses updated", courses);
    }, [courses]);

    // Convert flat API data → TreeNodeData hierarchy
    const treeNodes = useMemo(
        () => normalizeCoursesToTree(safeCourses),
        [safeCourses],
    );
    useEffect(() => {
        console.log("TREE COUNT", treeNodes.length);

        treeNodes.forEach((node) => {
            console.log(node.id, node.label, node.children?.length);
        });
    }, [treeNodes]);

    // Tree state management
    const {
        filteredNodes,
        expandedKeys,
        selectedNode,
        toggleExpand,
        setSelectedNode,
        expandAll,
        collapseAll,
        searchQuery,
        setSearchQuery,
        scope,
        setScope,
        isPending,
        setExpand,
        refreshTree,
    } = useTree(treeNodes);

    // Clipboard state management
    const {
        clipboard,
        moveTarget,
        moveOpen,
        setMoveOpen,
        isClipboardProcessing,
        handleCopy,
        handlePaste,
        handleDuplicate,
        handleMove,
        handleMoveConfirm,
        handleDeleteQuestion,
    } = useClipboard();

    // ── Modal open/close states ─────────────────────────────────
    const [courseCreateOpen, setCourseCreateOpen] = useState(false);
    const [courseEditOpen, setCourseEditOpen] = useState(false);
    const [courseDeleteOpen, setCourseDeleteOpen] = useState(false);

    const [examCreateOpen, setExamCreateOpen] = useState(false);
    const [examEditOpen, setExamEditOpen] = useState(false);
    const [examDeleteOpen, setExamDeleteOpen] = useState(false);

    const [examModalStep, setExamModalStep] = useState(0);

    const [activeCourse, setActiveCourse] = useState<CourseData | null>(null);
    const [activeExam, setActiveExam] = useState<ExamsData | null>(null);

    // ── Handler callbacks — wrapped in useCallback so their identity is stable
    // across re-renders, preventing the context value from being recreated every
    // time an unrelated state changes. ─────────────────────────────────────────

    const handleAddCourse = useCallback(() => {
        setCourseCreateOpen(true);
    }, []);

    const handleEditCourse = useCallback((course: CourseData | null) => {
        setActiveCourse(course);
        setCourseEditOpen(true);
    }, []);

    const handleDeleteCourse = useCallback((course: CourseData | null) => {
        setActiveCourse(course);
        setCourseDeleteOpen(true);
    }, []);

    const handleAddExam = useCallback(
        (course: CourseData | null) => {
            setActiveCourse(course);
            setExamCreateOpen(true);
            if (course?.id) {
                setExpand(`course-${course.id}`, true);
            }
        },
        [setExpand],
    );

    const handleEditExam = useCallback(
        (exam: ExamsData) => {
            setActiveExam(exam);
            const course = safeCourses.find(
                (c) => String(c?.id) === String(exam?.course_id),
            );
            setActiveCourse(course ?? null);
            setExamEditOpen(true);
            if (course?.id) {
                setExpand(`course-${course.id}`, true);
            }
        },
        [safeCourses, setExpand],
    );

    const handleDeleteExam = useCallback(
        (exam: ExamsData) => {
            setActiveExam(exam);
            const course = safeCourses.find(
                (c) => String(c?.id) === String(exam?.course_id),
            );
            setActiveCourse(course ?? null);
            setExamDeleteOpen(true);
        },
        [safeCourses],
    );

    const handleDownloadExam = useCallback((exam: ExamsData) => {
        if (exam?.course_id && exam?.id) {
            courseService.downloadExam(exam.course_id, exam.id);
        }
    }, []);

    // ── Derived selected-node data ──────────────────────────────

    const selectedNodeExams = useMemo(() => {
        if (selectedNode?.type === "course") {
            return (selectedNode.originalData as CourseData).exams;
        }
        return [];
    }, [selectedNode]);

    const selectedNodeAnswers = useMemo(() => {
        if (selectedNode?.type === "question") {
            return (selectedNode.originalData as QuestionsData).answers;
        }
        return [];
    }, [selectedNode]);

    // ── Render ──────────────────────────────────────────────────

    return (
        <div className="flex flex-col gap-6 py-2">
            <div>
                <h3 className="text-2xl font-bold tracking-tight">
                    Courses Explorer
                </h3>
                <p className="text-muted-foreground mt-1">
                    Manage your courses, exams, and questions hierarchically.
                    Click nodes in the explorer to view detailed information.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* ── Tree Explorer Panel ─────────────────────── */}
                <div className="md:col-span-5 lg:col-span-4 h-full">
                    <TreeRoot
                        filteredNodes={filteredNodes}
                        expandedKeys={expandedKeys}
                        selectedNode={selectedNode}
                        toggleExpand={toggleExpand}
                        setSelectedNode={setSelectedNode}
                        expandAll={expandAll}
                        collapseAll={collapseAll}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        scope={scope}
                        setScope={setScope}
                        isPending={isPending}
                        onAddCourse={handleAddCourse}
                        onAddExam={handleAddExam}
                        onEditCourse={handleEditCourse}
                        onDeleteCourse={handleDeleteCourse}
                        onEditExam={handleEditExam}
                        onDeleteExam={handleDeleteExam}
                        onDownloadExam={handleDownloadExam}
                        clipboard={clipboard}
                        onCopy={handleCopy}
                        onPaste={handlePaste}
                        onMove={handleMove}
                        onDuplicate={handleDuplicate}
                        onDeleteQuestion={handleDeleteQuestion}
                    />
                </div>

                {/* ── Detail Panel ────────────────────────────── */}
                <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-6">
                    {!selectedNode || selectedNode.id === "root" ? (
                        <ExplorerEmptyState onAddCourse={handleAddCourse} />
                    ) : selectedNode.type === "course" ? (
                        <CourseDetails
                            selectedNode={selectedNode}
                            selectedNodeExams={selectedNodeExams}
                            onEditCourse={handleEditCourse}
                            onDeleteCourse={handleDeleteCourse}
                            onAddExam={handleAddExam}
                            onDownloadExam={handleDownloadExam}
                        />
                    ) : selectedNode.type === "exam" ? (
                        <ExamDetails
                            selectedNode={selectedNode}
                            onEditExam={handleEditExam}
                            onDeleteExam={handleDeleteExam}
                            onDownloadExam={handleDownloadExam}
                        />
                    ) : (
                        <QuestionDetails
                            selectedNode={selectedNode}
                            selectedNodeAnswers={selectedNodeAnswers}
                        />
                    )}
                </div>
            </div>

            {/* ── Modals ─────────────────────────────────────── */}

            {courseCreateOpen && (
                <ModalDynamic
                    open={courseCreateOpen}
                    setOpen={setCourseCreateOpen}
                    inputForm={form}
                    url={route("courses.store")}
                    title="Create Course"
                    description="Create a new course"
                    method="post"
                />
            )}

            {activeCourse?.id && courseEditOpen && (
                <ModalDynamic
                    open={courseEditOpen}
                    setOpen={setCourseEditOpen}
                    inputForm={form}
                    url={route("courses.update", activeCourse.id)}
                    title="Edit Course"
                    description="Edit the course details"
                    method="put"
                    dataForm={activeCourse}
                />
            )}

            {activeCourse?.id && courseDeleteOpen && (
                <ModalDynamic
                    open={courseDeleteOpen}
                    setOpen={setCourseDeleteOpen}
                    url={route("courses.destroy", activeCourse.id)}
                    title="Delete Course"
                    description={`Are you sure you want to delete Course "${activeCourse.name}"? This will delete all containing exams.`}
                    method="delete"
                />
            )}

            {activeCourse?.id && examCreateOpen && (
                <ModalDynamicAdvanced
                    open={examCreateOpen}
                    label="Create Exam"
                    onOpenChange={setExamCreateOpen}
                    className={
                        examModalStep === 1
                            ? "sm:max-w-5xl modal-large flex flex-col p-0 overflow-hidden"
                            : "sm:max-w-xl"
                    }
                >
                    <ExamModalFormQuestions
                        label="Create"
                        method="post"
                        url={route("exams.store", activeCourse.id)}
                        setOpen={setExamCreateOpen}
                        course={activeCourse}
                        onStepChange={setExamModalStep}
                    />
                </ModalDynamicAdvanced>
            )}

            {activeCourse?.id && activeExam?.id && examEditOpen && (
                <ModalDynamicAdvanced
                    open={examEditOpen}
                    label="Update Exam"
                    onOpenChange={setExamEditOpen}
                    className={
                        examModalStep === 1
                            ? "sm:max-w-5xl modal-large flex flex-col p-0 overflow-hidden"
                            : "sm:max-w-xl"
                    }
                >
                    <ExamModalFormQuestions
                        label="Update"
                        method="put"
                        url={route("exams.update", {
                            course: activeCourse.id,
                            exam: activeExam.id,
                        })}
                        setOpen={setExamEditOpen}
                        exam={activeExam}
                        course={activeCourse}
                        onStepChange={setExamModalStep}
                    />
                </ModalDynamicAdvanced>
            )}

            {activeCourse?.id && activeExam?.id && examDeleteOpen && (
                <ModalDynamic
                    open={examDeleteOpen}
                    setOpen={setExamDeleteOpen}
                    url={route("exams.destroy", {
                        course: activeCourse.id,
                        exam: activeExam.id,
                    })}
                    title="Delete Exam"
                    description={`Are you sure you want to delete Exam "${activeExam.name}"?`}
                    method="delete"
                />
            )}

            {moveOpen && (
                <MoveModal
                    open={moveOpen}
                    onOpenChange={setMoveOpen}
                    nodeToMove={moveTarget}
                    courses={safeCourses}
                    onMoveConfirm={handleMoveConfirm}
                    processing={isClipboardProcessing}
                />
            )}
        </div>
    );
}

Home.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Home;
