import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React from "react";
interface Props {
    question: any;
    questionIndex: number;
    updateQuestion: any;
    errors: any;
}
function ExamQuestions({ question, questionIndex, updateQuestion, errors }: Props) {
    return (
        <div>
            {/* Question Text */}
            <div>
                <Label>Question</Label>
                <Input
                    value={question.text}
                    onChange={(e) =>
                        updateQuestion(questionIndex, "text", e.target.value)
                    }
                    className={cn(
                        errors[`questions.${questionIndex}.text`] &&
                            "border-red-400",
                    )}
                />
                {errors[`questions.${questionIndex}.text`] && (
                    <p className="text-red-400 text-sm">
                        {errors[`questions.${questionIndex}.text`]}
                    </p>
                )}
            </div>

            {/* Multiple */}
            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={question.multiple}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateQuestion(
                            questionIndex,
                            "multiple",
                            e.target.checked,
                        )
                    }
                />
                Multiple Choice
            </label>
        </div>
    );
}

export default ExamQuestions;
