/**
 * index.tsx
 *
 * Purpose:
 * Main Courses Explorer page component mapping courses, exams, and question trees.
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

import { ReactNode, useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ModalDynamic } from "@/components/common/Modal";
import { ModalDynamicAdvanced } from "@/components/common/ModalAdvanced";
import { ExamModalFormQuestions } from "@/features/exams/components/exam-components";
import { FieldForm } from "@/interface/modal-interface";
import { useTree } from "@/hooks/use-tree";
import { normalizeCoursesToTree } from "@/lib/treeHelpers";
import { courseService } from "@/services/courseService";
import { TreeRoot } from "@/components/tree/TreeRoot";
import { MoveModal } from "@/components/tree/MoveModal";
import { useClipboard } from "@/hooks/use-clipboard";
import { CourseDetails } from "@/components/page/CourseDetails";
import { ExamDetails } from "@/components/page/ExamDetails";
import { QuestionDetails } from "@/components/page/QuestionDetails";
import { ExplorerEmptyState } from "@/components/page/ExplorerEmptyState";
import { CourseData, ExamsData, QuestionsData } from "@/interface/global";

interface Props {
    courses: CourseData[];
}

const form = [
    { field: "name", type: "input" },
    { field: "description", type: "input" },
] as FieldForm[];

function Home ({ courses }: Props){

    //! Not work if change in courses
    const safeCourses = useMemo((): CourseData[] => {
        return courses;
    }, [courses]);

    //! Change Data from Object Api to TreeNodeData
    const treeNodes = useMemo(
        () => normalizeCoursesToTree(safeCourses),
        [safeCourses],
    );

    //! Add all feature to new TreeNodeData
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
    } = useTree(treeNodes);

    //! Clipboard
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

    //TODO uesState instead of useState

    const [courseCreateOpen, setCourseCreateOpen] = useState(false);
    const [courseEditOpen, setCourseEditOpen] = useState(false);
    const [courseDeleteOpen, setCourseDeleteOpen] = useState(false);

    const [examCreateOpen, setExamCreateOpen] = useState(false);
    const [examEditOpen, setExamEditOpen] = useState(false);
    const [examDeleteOpen, setExamDeleteOpen] = useState(false);

    const [examModalStep, setExamModalStep] = useState(0);

    const [activeCourse, setActiveCourse] = useState<CourseData | null>(null);
    const [activeExam, setActiveExam] = useState<ExamsData | null>(null);

    const handleAddCourse = () => setCourseCreateOpen(true);

    const handleEditCourse = (course: CourseData | null) => {
        setActiveCourse(course);
        setCourseEditOpen(true);
    };

    const handleDeleteCourse = (course: CourseData | null) => {
        setActiveCourse(course);
        setCourseDeleteOpen(true);
    };

    const handleAddExam = (course: CourseData | null) => {
        setActiveCourse(course);
        setExamCreateOpen(true);
        if (course && course.id) {
            setExpand(`course-${course.id}`, true);
        }
    };

    const handleEditExam = (exam: ExamsData) => {
        setActiveExam(exam);
        const course = safeCourses.find(
            (c) => String(c?.id) === String(exam?.course_id),
        );
        setActiveCourse(course ?? null);
        setExamEditOpen(true);
        if (course && course.id) {
            setExpand(`course-${course.id}`, true);
        }
    };

    const handleDeleteExam = (exam: ExamsData) => {
        setActiveExam(exam);
        const course = safeCourses.find(
            (c) => String(c?.id) === String(exam?.course_id),
        );
        setActiveCourse(course ?? null);
        setExamDeleteOpen(true);
    };

    const handleDownloadExam = (exam: ExamsData) => {
        if (exam && exam.course_id && exam.id) {
            courseService.downloadExam(exam.course_id, exam.id);
        }
    };

    const selectedNodeExams = useMemo(() => {
        if (selectedNode?.type == "course"){
            const course = selectedNode.originalData as CourseData;
            return course.exams;
        }
        return [];
    }, [selectedNode]);

    const selectedNodeAnswers = useMemo(() => {
        if (selectedNode?.type == "question"){
            const question = selectedNode.originalData as QuestionsData;
            return question.answers;
        }
        return [];
    }, [selectedNode]);

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
};

Home.layout = (page: ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);
export default Home;
