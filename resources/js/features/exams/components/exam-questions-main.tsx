/**
 * exam-questions-main.tsx
 *
 * Purpose:
 * Renders the question editor interface (Step 2) with a question navigation list.
 *
 * Responsibilities:
 * - Render left sidebar list of questions with their index number
 * - Render right side question editing panel
 * - Handle question pagination and keyboard hotkeys (ArrowUp/ArrowDown)
 *
 * Dependencies:
 * - RadioGroup and Progress components (Shadcn UI)
 * - Lucide icons
 * - framer-motion animations
 */

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState, useMemo, useCallback } from "react";
import ExamQuestions from "./exam-questions";
import { RadioGroup } from "@/components/ui/radio-group";
import ExamAnswers from "./exam-answers";
import { cn } from "@/lib/utils";
import { X, Plus, HelpCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";

interface ExamFormQuestionsProps {
    backSelf: any;
    data: any;
    errors: any;
    updateQuestion: any;
    updateAnswer: any;
    removeQuestion: any;
    addAnswer: any;
    removeAnswer: any;
    toggleCorrect: any;
    addQuestion: any;
}

function ExamFormQuestions({
    backSelf,
    data,
    errors,
    updateQuestion,
    updateAnswer,
    removeQuestion,
    addAnswer,
    removeAnswer,
    toggleCorrect,
    addQuestion,
}: ExamFormQuestionsProps) {
    const [questionCurrent, setQuestionCurrent] = useState(0);

    const questions = useMemo(() => {
        return Array.isArray(data?.questions) ? data.questions : [];
    }, [data?.questions]);

    const totalQuestions = questions.length;
    const currentQuestion = questions[questionCurrent] || null;

    const [multiChosen, setMultiChosen] = useState(
        currentQuestion?.multiple || false,
    );

    // Sync multiChosen with current active question selection
    useEffect(() => {
        if (currentQuestion) {
            setMultiChosen(currentQuestion.multiple || false);
        }
    }, [questionCurrent, currentQuestion]);

    const progressQuestions = totalQuestions > 0
        ? Math.floor(((questionCurrent + 1) / totalQuestions) * 100)
        : 0;

    const handleNext = useCallback(() => {
        if (questionCurrent + 1 < totalQuestions) {
            setQuestionCurrent(prev => prev + 1);
        }
    }, [questionCurrent, totalQuestions]);

    const handlePrevious = useCallback(() => {
        if (questionCurrent > 0) {
            setQuestionCurrent(prev => prev - 1);
        }
    }, [questionCurrent]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                document.activeElement?.tagName === "INPUT" ||
                document.activeElement?.tagName === "TEXTAREA"
            ) {
                return;
            }

            if (e.key === "ArrowDown") {
                e.preventDefault();
                handleNext();
            }

            if (e.key === "ArrowUp") {
                e.preventDefault();
                handlePrevious();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleNext, handlePrevious]);

    const errorShow = Object.keys(errors)
        .filter((key) => key.startsWith("questions."))
        .map((key) => key.split(".")[1]);
    const errorSet = new Set(errorShow.map(Number));

    const handleRemoveQuestion = (i: number) => {
        removeQuestion(i);
        setQuestionCurrent((prev) => {
            const nextLength = totalQuestions - 1;
            if (nextLength <= 0) return 0;
            if (prev > nextLength - 1) return nextLength - 1;
            if (i < prev) return prev - 1;
            return prev;
        });
    };

    useEffect(() => {
        if (questionCurrent >= totalQuestions && totalQuestions > 0) {
            setQuestionCurrent(totalQuestions - 1);
        }
        if (totalQuestions === 0) {
            backSelf(0);
        }
    }, [totalQuestions, questionCurrent, backSelf]);

    if (!currentQuestion) return null;

    const answers = Array.isArray(currentQuestion.answers) ? currentQuestion.answers : [];

    const answersList = (
        <div className="space-y-2.5">
            {answers.map((answer: any, answerIndex: number) => (
                <ExamAnswers
                    key={answerIndex}
                    questionIndex={questionCurrent}
                    answer={answer}
                    answerIndex={answerIndex}
                    updateAnswer={updateAnswer}
                    removeAnswer={removeAnswer}
                    errors={errors}
                    multiChosen={multiChosen}
                />
            ))}
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row flex-1 exam-editor-panel overflow-hidden bg-background divide-y md:divide-y-0 md:divide-x border border-border rounded-xl">
            {/* 1. Left Sidebar Navigation */}
            <div className="w-full md:w-64 flex flex-col bg-muted/10 shrink-0 select-none">
                <div className="hidden md:flex p-3 border-b justify-between items-center bg-muted/20">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Questions ({totalQuestions})
                    </span>
                </div>

                <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto p-2 gap-1.5 md:space-y-1 max-h-[56px] md:max-h-none items-center scrollbar-none">
                    {questions.map((q: any, idx: number) => {
                        const hasError = errorSet.has(idx);
                        const isActive = idx === questionCurrent;
                        return (
                            <div
                                key={idx}
                                onClick={() => setQuestionCurrent(idx)}
                                className={cn(
                                    "group relative flex items-center justify-center md:justify-between w-9 h-9 md:w-full md:h-auto p-0 md:p-2.5 rounded-full md:rounded-lg cursor-pointer transition-all border text-sm shrink-0",
                                    isActive
                                        ? "bg-primary/10 border-primary text-primary font-semibold md:bg-primary/5 md:border-primary/20 shadow-xs"
                                        : "bg-background md:bg-transparent border-border md:border-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground",
                                    hasError && !isActive && "border-destructive bg-destructive/5 text-destructive"
                                )}
                            >
                                <div className="flex items-center gap-2 truncate md:pr-6">
                                    <span className={cn(
                                        "flex items-center justify-center w-6 h-6 md:w-5 md:h-5 text-xs rounded-full border shrink-0 transition-all font-semibold",
                                        isActive 
                                            ? "bg-primary text-primary-foreground border-primary" 
                                            : "bg-muted border-border text-muted-foreground"
                                    )}>
                                        {idx + 1}
                                    </span>
                                    <span className="hidden md:inline truncate">
                                        {q.text ? q.text : <span className="italic opacity-60">Empty question</span>}
                                    </span>
                                </div>

                                {/* Danger Error Dot indicator */}
                                {hasError && (
                                    <div className="absolute right-1 top-1 md:right-8 md:top-auto w-1.5 h-1.5 rounded-full bg-destructive" />
                                )}

                                {/* Delete Question trigger */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveQuestion(idx);
                                    }}
                                    className="hidden md:group-hover:flex p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded transition-all absolute right-2"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        );
                    })}
                    
                    {/* Add Question Button on Mobile */}
                    <button
                        type="button"
                        onClick={addQuestion}
                        className="flex md:hidden items-center justify-center w-9 h-9 rounded-full border border-dashed border-primary/40 text-primary hover:bg-primary/5 shrink-0 transition-all"
                        title="Add Question"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                <div className="hidden md:block p-2 border-t bg-muted/20">
                    <Button
                        type="button"
                        onClick={addQuestion}
                        variant="outline"
                        className="w-full justify-center gap-2 h-9 border-dashed font-semibold text-xs"
                    >
                        <Plus className="w-4 h-4" /> Add Question
                    </Button>
                </div>
            </div>

            {/* 2. Right Main Editor Panel */}
            <div className="flex-1 flex flex-col overflow-hidden bg-background">
                {/* Right Panel Header / Progress indicator */}
                <div className="px-6 py-3 border-b flex items-center justify-between bg-muted/5">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-muted-foreground">
                                Question {questionCurrent + 1} of {totalQuestions}
                            </span>
                        </div>
                        <Progress value={progressQuestions} className="w-24 sm:w-36 h-1.5" />
                    </div>

                    <div className="flex gap-1.5">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveQuestion(questionCurrent)}
                            className="w-8 h-8 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 md:hidden"
                            title="Delete Current Question"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handlePrevious}
                            disabled={questionCurrent === 0}
                            className="w-8 h-8 rounded-md"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleNext}
                            disabled={questionCurrent === totalQuestions - 1}
                            className="w-8 h-8 rounded-md"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Right Scrollable Content Panel */}
                <div className="flex-1 overflow-y-auto p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={questionCurrent}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.15 }}
                            className="space-y-6"
                        >
                            {/* Question details components */}
                            <ExamQuestions
                                question={currentQuestion}
                                questionIndex={questionCurrent}
                                updateQuestion={updateQuestion}
                                errors={errors}
                                multiChosen={multiChosen}
                                setMultiChosen={setMultiChosen}
                            />

                            {/* Options/Answers List section */}
                            <div className="space-y-3 pt-4 border-t border-border">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                                        <HelpCircle className="w-4 h-4 text-primary" />
                                        Answer Options
                                    </Label>
                                    <Button
                                        type="button"
                                        onClick={() => addAnswer(questionCurrent)}
                                        variant="outline"
                                        size="sm"
                                        className="h-8 gap-1.5 text-xs font-semibold"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Add Option
                                    </Button>
                                </div>

                                {!multiChosen ? (
                                    <RadioGroup
                                        value={answers
                                            .findIndex((a: any) => a.is_correct)
                                            .toString()}
                                        onValueChange={(value) =>
                                            toggleCorrect(questionCurrent, Number(value))
                                        }
                                        className="space-y-2"
                                    >
                                        {answersList}
                                    </RadioGroup>
                                ) : (
                                    <div className="space-y-2">
                                        {answersList}
                                    </div>
                                )}

                                {errors[`questions.${questionCurrent}.answers`] && (
                                    <p className="text-destructive text-xs font-medium flex items-center gap-1 mt-1">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                        {errors[`questions.${questionCurrent}.answers`]}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export { ExamFormQuestions };
