import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Answer, Question, Questions } from "@/features/questions/class/question";
import { ExamData } from "./exam-data";
import { ExamFormQuestions } from "./exam-questions-main";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type FormData = {
    name: string;
    description: string;
    questions: Question[];
};

function ExamModalFormQuestions({
    setOpen,
    label,
    exam = null,
    url = "#",
    course = null,
    onStepChange,
}: {
    setOpen: (open: boolean) => void;
    label: string;
    exam?: any;
    method?: any;
    url?: any;
    course?: any;
    onStepChange?: (step: number) => void;
}) {
    const [activeStep, setActiveStep] = useState(0);
    const {
        data,
        setData,
        post,
        processing,
        resetAndClearErrors,
        errors,
    } = useForm<FormData>({
        name: exam?.name ? exam.name : "",
        description: exam?.description ? exam.description : "",
        questions: exam?.questions_package ? exam.questions_package : [],
    });

    // Notify parent when activeStep changes to adjust modal size dynamically
    useEffect(() => {
        onStepChange?.(activeStep);
    }, [activeStep, onStepChange]);

    // Reset step to 0 on unmount to prevent layout leak
    useEffect(() => {
        return () => {
            onStepChange?.(0);
        };
    }, [onStepChange]);

    const questionsManager = useMemo(() => {
        return new Questions(data.questions.map((q) => ({ ...q })));
    }, [data.questions]);

    const addQuestion = () => {
        setData("questions", questionsManager.addQuestion());
    };

    const removeQuestion = (qi: number) => {
        setData("questions", questionsManager.removeQuestion(qi));
    };

    const addAnswer = (qi: number) => {
        setData("questions", questionsManager.addAnswer(qi));
    };

    const removeAnswer = (qi: number, ai: number) => {
        setData("questions", questionsManager.removeAnswer(qi, ai));
    };

    const updateQuestion = <K extends keyof Question>(
        qi: number,
        key: K,
        value: Question[K],
    ) => {
        setData("questions", questionsManager.updateQuestion(qi, key, value));
    };

    const updateAnswer = <K extends keyof Answer>(
        qi: number,
        ai: number,
        key: K,
        value: Answer[K],
    ) => {
        setData("questions", questionsManager.updateAnswer(qi, ai, key, value));
    };

    const toggleCorrect = (qi: number, ai: number) => {
        setData("questions", questionsManager.toggleCorrect(qi, ai));
    };

    /* ================= SUBMIT ================= */
    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        // The Laravel route expects standard multi-part payload.
        // We let Inertia post the data directly as configured.
        post(url, {
            onSuccess: () => {
                resetAndClearErrors();
                setOpen(false);
            },
        });
    };

    const handleCancel = () => {
        resetAndClearErrors();
        setOpen(false);
    };

    /* ================= UI ================= */
    const [showErrors, setShowErrors] = useState(false);

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            setShowErrors(true);
            const timer = setTimeout(() => {
                setShowErrors(false);
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full bg-background max-h-[90vh]">
            {/* Header Area */}
            <div className="px-6 py-4 border-b border-border shrink-0 flex items-center justify-between">
                <div>
                    <h3 className="text-base font-bold tracking-tight text-foreground">{label} Exam</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {activeStep === 0 
                            ? "Configure the basic exam details, name, and description." 
                            : "Add questions, answers, specify correct options, and attach files."}
                    </p>
                </div>
                {/* Step indicator */}
                <div className="flex items-center gap-1.5 bg-muted/80 px-2.5 py-1 rounded-full border border-border select-none">
                    <span className={cn("w-1.5 h-1.5 rounded-full transition-all", activeStep === 0 ? "bg-primary" : "bg-muted-foreground/30")} />
                    <span className={cn("w-1.5 h-1.5 rounded-full transition-all", activeStep === 1 ? "bg-primary" : "bg-muted-foreground/30")} />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">
                        Step {activeStep + 1} of 2
                    </span>
                </div>
            </div>

            {/* Error Notification Area */}
            {showErrors && Object.entries(errors).length > 0 && (
                <div className="px-6 py-2.5 bg-destructive/10 border-b border-destructive/20 text-destructive text-xs space-y-0.5 max-h-24 overflow-y-auto shrink-0 select-none">
                    {Object.entries(errors).map(([field, message], index) => (
                        <div key={index} className="flex items-start gap-1.5">
                            <span className="font-semibold capitalize shrink-0">{field.replace(/_/g, " ")}:</span>
                            <span>{message}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Main Content Area */}
            <div className={cn(
                "flex-1 min-h-0 overflow-y-auto",
                activeStep === 0 ? "p-6" : "p-0"
            )}>
                {activeStep === 0 ? (
                    <ExamData
                        data={data}
                        errors={errors}
                        setData={setData}
                        course={course}
                    />
                ) : (
                    <div className="h-full flex flex-col">
                        {errors[`questions`] && (
                            <p className="text-destructive text-xs font-semibold px-6 py-2.5 border-b bg-destructive/5 flex items-center gap-1">
                                {errors[`questions`]}
                            </p>
                        )}
                        <ExamFormQuestions
                            backSelf={setActiveStep}
                            data={data}
                            errors={errors}
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
                                    errors.name = "Exam name is required";
                                    setShowErrors(true);
                                    return;
                                }
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
                                    <>Saving... <Spinner /></>
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

export { ExamModalFormQuestions };
