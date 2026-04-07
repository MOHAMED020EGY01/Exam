import { DashboardLayout } from "@/components/layout/dashboard";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import { Answer, Questions, Question } from "@/components/class/question";
import { CheckboxInvalid } from "@/components/utils/checkbox-demo";
import { RadioGroupDemo } from "@/components/utils/radio";
import { ExamFormQuestions } from "@/components/page-componets/exam-components";
import ExamData from "@/components/page-componets/exam-form-questions/exam-data";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
/* ================= TYPES ================= */

type FormData = {
    name: string;
    description: string;
    questions: Question[];
};

/* ================= COMPONENT ================= */
interface Props {
    course: any;
}
function Create({ course }: Props) {
    const { data, setData, post, processing, resetAndClearErrors, errors } =
        useForm<FormData>({
            name: "",
            description: "",
            questions: [],
        });
    console.log(errors);
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
            },
        });
    };
    /* ================= UI ================= */

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Create Exam</CardTitle>
                <CardDescription>
                    Create a new exam for this course {course.name}
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
                <CardContent>
                    <ExamData data={data} errors={errors} setData={setData} />
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
                </CardContent>

                <CardFooter>
                    <Button type="submit" disabled={processing}>
                        Create Exam
                    </Button>
                    <Button type="button" onClick={addQuestion}>
                        Add Questions +
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

/* ================= LAYOUT ================= */

Create.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);

export default Create;
