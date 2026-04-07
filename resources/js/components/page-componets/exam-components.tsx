import { Book, EllipsisVertical } from "lucide-react";
import { Badge } from "../ui/badge";
import { CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { DropdownMenuDestructive } from "../utils/dropdown-menu";
import { Button } from "../ui/button";
import ExamData from "./exam-form-questions/exam-data";
import ExamQuestions from "./exam-form-questions/exam-questions";
import ExamAnswers from "./exam-form-questions/exam-answers";
import { RadioGroup } from "../ui/radio-group";

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
    return (
        <>
            {/* 🔥 Questions */}
            {data.questions.map((question, questionIndex) => (
                <div
                    key={questionIndex}
                    className="border-3 border-dashed dash rounded-xl p-4 space-y-4"
                >
                    <ExamQuestions
                        question={question}
                        questionIndex={questionIndex}
                        updateQuestion={updateQuestion}
                        errors={errors}
                    />

                    <RadioGroup
                        value={question.answers
                            .findIndex((a) => a.is_correct)
                            .toString()}
                        onValueChange={(value) =>
                            toggleCorrect(questionIndex, Number(value))
                        }
                        className="space-y-2"
                    >
                        {question.answers.map((answer, answerIndex) => (
                            <ExamAnswers
                                questionIndex={questionIndex}
                                answer={answer}
                                answerIndex={answerIndex}
                                updateAnswer={updateAnswer}
                                removeAnswer={removeAnswer}
                                errors={errors}
                            />
                        ))}
                    </RadioGroup>
                    {errors[`questions.${questionIndex}.answers`] && (
                        <p className="text-red-400 text-sm">
                            {errors[`questions.${questionIndex}.answers`]}
                        </p>
                    )}
                    <Button
                        type="button"
                        onClick={() => addAnswer(questionIndex)}
                    >
                        + Add Answer
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeQuestion(questionIndex)}
                    >
                        - Delete Question
                    </Button>
                </div>
            ))}
        </>
    );
}
export { ExamCard, ExamFormQuestions };
