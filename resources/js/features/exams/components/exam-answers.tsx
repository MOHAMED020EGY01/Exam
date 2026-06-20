/**
 * exam-answers.tsx
 *
 * Purpose:
 * Renders a single answer option input inside the question editor.
 *
 * Responsibilities:
 * - Render selection control (Radio button for single, Checkbox for multi-choice)
 * - Render answer choice text input
 * - Render action triggers (image attachment, delete option)
 *
 * Dependencies:
 * - FileCustom and ImagePreview components (Common)
 * - RadioGroupItem and Checkbox components (Shadcn UI)
 */

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroupItem } from "@/components/ui/radio-group";
import ImageCustom from "@/components/common/FileCustom";
import ImagePreview from "@/components/common/ImagePreview";
import { cn } from "@/lib/utils";
import { Trash, X } from "lucide-react";

interface Props {
    questionIndex: number;
    answer: any;
    answerIndex: number;
    updateAnswer: any;
    removeAnswer: any;
    errors: any;
    multiChosen: boolean;
}

function ExamAnswers({
    questionIndex,
    answer,
    answerIndex,
    updateAnswer,
    removeAnswer,
    errors,
    multiChosen,
}: Props) {
    const removeImage = () => {
        updateAnswer(questionIndex, answerIndex, "image", null);
    };

    const letter = String.fromCharCode(65 + answerIndex);

    return (
        <div className={cn(
            "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 rounded-lg border bg-card transition-all",
            answer.is_correct 
                ? "answer-correct-card" 
                : "border-border hover:border-muted-foreground/30"
        )}>
            {/* Left Selection Controls */}
            <div className="flex items-center gap-3 shrink-0 select-none">
                <span className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold border transition-all duration-200",
                    answer.is_correct
                        ? "answer-correct-badge shadow-xs"
                        : "answer-default-badge"
                )}>
                    {letter}
                </span>

                <div className="flex items-center justify-center w-5 h-5 shrink-0">
                    {!multiChosen ? (
                        <RadioGroupItem
                            value={`${answerIndex}`}
                            id={`option-${questionIndex}-${answerIndex}`}
                            className="w-4 h-4 text-emerald-500 focus-visible:ring-emerald-500 focus:ring-emerald-500 focus-within:ring-emerald-500"
                        />
                    ) : (
                        <Checkbox
                            checked={answer.is_correct}
                            onCheckedChange={(e: boolean) =>
                                updateAnswer(
                                    questionIndex,
                                    answerIndex,
                                    "is_correct",
                                    e,
                                )
                            }
                            id={`option-${questionIndex}-${answerIndex}`}
                            className="w-4 h-4 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 focus-visible:ring-emerald-500"
                        />
                    )}
                </div>
            </div>

            {/* Middle Option Text Input */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <input
                    placeholder={`Option ${letter}...`}
                    value={answer?.text || ""}
                    onChange={(e) =>
                        updateAnswer(
                            questionIndex,
                            answerIndex,
                            "text",
                            e.target.value,
                        )
                    }
                    className={cn(
                        "w-full bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground font-medium p-0 focus:ring-0 focus:border-0",
                        errors[`questions.${questionIndex}.answers.${answerIndex}.text`] && "text-destructive"
                    )}
                />
                {errors[`questions.${questionIndex}.answers.${answerIndex}.text`] && (
                    <p className="text-destructive text-[11px] font-medium mt-1">
                        {errors[`questions.${questionIndex}.answers.${answerIndex}.text`]}
                    </p>
                )}
            </div>

            {/* Right Action Tools */}
            <div className="flex items-center justify-end gap-2.5 shrink-0 sm:border-l sm:pl-3 border-border">
                {/* Answer Image Preview */}
                {answer.image && (
                    <div className="relative shrink-0">
                        <ImagePreview image={answer.image} className="w-10 h-10 object-cover rounded-md border" />
                        <Button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full w-4 h-4 p-0 flex items-center justify-center shadow-xs"
                        >
                            <X className="w-2.5 h-2.5" />
                        </Button>
                    </div>
                )}

                {/* Upload Answer Image Icon */}
                <div className="p-1 hover:bg-muted rounded-md transition-colors cursor-pointer shrink-0">
                    <ImageCustom
                        name={`questions.${questionIndex}.answers.${answerIndex}.image`}
                        id={`answer-image-${questionIndex}-${answerIndex}`}
                        action={(e) => {
                            const file = e.target.files?.[0] || null;
                            updateAnswer(
                                questionIndex,
                                answerIndex,
                                "image",
                                file,
                            );
                        }}
                    />
                </div>

                {/* Delete Answer Option */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md w-7 h-7 shrink-0"
                    onClick={() => removeAnswer(questionIndex, answerIndex)}
                >
                    <Trash className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

export default ExamAnswers;
