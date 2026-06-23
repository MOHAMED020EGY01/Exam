import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { QuestionService } from "../services/question.service";
import type {
    Answer,
    Question,
    CourseData,
    ExamsData,
    TypeMethodHTTP,
    QuestionsData,
} from "@/types";

type FormData = {
    name: string;
    description: string;
    questions: Question[];
};

// Convert QuestionsData (from backend) to Question (for form)
function convertQuestionsDataToFormQuestions(qd: QuestionsData[]): Question[] {
    return qd.map((q) => ({
        text: q.text,
        multiple: q.multiple,
        image: null, // Images are handled as File uploads in form, not strings from backend
        answers: q.answers.map((a) => ({
            text: a.text,
            is_correct: a.is_correct,
            image: null, // Same for answer images
        })),
    }));
}

interface UseExamEditorProps {
    exam?: ExamsData | null;
}

export function useExamEditor({ exam }: UseExamEditorProps = {}) {
    const [activeStep, setActiveStep] = useState(0);
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
    const [showErrors, setShowErrors] = useState(false);

    const { data, setData, processing, resetAndClearErrors, errors, submit } =
        useForm<FormData>({
            name: exam?.name ? exam.name : "",
            description: exam?.description ? exam.description : "",
            questions: exam?.questions_package
                ? convertQuestionsDataToFormQuestions(exam.questions_package)
                : [],
        });

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

    const reset = () => {
        resetAndClearErrors();
        setLocalErrors({});
        setActiveStep(0);
    };

    return {
        activeStep,
        setActiveStep,
        localErrors,
        setLocalErrors,
        showErrors,
        setShowErrors,
        allErrors,
        data,
        setData,
        processing,
        reset,
        submit,
        addQuestion,
        removeQuestion,
        addAnswer,
        removeAnswer,
        updateQuestion,
        updateAnswer,
        toggleCorrect,
    };
}
