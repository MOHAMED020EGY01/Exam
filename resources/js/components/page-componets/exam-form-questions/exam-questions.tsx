import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
interface Props {
    question: any;
    questionIndex: number;
    updateQuestion: any;
    errors: any;
}
function ExamQuestions({ question, questionIndex, updateQuestion, errors }: Props) {
    return (
        <div className="flex flex-col gap-2">
            {/* Question Text */}
            <div className="flex flex-col gap-2">
                <Label>Question</Label>
                <Input
                    value={question.text}
                    placeholder="Question ... ?"
                    onChange={(e) =>
                        updateQuestion(questionIndex, "text", e.target.value)
                    }
                    className={cn(
                        errors[`questions.${questionIndex}.text`] &&
                            "border-destructive",
                    )}
                />
                {errors[`questions.${questionIndex}.text`] && (
                    <p className="text-destructive text-sm">
                        {errors[`questions.${questionIndex}.text`]}
                    </p>
                )}
            </div>

            {/* Multiple */}
            <label className="flex items-center gap-2">
                <Checkbox
                    checked={question.multiple}
                    onCheckedChange={(e: boolean) =>
                        updateQuestion(
                            questionIndex,
                            "multiple",
                            e,
                        )
                    }
                />
                Multiple Choice
            </label>
        </div>
    );
}

export default ExamQuestions;
