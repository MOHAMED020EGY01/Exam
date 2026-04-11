import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import ExamQuestions from "./exam-questions";
import { RadioGroup } from "@/components/ui/radio-group";
import ExamAnswers from "./exam-answers";
import { cn } from "@/lib/utils";

interface ExamFormQuestionsProps {
    data: any;
    errors: any;
    updateQuestion: any;
    updateAnswer: any;
    removeQuestion: any;
    addAnswer: any;
    removeAnswer: any;
    toggleCorrect: any;
}
function ExamFormQuestions({
    data,
    errors,
    updateQuestion,
    updateAnswer,
    removeQuestion,
    addAnswer,
    removeAnswer,
    toggleCorrect,
}: ExamFormQuestionsProps) {
    const [questionCurrent, setQuestionCurrent] = useState(0);
    let newIndex = questionCurrent || 0;
    const currentQuestion = data.questions[questionCurrent];
    const totalQuestions = data.questions.length;
    const progressQuestions = Math.floor(
        ((Number(newIndex) + 1) / Number(totalQuestions)) * 100,
    );
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                handleNext();
            }

            if (e.key === "ArrowLeft") {
                handlePrevious();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [newIndex, totalQuestions]);
    const errorShow = Object.keys(errors)
        .filter((key) => key.startsWith("questions."))
        .map((key) => key.split(".")[1]);
    const errorSet = new Set(errorShow.map(Number));
    const handleNext = () => {
        if (!(totalQuestions <= newIndex + 1)) setQuestionCurrent(++newIndex);
    };
    const handlePrevious = () => {
        if (!(newIndex - 1 < 0)) setQuestionCurrent(--newIndex);
    };
    return (
        <>
            {currentQuestion && (
                <>
                    <div
                        key={questionCurrent}
                        className="border-3 border-dashed dash rounded-xl p-4 space-y-4 animate-in fade-in-5 slide-in-from-right-30 duration-700"
                    >
                        <p className="text-mute">
                            Questions: ({newIndex + 1} of {totalQuestions})
                        </p>
                        <Progress value={progressQuestions} />

                        <ExamQuestions
                            question={currentQuestion}
                            questionIndex={questionCurrent}
                            updateQuestion={updateQuestion}
                            errors={errors}
                        />

                        <RadioGroup
                            value={currentQuestion.answers
                                .findIndex((a) => a.is_correct)
                                .toString()}
                            onValueChange={(value) =>
                                toggleCorrect(questionCurrent, Number(value))
                            }
                            className="space-y-2"
                        >
                            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                                {currentQuestion.answers.map(
                                    (answer, answerIndex) => (
                                        <ExamAnswers
                                            key={answerIndex}
                                            questionIndex={questionCurrent}
                                            answer={answer}
                                            answerIndex={answerIndex}
                                            updateAnswer={updateAnswer}
                                            removeAnswer={removeAnswer}
                                            errors={errors}
                                        />
                                    ),
                                )}
                            </div>
                        </RadioGroup>
                        {errors[`questions.${questionCurrent}.answers`] && (
                            <p className="text-destructive text-sm">
                                {errors[`questions.${questionCurrent}.answers`]}
                            </p>
                        )}
                        <div className="flex justify-between">
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => removeQuestion(questionCurrent)}
                            >
                                - Delete Question
                            </Button>
                            <Button
                                type="button"
                                onClick={() => addAnswer(questionCurrent)}
                            >
                                + Add Answer
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                onClick={() => handlePrevious()}
                                disabled={!!(newIndex - 1 < 0)}
                            >
                                Previous
                            </Button>
                            <Button
                                type="button"
                                onClick={() => handleNext()}
                                disabled={!!(totalQuestions <= newIndex + 1)}
                            >
                                Next
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {Array.from({ length: totalQuestions }, (_, i) => {
                                const hasError = errorSet.has(i);
                                return (
                                    <Button
                                        type="button"
                                        key={i}
                                        onClick={() => setQuestionCurrent(i)}
                                        className={cn(
                                            "w-8 h-8 p-2 rounded-full text-foreground bg-background",
                                            newIndex === i &&
                                                "border-4 border-primary",
                                            newIndex !== i &&
                                                hasError &&
                                                "border-4 border-destructive animate-pulse",
                                        )}
                                    >
                                        {i + 1}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
export { ExamFormQuestions };
