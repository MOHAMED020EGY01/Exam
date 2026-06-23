/**
 * ExamWizard.tsx
 *
 * Purpose:
 * Container component that orchestrates the multi-step exam wizard form.
 *
 * Responsibilities:
 * - Render step headers and navigation indicator dots
 * - Maintain multi-step validation logic and Inertia post action
 * - Coordinate state updates of the questions array
 * - Convert backend QuestionsData to form-compatible Question type
 *
 * Dependencies:
 * - ExamBasicInfo and ExamQuestionsEditor components
 * - QuestionService
 * - Inertia useForm hook
 *
 * Notes:
 * - Type-safe: Uses proper TypeScript types for all props
 * - Supports create/edit modes via exam prop
 * - Uses local error state to avoid mutating Inertia's errors object
 * - Converts backend image strings to File|null for form handling
 */

import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "@inertiajs/react";
import type { Answer, Question } from "@/types";
import { QuestionService } from "@/services";
import { ExamBasicInfo } from "./ExamBasicInfo";
import { ExamQuestionsEditor } from "./ExamQuestionsEditor";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type {
    TypeMethodHTTP,
    CourseData,
    ExamsData,
    QuestionsData,
    AnswerData,
} from "@/types";

type FormData = {
    name: string;
    description: string;
    questions: Question[];
};

// Convert QuestionsData (from backend) to Question (for form)
function convertQuestionsDataToFormQuestions(qd: QuestionsData[]): Question[] {
    return qd.map((q: QuestionsData) => ({
        text: q.text,
        multiple: q.multiple,
        image: null, // Images are handled as File uploads in form, not strings from backend
        answers: q.answers.map((a: AnswerData) => ({
            text: a.text,
            is_correct: a.is_correct,
            image: null, // Same for answer images
        })),
    }));
}

interface ExamModalFormQuestionsProps {
    setOpen: (open: boolean) => void;
    label: string;
    exam?: ExamsData | null;
    method?: TypeMethodHTTP;
    url?: string;
    course?: CourseData | null;
    onStepChange?: (step: number) => void;
}

export function ExamWizard({
    setOpen,
    label,
    method = "get",
    exam = null,
    url = "#",
    course = null,
    onStepChange,
}: ExamModalFormQuestionsProps) {
    const [activeStep, setActiveStep] = useState(0);
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
    const { data, setData, processing, resetAndClearErrors, errors, submit } =
        useForm<FormData>({
            name: exam?.name ? exam.name : "",
            description: exam?.description ? exam.description : "",
            questions: exam?.questions_package
                ? convertQuestionsDataToFormQuestions(exam.questions_package)
                : [],
        });
    useEffect(() => {
        onStepChange?.(activeStep);
    }, [activeStep, onStepChange]);

    // Reset step to 0 on unmount to prevent layout leak
    useEffect(() => {
        return () => {
            onStepChange?.(0);
        };
    }, [onStepChange]);

    const addQuestion = () => {
        setData("questions", QuestionService.addQuestion(data.questions));
    };

    const removeQuestion = (qi: number) => {
        setData(
            "questions",
            QuestionService.removeQuestion(data.questions, qi),
        );
    };

    const addAnswer = (qi: number) => {
        setData("questions", QuestionService.addAnswer(data.questions, qi));
    };

    const removeAnswer = (qi: number, ai: number) => {
        setData(
            "questions",
            QuestionService.removeAnswer(data.questions, qi, ai),
        );
    };

    const updateQuestion = <K extends keyof Question>(
        qi: number,
        key: K,
        value: Question[K],
    ) => {
        setData(
            "questions",
            QuestionService.updateQuestion(data.questions, qi, key, value),
        );
    };

    const updateAnswer = <K extends keyof Answer>(
        qi: number,
        ai: number,
        key: K,
        value: Answer[K],
    ) => {
        setData(
            "questions",
            QuestionService.updateAnswer(data.questions, qi, ai, key, value),
        );
    };

    const toggleCorrect = (qi: number, ai: number) => {
        setData(
            "questions",
            QuestionService.toggleCorrect(data.questions, qi, ai),
        );
    };

    /* ================= SUBMIT ================= */
    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLocalErrors({}); // Clear local errors on submit

        // The Laravel route expects standard multi-part payload.
        // We let Inertia post the data directly as configured.
        submit(method, url, {
            onSuccess: () => {
                resetAndClearErrors();
                setLocalErrors({});
                setOpen(false);
            },
        });
    };

    const handleCancel = () => {
        resetAndClearErrors();
        setLocalErrors({});
        setOpen(false);
    };

    /* ================= UI ================= */
    const [showErrors, setShowErrors] = useState(false);

    // Combine Inertia errors with local errors
    const allErrors = { ...errors, ...localErrors };

    useEffect(() => {
        if (Object.keys(allErrors).length > 0) {
            setShowErrors(true);
            const timer = setTimeout(() => {
                setShowErrors(false);
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [allErrors]);

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col h-full bg-background modal-large"
        >
            {/* Header Area */}
            <div className="px-6 py-4 border-b border-border shrink-0 flex items-center justify-between">
                <div>
                    <h3 className="text-base font-bold tracking-tight text-foreground">
                        {label} Exam
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {activeStep === 0
                            ? "Configure the basic exam details, name, and description."
                            : "Add questions, answers, specify correct options, and attach files."}
                    </p>
                </div>
                {/* Step indicator */}
                <div className="flex items-center gap-1.5 bg-muted/80 px-2.5 py-1 rounded-full border border-border select-none">
                    <span
                        className={cn(
                            "w-1.5 h-1.5 rounded-full transition-all",
                            activeStep === 0
                                ? "bg-primary"
                                : "bg-muted-foreground/30",
                        )}
                    />
                    <span
                        className={cn(
                            "w-1.5 h-1.5 rounded-full transition-all",
                            activeStep === 1
                                ? "bg-primary"
                                : "bg-muted-foreground/30",
                        )}
                    />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">
                        Step {activeStep + 1} of 2
                    </span>
                </div>
            </div>

            {/* Error Notification Area */}
            {showErrors && Object.entries(allErrors).length > 0 && (
                <div className="px-6 py-2.5 error-banner border-b text-xs space-y-0.5 max-h-24 overflow-y-auto shrink-0 select-none">
                    {Object.entries(allErrors).map(
                        ([field, message], index) => (
                            <div
                                key={index}
                                className="flex items-start gap-1.5"
                            >
                                <span className="font-semibold capitalize shrink-0">
                                    {field.replace(/_/g, " ")}:
                                </span>
                                <span>{message}</span>
                            </div>
                        ),
                    )}
                </div>
            )}

            {/* Main Content Area */}
            <div
                className={cn(
                    "flex-1 min-h-0 overflow-y-auto",
                    activeStep === 0 ? "p-6" : "p-0",
                )}
            >
                {activeStep === 0 ? (
                    <ExamBasicInfo
                        data={data}
                        errors={allErrors}
                        setData={setData}
                        course={course || undefined}
                    />
                ) : (
                    <div className="h-full flex flex-col">
                        {allErrors[`questions`] && (
                            <p className="text-destructive text-xs font-semibold px-6 py-2.5 border-b bg-destructive/5 flex items-center gap-1">
                                {allErrors[`questions`]}
                            </p>
                        )}
                        <ExamQuestionsEditor
                            backSelf={setActiveStep}
                            data={data}
                            errors={allErrors}
                            updateQuestion={updateQuestion}
                            updateAnswer={updateAnswer}
                            removeQuestion={removeQuestion}
                            addAnswer={addAnswer}
                            removeAnswer={removeAnswer}
                            toggleCorrect={toggleCorrect}
                            addQuestion={addQuestion}
                        />
                    </div>
                )}
            </div>

            {/* Footer Navigation */}
            <div className="px-6 py-4 border-t border-border bg-muted/20 shrink-0 flex items-center justify-between">
                <div>
                    {activeStep === 1 ? (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setActiveStep(0)}
                            className="font-semibold text-xs gap-1.5 h-9"
                        >
                            ← Back to basic details
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleCancel}
                            className="font-semibold text-xs text-muted-foreground hover:text-foreground h-9"
                        >
                            Cancel
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {activeStep === 0 ? (
                        <Button
                            type="button"
                            onClick={() => {
                                // Validate basic fields before advancing
                                if (!data.name.trim()) {
                                    setLocalErrors({
                                        name: "Exam name is required",
                                    });
                                    setShowErrors(true);
                                    return;
                                }
                                setLocalErrors({}); // Clear local errors when validation passes
                                setActiveStep(1);
                                if (data.questions.length === 0) {
                                    addQuestion();
                                }
                            }}
                            className="font-semibold text-xs h-9 gap-1"
                        >
                            Configure questions →
                        </Button>
                    ) : (
                        <>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                className="font-semibold text-xs h-9"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="font-semibold text-xs h-9 gap-1.5 min-w-[120px]"
                            >
                                {processing ? (
                                    <>
                                        Saving... <Spinner />
                                    </>
                                ) : (
                                    <>Publish Exam</>
                                )}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </form>
    );
}
