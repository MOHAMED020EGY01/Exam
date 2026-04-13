import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
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
    return (
        <div>
            <div key={answerIndex} className="flex gap-2 items-center">
                <div>
                    <div className="flex justify-center items-center gap-1">
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
                            <Button
                                type="button"
                                variant="outline"
                                className="text-destructive hover:text-destructive"
                                onClick={() =>
                                    removeAnswer(questionIndex, answerIndex)
                                }
                            >
                                <Trash />
                            </Button>
                        </ButtonGroup>
                    </div>
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
        </div>
    );
}

export default ExamAnswers;
