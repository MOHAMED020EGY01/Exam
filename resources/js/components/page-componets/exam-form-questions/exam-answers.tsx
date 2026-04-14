import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroupItem } from "@/components/ui/radio-group";
import ImageCustom from "@/components/utils/file-custom";
import ImagePreview from "@/components/utils/image-preview";
import { cn } from "@/lib/utils";
import { Trash, X } from "lucide-react";
import { useState } from "react";
interface Props {
    questionIndex: number;
    answer: any;
    answerIndex: any;
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
    return (
        <div className="space-y-2 flex space-x-3">
            <div className="w-16 h-16">
                <ImagePreview image={answer.image} className="relative">
                    {answer.image && (
                        <Button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-destructive text-foreground rounded-full w-5 h-5 flex items-center justify-center"
                        >
                            <X/>
                        </Button>
                    )}
                </ImagePreview>
            </div>
            <div className="flex flex-col justify-center items-center">
                {/* is_correct */}
                <ButtonGroup>
                    <Input
                        placeholder="Answer"
                        value={answer.text}
                        onChange={(e) =>
                            updateAnswer(
                                questionIndex,
                                answerIndex,
                                "text",
                                e.target.value,
                            )
                        }
                        className={cn(
                            errors[
                                `questions.${questionIndex}.answers.${answerIndex}.text`
                            ] && "border-destructive",
                        )}
                    />
                    <Button asChild variant="outline" type="button">
                        {!multiChosen ? (
                            <div>
                                <RadioGroupItem
                                    value={`${answerIndex}`}
                                    id={`option-${answerIndex}`}
                                />
                            </div>
                        ) : (
                            <div>
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
                                    value={`${answerIndex}`}
                                    id={`option-${answerIndex}`}
                                />
                            </div>
                        )}
                    </Button>
                    <Button asChild variant="outline" type="button">
                        <div>
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
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeAnswer(questionIndex, answerIndex)}
                    >
                        <Trash />
                    </Button>
                </ButtonGroup>
                {errors[
                    `questions.${questionIndex}.answers.${answerIndex}.text`
                ] && (
                    <p className="text-destructive text-sm">
                        {
                            errors[
                                `questions.${questionIndex}.answers.${answerIndex}.text`
                            ]
                        }
                    </p>
                )}
            </div>
        </div>
    );
}

export default ExamAnswers;
