import { Book, EllipsisVertical, Plus } from "lucide-react";
import { Badge } from "../ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { DropdownMenuDestructive } from "../utils/dropdown-menu";
import { Button } from "../ui/button";
import { useMemo, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Answer, Question, Questions } from "../class/question";
import { ExamData } from "./exam-form-questions/exam-data";
import { ExamFormQuestions } from "./exam-form-questions/exam-questions-main";
type FormData = {
    name: string;
    description: string;
    questions: Question[];
};
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

function ExamModalFormQuestions({
    course,
    setOpen,
    exam =null,
}: {
    course: any;
    setOpen: (open: boolean) => void;
    exam?: any;
}) {
    const [activeStep, setActiveStep] = useState(0);
    const { data, setData, post, processing, resetAndClearErrors, errors } =
        useForm<FormData>({
            name: exam?.name ? exam.name : "",
            description: exam?.description ? exam.description : "",
            questions: exam?.questions_package ? exam.questions_package : [],
        });
        console.log(data.questions);
    const questionsManager = useMemo(() => {
        return new Questions(structuredClone(data.questions));
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
        post(route("exams.store", course.id), {
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

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4  ">
                <div className="flex justify-between">
                    {activeStep === 1 && (
                        <Button type="button" onClick={() => setActiveStep(0)}>
                            Back to edit exam data
                        </Button>
                    )}
                    {activeStep === 0 && (
                        <Button
                            type="button"
                            onClick={() => {
                                setActiveStep(1);
                                if (data.questions.length === 0) {
                                    addQuestion();
                                }
                            }}
                        >
                            Show Questions
                        </Button>
                    )}
                </div>
                <div className="space-y-4">
                    {activeStep === 0 ? (
                        <ExamData
                            data={data}
                            errors={errors}
                            setData={setData}
                        />
                    ) : (
                        <ExamFormQuestions
                            data={data}
                            errors={errors}
                            updateQuestion={updateQuestion}
                            updateAnswer={updateAnswer}
                            addQuestion={addQuestion}
                            removeQuestion={removeQuestion}
                            addAnswer={addAnswer}
                            removeAnswer={removeAnswer}
                            toggleCorrect={toggleCorrect}
                        />
                    )}
                </div>
            </div>
            <div className="flex justify-between">
                <div className="flex gap-2">
                    <Button type="submit" disabled={processing}>
                        Create Exam
                    </Button>
                    <Button
                        type="button"
                        variant={"destructive"}
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                </div>
                {data.questions.length !== 0 && activeStep === 1 && (
                    <Button
                        onClick={addQuestion}
                        type="button"
                        variant={"secondary"}
                    >
                        Add Questions <Plus />
                    </Button>
                )}
            </div>
        </form>
    );
}

export { ExamCard, ExamModalFormQuestions };
