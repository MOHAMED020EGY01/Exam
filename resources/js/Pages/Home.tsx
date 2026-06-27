/**
 * Home.tsx
 *
 * Purpose:
 * Main Courses Explorer page component mapping courses, exams, and question trees.
 *
 * Responsibilities:
 * - Render hierarchical explorer navigation tree on the left
 * - Render contextual detail panels dynamically on the right based on selection
 * - Coordinate course and exam creation, editing, and deletion via modals
 * - Use separate TreeContext and ClipboardContext for state management
 *
 * Dependencies:
 * - useTree (from features/tree)
 * - ClipboardProvider and useClipboardContext
 * - CourseDetails, ExamDetails, QuestionDetails, ExplorerEmptyState
 * - DashboardLayout
 */

import { ReactNode, useState, useMemo, useCallback, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ModalDynamic } from "@/components/common/Modal";
import { ModalDynamicAdvanced } from "@/components/common/ModalAdvanced";
import { ExamWizard } from "@/features/exams/components/ExamWizard";
import { FieldForm } from "@/types";
import { useTree } from "@/features/tree/hooks/useTree";
import { TreeNormalizerService, CourseService, Routes } from "@/services";
import { TreeRoot } from "@/features/tree/components/TreeRoot";
import { MoveModal } from "@/features/clipboard/components/MoveModal";
import { ClipboardProvider, useClipboardContext } from "@/features/clipboard/context/ClipboardContext";
import { TreeProvider } from "@/features/tree/context/TreeContext";
import { CourseDetails } from "@/components/page/CourseDetails";
import { ExamDetails } from "@/components/page/ExamDetails";
import { QuestionDetails } from "@/components/page/QuestionDetails";
import { ExplorerEmptyState } from "@/components/page/ExplorerEmptyState";
import type { CourseData, ExamsData, QuestionsData } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { examCreateEvent, examDeleteEvent, examUpdateEvent } from "@/events";
import { questionPasteEvent } from "@/events/clipboardEvent/Question/QuestionPasteEvent";

interface Props {
  courses: CourseData[];
}

const form = [
  { field: "name", type: "input" },
  { field: "description", type: "input" },
] as FieldForm[];

function HomeContent({ courses }: Props) {
  const user = useAuth();

  examCreateEvent()
  examUpdateEvent()
  examDeleteEvent()

  questionPasteEvent()




  // Stabilise the courses reference
  const safeCourses = useMemo((): CourseData[] => courses, [courses]);

  // Convert flat API data → TreeNode hierarchy
  const treeNodes = useMemo(
    () => TreeNormalizerService.normalizeCoursesToTree(safeCourses),
    [safeCourses]
  );

  // Tree state management
  const treeState = useTree(treeNodes);

  // Clipboard state management
  const {
    moveOpen,
    moveTarget,
    setMoveOpen,
    isClipboardProcessing,
    actions: clipboardActions,
  } = useClipboardContext();

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

  // ── Handler callbacks
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
        treeState.setExpand(`course-${course.id}`, true);
      }
    },
    [treeState.setExpand]
  );

  const handleEditExam = useCallback(
    (exam: ExamsData) => {
      setActiveExam(exam);
      const course = safeCourses.find(
        (c) => String(c?.id) === String(exam?.course_id)
      );
      setActiveCourse(course ?? null);
      setExamEditOpen(true);
      if (course?.id) {
        treeState.setExpand(`course-${course.id}`, true);
      }
    },
    [safeCourses, treeState.setExpand]
  );

  const handleDeleteExam = useCallback(
    (exam: ExamsData) => {
      setActiveExam(exam);
      const course = safeCourses.find(
        (c) => String(c?.id) === String(exam?.course_id)
      );
      setActiveCourse(course ?? null);
      setExamDeleteOpen(true);
    },
    [safeCourses]
  );

  const handleDownloadExam = useCallback((exam: ExamsData) => {
    if (exam?.course_id && exam?.id) {
      CourseService.downloadExam(exam.course_id, exam.id);
    }
  }, []);

  // ── Derived selected-node data ──────────────────────────────
  const selectedNodeExams = useMemo(() => {
    if (treeState.selectedNode?.type === "course") {
      return (treeState.selectedNode.originalData as CourseData).exams;
    }
    return [];
  }, [treeState.selectedNode]);

  const selectedNodeAnswers = useMemo(() => {
    if (treeState.selectedNode?.type === "question") {
      return (treeState.selectedNode.originalData as QuestionsData).answers;
    }
    return [];
  }, [treeState.selectedNode]);

  // ── Tree context value ────────────────────────────────────────
  const treeContextValue = useMemo(() => ({
    expandedKeys: treeState.expandedKeys,
    selectedNode: treeState.selectedNode,
    filteredNodes: treeState.filteredNodes,
    searchQuery: treeState.searchQuery,
    setSearchQuery: treeState.setSearchQuery,
    scope: treeState.scope,
    setScope: treeState.setScope,
    isPending: treeState.isPending,
    toggleExpand: treeState.toggleExpand,
    expandAll: treeState.expandAll,
    collapseAll: treeState.collapseAll,
    setSelectedNode: treeState.setSelectedNode,
    actions: {
      addCourse: handleAddCourse,
      addExam: handleAddExam,
      editCourse: handleEditCourse,
      deleteCourse: handleDeleteCourse,
      editExam: handleEditExam,
      deleteExam: handleDeleteExam,
      downloadExam: handleDownloadExam,
    },
  }), [treeState, handleAddCourse, handleAddExam, handleEditCourse, handleDeleteCourse, handleEditExam, handleDeleteExam, handleDownloadExam]);

  // ── Render ──────────────────────────────────────────────────
  return (
    <TreeProvider value={treeContextValue}>
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
            <TreeRoot />
          </div>

          {/* ── Detail Panel ────────────────────────────── */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-6">
            {!treeState.selectedNode || treeState.selectedNode.id === "root" ? (
              <ExplorerEmptyState onAddCourse={handleAddCourse} />
            ) : treeState.selectedNode.type === "course" ? (
              <CourseDetails
                selectedNode={treeState.selectedNode}
                selectedNodeExams={selectedNodeExams}
                onEditCourse={handleEditCourse}
                onDeleteCourse={handleDeleteCourse}
                onAddExam={handleAddExam}
                onDownloadExam={handleDownloadExam}
              />
            ) : treeState.selectedNode.type === "exam" ? (
              <ExamDetails
                selectedNode={treeState.selectedNode}
                onEditExam={handleEditExam}
                onDeleteExam={handleDeleteExam}
                onDownloadExam={handleDownloadExam}
              />
            ) : (
              <QuestionDetails
                selectedNode={treeState.selectedNode}
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
            url={Routes.courses.store()}
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
            url={Routes.courses.update(activeCourse.id)}
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
            url={Routes.courses.destroy(activeCourse.id)}
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
            <ExamWizard
              label="Create"
              method="post"
              url={Routes.exams.store(activeCourse.id)}
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
            <ExamWizard
              label="Update"
              method="put"
              url={Routes.exams.update(activeCourse.id, activeExam.id)}
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
            url={Routes.exams.destroy(activeCourse.id, activeExam.id)}
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
            onMoveConfirm={clipboardActions.moveConfirm}
            processing={isClipboardProcessing}
          />
        )}
      </div>
    </TreeProvider>
  );
}

function Home({ courses }: Props) {
  return (
    <ClipboardProvider>
      <HomeContent courses={courses} />
    </ClipboardProvider>
  );
}

Home.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Home;
