import React, { ReactNode, useState, useMemo } from "react";
import { Link } from "@inertiajs/react";
import { DashboardLayout } from "@/components/layout/dashboard";
import { ModalDynamic } from "@/components/modal";
import { ModalDynamicAdvanced } from "@/components/utils/modal-advanced";
import { ExamModalFormQuestions } from "@/features/exams/components/exam-components";
import { Button } from "@/components/ui/button";
import { FieldForm } from "@/interface/modal-interface";
import { useTree } from "@/hooks/use-tree";
import { normalizeCoursesToTree, TreeNodeData } from "@/lib/treeHelpers";
import { courseService } from "@/lib/courseService";
import { TreeRoot } from "@/components/tree/TreeRoot";
import { 
  Book, 
  FileText, 
  HelpCircle, 
  Pen, 
  Trash, 
  Plus, 
  Download, 
  Calendar,
  CheckCircle2,
  XCircle,
  Eye
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseData {
  id: string;
  name: string;
  exam_count: number;
  description: string;
  created_at: string;
  diff_for_humans: string;
  exams?: any[];
}

interface Props {
  courses: CourseData[];
}

const form = [
  { field: "name", type: "input" },
  { field: "description", type: "input" },
] as FieldForm[];

const CoursesIndex = ({ courses }: Props) => {
  // Safe validation of root level courses collection
  const safeCourses = useMemo(() => {
    return Array.isArray(courses) 
      ? courses 
      : (courses && typeof courses === 'object' ? Object.values(courses) : []);
  }, [courses]);

  // 1. Transform backend structure into tree nodes
  const treeNodes = useMemo(() => normalizeCoursesToTree(safeCourses), [safeCourses]);

  // 2. Tree state hook
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

  // 3. Modal open states
  const [courseCreateOpen, setCourseCreateOpen] = useState(false);
  const [courseEditOpen, setCourseEditOpen] = useState(false);
  const [courseDeleteOpen, setCourseDeleteOpen] = useState(false);

  const [examCreateOpen, setExamCreateOpen] = useState(false);
  const [examEditOpen, setExamEditOpen] = useState(false);
  const [examDeleteOpen, setExamDeleteOpen] = useState(false);

  const [examModalStep, setExamModalStep] = useState(0);

  // 4. Modal targets
  const [activeCourse, setActiveCourse] = useState<any>(null);
  const [activeExam, setActiveExam] = useState<any>(null);

  // --- Modal Action Handlers ---
  const handleAddCourse = () => {
    setCourseCreateOpen(true);
  };

  const handleEditCourse = (course: any) => {
    setActiveCourse(course);
    setCourseEditOpen(true);
  };

  const handleDeleteCourse = (course: any) => {
    setActiveCourse(course);
    setCourseDeleteOpen(true);
  };

  const handleAddExam = (course: any) => {
    setActiveCourse(course);
    setExamCreateOpen(true);
    if (course && course.id) {
      setExpand(`course-${course.id}`, true);
    }
  };

  const handleEditExam = (exam: any) => {
    setActiveExam(exam);
    // Find the course ID for the exam using safe array check
    const course = safeCourses.find(c => String(c?.id) === String(exam?.course_id));
    setActiveCourse(course);
    setExamEditOpen(true);
    if (course && course.id) {
      setExpand(`course-${course.id}`, true);
    }
  };

  const handleDeleteExam = (exam: any) => {
    setActiveExam(exam);
    const course = safeCourses.find(c => String(c?.id) === String(exam?.course_id));
    setActiveCourse(course);
    setExamDeleteOpen(true);
  };

  const handleDownloadExam = (exam: any) => {
    if (exam && exam.course_id && exam.id) {
      courseService.downloadExam(exam.course_id, exam.id);
    }
  };

  // Safe checks for rendering children
  const selectedNodeExams = useMemo(() => {
    if (selectedNode?.type !== "course" || !selectedNode?.originalData) return [];
    const exams = selectedNode.originalData.exams;
    if (Array.isArray(exams)) return exams;
    if (exams && Array.isArray(exams.data)) return exams.data;
    return exams && typeof exams === "object" ? Object.values(exams) : [];
  }, [selectedNode]);

  const selectedNodeAnswers = useMemo(() => {
    if (selectedNode?.type !== "question" || !selectedNode?.originalData) return [];
    const answers = selectedNode.originalData.answers;
    if (Array.isArray(answers)) return answers;
    if (answers && Array.isArray(answers.data)) return answers.data;
    return answers && typeof answers === "object" ? Object.values(answers) : [];
  }, [selectedNode]);

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Page Header */}
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Courses Explorer</h3>
        <p className="text-muted-foreground mt-1">
          Manage your courses, exams, and questions hierarchically. Click nodes in the explorer to view detailed information.
        </p>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Side: Tree Explorer */}
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
          />
        </div>

        {/* Right Side: Details / Actions Viewer */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-6">
          {!selectedNode || selectedNode.id === "root" ? (
            /* Empty State / Welcome Screen */
            <Card className="h-full border border-dashed flex flex-col items-center justify-center p-12 text-center bg-muted/10 min-h-[400px]">
              <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
                <Book className="w-8 h-8" />
              </div>
              <CardTitle className="text-xl">Explorer Details</CardTitle>
              <CardDescription className="max-w-sm mt-2 text-sm">
                Select any Course, Exam, or Question from the tree explorer on the left to view detailed metadata, answer choices, and actions.
              </CardDescription>
              <div className="flex gap-3 mt-6">
                <Button onClick={handleAddCourse}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Course
                </Button>
              </div>
            </Card>
          ) : selectedNode.type === "course" ? (
            /* Course Detail Viewer */
            <Card className="shadow-sm">
              <CardHeader className="bg-muted/10 border-b border-border">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Book className="w-5 h-5 text-indigo-500" />
                      <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                        Course
                      </span>
                    </div>
                    <CardTitle className="text-2xl font-bold mt-2">
                      {selectedNode.label}
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {selectedNode.originalData?.description || "No description provided."}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditCourse(selectedNode.originalData)}
                    >
                      <Pen className="w-4 h-4 mr-1.5" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteCourse(selectedNode.originalData)}
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
                    <span className="text-xs text-muted-foreground block">Exams Count</span>
                    <span className="text-2xl font-bold">{selectedNodeExams.length}</span>
                  </div>
                  <div className="p-3 bg-muted/20 border rounded-lg flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <span className="text-xs text-muted-foreground block">Created</span>
                      <span className="text-xs font-semibold">{selectedNode.originalData?.created_at || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-semibold text-foreground">Course Exams ({selectedNodeExams.length})</h4>
                    <Button size="xs" onClick={() => handleAddExam(selectedNode.originalData)}>
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Exam
                    </Button>
                  </div>
                  {selectedNodeExams.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden divide-y">
                      {selectedNodeExams.map((exam: any) => (
                        <div key={exam?.id || String(Math.random())} className="flex justify-between items-center p-3 hover:bg-muted/10 transition-colors text-sm">
                          <div className="flex items-center gap-2 font-medium">
                            <FileText className="w-4 h-4 text-amber-500" />
                            {exam?.name || "Unnamed Exam"}
                            <span className="text-[10px] text-muted-foreground">({exam?.questions_count || 0} Questions)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedNode.originalId && exam?.id ? (
                              <Button asChild size="xs" variant="outline">
                                <Link href={route("exams.show", { course: selectedNode.originalId, exam: exam.id })}>
                                  <Eye className="w-3.5 h-3.5 mr-1" /> View
                                </Link>
                              </Button>
                            ) : (
                              <Button size="xs" variant="outline" disabled>
                                <Eye className="w-3.5 h-3.5 mr-1" /> View
                              </Button>
                            )}
                            <Button size="xs" variant="outline" onClick={() => handleDownloadExam(exam)}>
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
          ) : selectedNode.type === "exam" ? (
            /* Exam Detail Viewer */
            <Card className="shadow-sm">
              <CardHeader className="bg-muted/10 border-b border-border">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-500" />
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        Exam
                      </span>
                    </div>
                    <CardTitle className="text-2xl font-bold mt-2">
                      {selectedNode.label}
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {selectedNode.originalData?.description || "No description provided."}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditExam(selectedNode.originalData)}
                    >
                      <Pen className="w-4 h-4 mr-1.5" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteExam(selectedNode.originalData)}
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
                    <span className="text-xs text-muted-foreground block">Questions</span>
                    <span className="text-2xl font-bold">{selectedNode.originalData?.questions_count || 0}</span>
                  </div>
                  <div className="p-3 bg-muted/20 border rounded-lg col-span-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <span className="text-xs text-muted-foreground block">Created</span>
                      <span className="text-xs font-semibold">{selectedNode.originalData?.created_at || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  {selectedNode.originalData?.course_id && selectedNode.originalId ? (
                    <Button asChild size="lg" className="w-full md:w-auto">
                      <Link href={route("exams.show", { course: selectedNode.originalData.course_id, exam: selectedNode.originalId })}>
                        Take Exam
                      </Link>
                    </Button>
                  ) : (
                    <Button size="lg" className="w-full md:w-auto" disabled>
                      Take Exam
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => handleDownloadExam(selectedNode.originalData)}>
                    <Download className="w-4 h-4 mr-2" /> Download Package (.elr)
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Question Detail Viewer */
            <Card className="shadow-sm">
              <CardHeader className="bg-muted/10 border-b border-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Question {(selectedNode.originalId as number) + 1}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {selectedNode.originalData?.multiple ? "Multiple Choice" : "Single Choice"}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold mt-2 leading-relaxed">
                    {selectedNode.label}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Question Image (if any) */}
                {selectedNode.originalData?.image && (
                  <div className="border rounded-lg overflow-hidden bg-muted/5 p-2 flex justify-center max-w-lg mx-auto">
                    <img 
                      src={selectedNode.originalData.image} 
                      alt="Question Context"
                      className="max-h-60 object-contain rounded-md"
                    />
                  </div>
                )}

                {/* Answer Options */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground">Options:</h4>
                  <div className="flex flex-col gap-3">
                    {selectedNodeAnswers.map((answer: any, index: number) => (
                      <div 
                        key={index} 
                        className={`flex items-start gap-3 p-3 border rounded-lg transition-colors ${
                          answer?.is_correct 
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-300" 
                            : "bg-background border-border text-foreground"
                        }`}
                      >
                        {answer?.is_correct ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-muted-foreground/30 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 space-y-2">
                          <p className="text-sm font-medium leading-relaxed">{answer?.text || "No option text"}</p>
                          {answer?.image && (
                            <div className="border rounded bg-muted/5 p-1 max-w-xs">
                              <img src={answer.image} alt="Option Visual" className="max-h-32 object-contain" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* --- Dynamic Modals --- */}
      
      {/* 1. Create Course */}
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

      {/* 2. Edit Course */}
      {activeCourse && activeCourse.id && courseEditOpen && (
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

      {/* 3. Delete Course */}
      {activeCourse && activeCourse.id && courseDeleteOpen && (
        <ModalDynamic
          open={courseDeleteOpen}
          setOpen={setCourseDeleteOpen}
          url={route("courses.destroy", activeCourse.id)}
          title="Delete Course"
          description={`Are you sure you want to delete Course "${activeCourse.name}"? This will delete all containing exams.`}
          method="delete"
        />
      )}

      {/* 4. Create Exam */}
      {activeCourse && activeCourse.id && examCreateOpen && (
        <ModalDynamicAdvanced
          open={examCreateOpen}
          label="Create Exam"
          onOpenChange={setExamCreateOpen}
          className={examModalStep === 1 ? "sm:max-w-5xl w-full h-[90vh] max-h-[900px] flex flex-col p-0 overflow-hidden" : "sm:max-w-xl"}
          children={
            <ExamModalFormQuestions
              label="Create"
              method="post"
              url={route("exams.store", activeCourse.id)}
              setOpen={setExamCreateOpen}
              course={activeCourse}
              onStepChange={setExamModalStep}
            />
          }
        />
      )}

      {/* 5. Edit Exam */}
      {activeCourse && activeCourse.id && activeExam && activeExam.id && examEditOpen && (
        <ModalDynamicAdvanced
          open={examEditOpen}
          label="Update Exam"
          onOpenChange={setExamEditOpen}
          className={examModalStep === 1 ? "sm:max-w-5xl w-full h-[90vh] max-h-[900px] flex flex-col p-0 overflow-hidden" : "sm:max-w-xl"}
          children={
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
          }
        />
      )}

      {/* 6. Delete Exam */}
      {activeCourse && activeCourse.id && activeExam && activeExam.id && examDeleteOpen && (
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
    </div>
  );
};

CoursesIndex.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
export default CoursesIndex;
