import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import ExamQuestions from "./exam-questions";
import { RadioGroup } from "@/components/ui/radio-group";
import ExamAnswers from "./exam-answers";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ExamFormQuestionsProps {
    backSelf:any
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
    backSelf,
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
    const [multiChosen, setMultiChosen] = useState(
        data.questions[questionCurrent]?.multiple || false,
    );
    let newIndex = questionCurrent;
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
    const errorShow = Object.keys(errors).filter((key) => key.startsWith("questions.")).map((key) => key.split(".")[1]);
    const errorSet = new Set(errorShow.map(Number));
    
    const handleNext = () => {
        if (!(totalQuestions <= newIndex + 1)) setQuestionCurrent(++newIndex);
    };
    const handlePrevious = () => {
        if (!(newIndex - 1 < 0)) setQuestionCurrent(--newIndex);
    };
    const handleRemoveQuestion = (i: number) => {
        removeQuestion(i);

        setQuestionCurrent((prev) => {
            const nextLength = data.questions.length - 1;

            if (nextLength <= 0) return 0;
            if (prev > nextLength - 1) return nextLength - 1;
            if (i < prev) return prev - 1;

            return prev;
        });
    };
    useEffect(() => {
        if (questionCurrent >= data.questions.length) {
            setQuestionCurrent(Math.max(0, data.questions.length - 1));
        }
        if(data.questions.length == 0){
            backSelf(0)
        }
    }, [data.questions.length]);
    if (!currentQuestion) return null;
    return (
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
                multiChosen={multiChosen}
                setMultiChosen={setMultiChosen}
            />

            <RadioGroup
                value={currentQuestion.answers
                    .findIndex((a: any) => a.is_correct)
                    .toString()}
                onValueChange={(value) =>
                    toggleCorrect(questionCurrent, Number(value))
                }
                className="space-y-2"
            >
                <div className="grid grid-cols-1">
                    {currentQuestion.answers.map(
                        (answer: any, answerIndex: number) => (
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
                        ),
                    )}
                    <Button
                        type="button"
                        onClick={() => addAnswer(questionCurrent)}
                    >
                        + Add Answer
                    </Button>
                </div>
            </RadioGroup>
            {errors[`questions.${questionCurrent}.answers`] && (
                <p className="text-destructive text-sm">
                    {errors[`questions.${questionCurrent}.answers`]}
                </p>
            )}

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
                                "relative",
                                "w-8 h-8 p-2 rounded-full text-foreground bg-background",
                                newIndex === i && "border-4 border-primary",
                                newIndex !== i &&
                                    hasError &&
                                    "border-4 border-destructive animate-pulse",
                            )}
                        >
                            {i + 1}
                            <Button
                                asChild
                                type="button"
                                onClick={() => handleRemoveQuestion(i)}
                                className="absolute -top-3 -right-3 cursor-pointer bg-destructive text-foreground rounded-full w-5 h-5 flex items-center justify-center"
                            >
                                <div>
                                    <X />
                                </div>
                            </Button>
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
export { ExamFormQuestions };
