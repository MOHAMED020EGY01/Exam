import { Button } from "@/components/ui/button";
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
                    <div className="flex justify-center items-center gap-1">

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
                    {/* is_correct */}
                    <div className="flex justify-center items-center">
                        <RadioGroupItem value={`${answerIndex}`} id={`option-${answerIndex}`} />
                        <Button
                            type="button"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => removeAnswer(questionIndex, answerIndex)}>
                            <Trash />
                        </Button>
                    </div>
                    </div>
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


            </div>
        </div>
    );
}

export default ExamAnswers;
