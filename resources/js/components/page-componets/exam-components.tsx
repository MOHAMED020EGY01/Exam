import { Book, EllipsisVertical } from "lucide-react";
import { Badge } from "../ui/badge";
import { CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { DropdownMenuDestructive } from "../utils/dropdown-menu";
import { Button } from "../ui/button";
import ExamQuestions from "./exam-form-questions/exam-questions";
import ExamAnswers from "./exam-form-questions/exam-answers";
import { RadioGroup } from "../ui/radio-group";
import { useState } from "react";
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils";

function ExamCard({ exam, items }: { exam: any; items: any }) {
    return (
        <div>
            <CardHeader>
                {/* Title */}
                <CardTitle
                    className="text-xl font-bold text-foreground leading-tight
                tracking-tight group-hover:text-primary transition-colors
                flex justify-between"
                >
                    <div>{exam.name}</div>
                    <div>
                        <DropdownMenuDestructive
                            items={items}
                            target={
                                <Button variant={"ghost"}>
                                    <EllipsisVertical />
                                </Button>
                            }
                        />
                    </div>
                </CardTitle>

                {/* Description */}
                <CardDescription className="text-base text-muted-foreground leading-relaxed line-clamp-2">
                    {exam.description}
                </CardDescription>
            </CardHeader>

            {/* Divider */}
            <div className="h-px bg-border/60" />

            {/* Stats */}
            <CardFooter className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg">
                    <Book className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">
                        Questions:
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                        {exam.exam_count}
                    </span>
                </div>
                <div className="text-xs text-muted-foreground">
                    <Badge variant="secondary">{exam.diff_for_humans}</Badge>
                </div>
            </CardFooter>
        </div>
    );
}

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
    const progressQuestions = Math.floor((Number(newIndex) + 1) / Number(totalQuestions) * 100);
    const handleNext = () => {
        if (!(totalQuestions <= newIndex + 1))
            setQuestionCurrent(++newIndex);
    }
    const handlePrevious = () => {
        if (!(newIndex - 1 < 0))
            setQuestionCurrent(--newIndex);
    }
    return (
        <>
            {currentQuestion &&
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
                            <div className="grid grid-cols-2 gap-4">

                                {currentQuestion.answers.map((answer, answerIndex) => (
                                    <ExamAnswers
                                        key={answerIndex}
                                        questionIndex={questionCurrent}
                                        answer={answer}
                                        answerIndex={answerIndex}
                                        updateAnswer={updateAnswer}
                                        removeAnswer={removeAnswer}
                                        errors={errors}
                                    />
                                ))}
                            </div>
                        </RadioGroup>
                        {errors[`questions.${questionCurrent}.answers`] && (
                            <p className="text-red-400 text-sm">
                                {errors[`questions.${questionCurrent}.answers`]}
                            </p>
                        )}
                        <div className="flex justify-between">
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => removeQuestion(questionCurrent)}>
                                - Delete Question
                            </Button>
                            <Button
                                type="button"
                                onClick={() => addAnswer(questionCurrent)} >
                                + Add Answer
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                onClick={() => handlePrevious()}
                                disabled={!!(newIndex - 1 < 0)}>
                                Previous
                            </Button>
                            <Button
                                type="button"
                                onClick={() => handleNext()}
                                disabled={!!(totalQuestions <= newIndex + 1)}>
                                Next
                            </Button>

                        </div>
                        <div className="flex flex-wrap gap-2">
                            {
                                Array.from({ length: totalQuestions }, (_, i) => (
                                    <Button
                                        type="button"
                                        key={i}
                                        onClick={() => setQuestionCurrent(i)}
                                        className={cn("w-8 h-8 p-2 rounded-full", newIndex == i ? "bg-accent-foreground" : "bg-accent")}>
                                        {i + 1}
                                    </Button>
                                ))
                            }
                        </div>
                    </div>
                </>
            }
        </>
    );
}
export { ExamCard, ExamFormQuestions };
