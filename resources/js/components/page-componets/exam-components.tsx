import { Book, EllipsisVertical, Plus } from "lucide-react";
import { Badge } from "../ui/badge";
import {
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
import { Spinner } from "../ui/spinner";
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
                        {exam.questions_count}
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
    setOpen,
    label,
    exam = null,
    method = "post",
    url = "#",
}: {
    setOpen: (open: boolean) => void;
    label: string
    exam?: any;
    method?: any;
    url?: any;
}) {
    const [activeStep, setActiveStep] = useState(0);
    const { data, setData, submit, processing, resetAndClearErrors, errors } =
        useForm<FormData>({
            name: exam?.name ? exam.name : "",
            description: exam?.description ? exam.description : "",
            questions: exam?.questions_package ? exam.questions_package.map(({ image, ...rest }) => rest) : [],
        });
    console.log(data.questions);
    const questionsManager = useMemo(() => {
        return new Questions(data.questions.map(q => ({ ...q })));
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

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);

        data.questions.forEach((question, qi) => {
            formData.append(`questions[${qi}][text]`, question.text);
            formData.append(`questions[${qi}][multiple]`, question.multiple ? "1" : "0");
            if (question.image) {
                formData.append(`questions[${qi}][image]`, question.image);
            }

            question.answers.forEach((answer, ai) => {
                formData.append(`questions[${qi}][answers][${ai}][text]`, answer.text);
                formData.append(`questions[${qi}][answers][${ai}][is_correct]`, answer.is_correct ? "1" : "0");
                if (answer.image) {
                    formData.append(`questions[${qi}][answers][${ai}][image]`, answer.image);
                }
            });
        });

        submit("post", url, {
            onBefore: () => {
                console.log("Before",data.questions);
            },
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
                            Back to {label} exam data
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
                            {label} Questions
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
                        {label} Exam {processing && <Spinner />}
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
