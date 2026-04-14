import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageCustom from "@/components/utils/file-custom";
import ImagePreview from "@/components/utils/image-preview";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
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
    const removeImage = () => {
        updateQuestion(questionIndex, "image", null);
    };
    return (
        <div className="flex flex-col gap-2">
            {/* Question Text */}
            <div className="flex flex-col gap-2">
                <Label>Question</Label>
                <ButtonGroup className="w-full flex items-center justify-between gap-2">
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

                    <ImageCustom
                        name={`questions.${questionIndex}.image`}
                        id={`question-image-${questionIndex}`}
                        action={(e) => {
                            const file = e.target.files?.[0] || null;
                            updateQuestion(questionIndex, "image", file);
                        }}
                    />
                </ButtonGroup>
                {question.image && (
                    <ImagePreview image={question.image} className="relative">
                        {question.image && (
                            <Button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 bg-destructive text-foreground rounded-full w-5 h-5 flex items-center justify-center"
                            >
                                <X />
                            </Button>
                        )}
                    </ImagePreview>
                )}
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
