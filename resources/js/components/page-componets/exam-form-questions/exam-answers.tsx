import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { RadioGroupDemo } from "@/components/utils/radio";
import { cn } from "@/lib/utils";
import React from "react";
interface Props {
    questionIndex: number;
    answer: any;
    answerIndex: any;
    updateAnswer: any;
    removeAnswer: any;
    errors: any;
}
function ExamAnswers({
    questionIndex,
    answer,
    answerIndex,
    updateAnswer,
    removeAnswer,
    errors,
}: Props) {
    return (
        <div>
            <div key={answerIndex} className="flex gap-2 items-center">
                <div>
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
                            ] && "border-red-400",
                        )}
                    />
                    {errors[
                        `questions.${questionIndex}.answers.${answerIndex}.text`
                    ] && (
                        <p className="text-red-400 text-sm">
                            {
                                errors[
                                    `questions.${questionIndex}.answers.${answerIndex}.text`
                                ]
                            }
                        </p>
                    )}
                </div>

                {/* is_correct */}
                <div>
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value={`${answerIndex}`} id={`option-${answerIndex}`} />
                        <Label htmlFor={`option-${answerIndex}`}>Option One</Label>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeAnswer(questionIndex, answerIndex)}
                >
                    X
                </Button>
            </div>
        </div>
    );
}

export default ExamAnswers;
