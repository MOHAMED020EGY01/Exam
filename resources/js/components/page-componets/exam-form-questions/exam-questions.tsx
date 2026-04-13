import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
interface Props {
    question: any;
    questionIndex: number;
    updateQuestion: any;
    errors: any;
    multiChosen: boolean;
    setMultiChosen: (chosen: boolean) => void;
}
function ExamQuestions({
    question,
    questionIndex,
    updateQuestion,
    errors,
    multiChosen,
    setMultiChosen,
}: Props) {
    return (
        <div className="flex flex-col gap-2">
            {/* Question Text */}
            <div className="flex flex-col gap-2">
                <Label>Question</Label>
                <ButtonGroup className="w-full ">
                    <Input
                        value={question.text}
                        placeholder="Question ... ?"
                        onChange={(e) =>
                            updateQuestion(
                                questionIndex,
                                "text",
                                e.target.value,
                            )
                        }
                        className={cn(
                            errors[`questions.${questionIndex}.text`] &&
                                "border-destructive",
                        )}
                    />
                    <Button>
                        <input
                            type="file"
                            name={`questions.${questionIndex}.image`}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                updateQuestion(
                                    questionIndex,
                                    "image",
                                    file,
                                );
                            }}
                        />
                    </Button>
                </ButtonGroup>
                {errors[`questions.${questionIndex}.text`] && (
                    <p className="text-destructive text-sm">
                        {errors[`questions.${questionIndex}.text`]}
                    </p>
                )}
                {errors[`questions.${questionIndex}.image`] && (
                    <p className="text-destructive text-sm">
                        {errors[`questions.${questionIndex}.image`]}
                    </p>
                )}
            </div>

            {/* Multiple */}
            <label className="flex items-center gap-2">
                <Checkbox
                    checked={question.multiple}
                    onCheckedChange={(e: boolean) => {
                        setMultiChosen(!multiChosen);
                        updateQuestion(questionIndex, "multiple", e);
                    }}
                />
                Multiple Choice
            </label>
        </div>
    );
}

export default ExamQuestions;
