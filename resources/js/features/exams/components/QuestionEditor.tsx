/**
 * QuestionEditor.tsx
 *
 * Purpose:
 * Renders the question editing area: prompt and choice-mode.
 *
 * Responsibilities:
 * - Render question prompt text input
 * - Render file upload selector for question image attachment
 * - Toggle answer selection mode (single vs multiple choice)
 *
 * Dependencies:
 * - FileCustom and ImagePreview components (Common)
 * - Input/Label components (Shadcn UI)
 *
 * Notes:
 * - Type-safe: Uses Question type
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageCustom from "@/components/common/FileCustom";
import ImagePreview from "@/components/common/ImagePreview";
import { cn } from "@/lib/utils";
import { X, HelpCircle, Layers, CheckSquare, List } from "lucide-react";
import type { Question } from "@/types";

interface QuestionEditorProps {
    question: Question;
    questionIndex: number;
    updateQuestion: <K extends keyof Question>(
        questionIndex: number,
        key: K,
        value: Question[K],
    ) => void;
    errors: Record<string, string>;
    multiChosen: boolean;
    setMultiChosen: (chosen: boolean) => void;
}

export function QuestionEditor({
    question,
    questionIndex,
    updateQuestion,
    errors,
    multiChosen,
    setMultiChosen,
}: QuestionEditorProps) {
    const removeImage = () => {
        updateQuestion(questionIndex, "image", null);
    };

    return (
        <div className="space-y-6 animate-in fade-in-10 duration-200">
            {/* Question Text */}
            <div className="space-y-2">
                <Label
                    htmlFor={`question-text-${questionIndex}`}
                    className="text-sm font-semibold flex items-center gap-1.5 text-foreground"
                >
                    <HelpCircle className="icon-sm text-primary" />
                    Question Prompt
                </Label>
                <div
                    className={cn(
                        "flex items-stretch rounded-lg border border-input shadow-xs focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all overflow-hidden bg-background",
                        errors[`questions.${questionIndex}.text`] &&
                            "border-destructive focus-within:ring-destructive/20 focus-within:border-destructive",
                    )}
                >
                    <input
                        id={`question-text-${questionIndex}`}
                        value={question?.text || ""}
                        placeholder="Type your question prompt here... (e.g. What is the capital of France?)"
                        onChange={(e) =>
                            updateQuestion(
                                questionIndex,
                                "text",
                                e.target.value,
                            )
                        }
                        className="flex-1 px-3 py-2.5 bg-transparent border-0 outline-none placeholder:text-muted-foreground text-sm"
                    />

                    <div className="flex items-center px-3 border-l bg-muted/20 hover:bg-muted/40 transition-colors shrink-0">
                        <ImageCustom
                            name={`questions.${questionIndex}.image`}
                            id={`question-image-${questionIndex}`}
                            action={(e) => {
                                const file = e.target.files?.[0] || null;
                                updateQuestion(questionIndex, "image", file);
                            }}
                        />
                    </div>
                </div>

                {question?.image && (
                    <div className="mt-3 relative inline-block">
                        <ImagePreview
                            image={question.image}
                            className="size-32 object-contain rounded-lg border border-dashed p-1"
                        />
                        <Button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full icon-md p-0 flex items-center justify-center shadow-md"
                        >
                            <X className="icon-sm" />
                        </Button>
                    </div>
                )}

                {errors[`questions.${questionIndex}.text`] && (
                    <p className="text-destructive text-xs font-medium mt-1">
                        {errors[`questions.${questionIndex}.text`]}
                    </p>
                )}
                {errors[`questions.${questionIndex}.image`] && (
                    <p className="text-destructive text-xs font-medium mt-1">
                        {errors[`questions.${questionIndex}.image`]}
                    </p>
                )}
            </div>

            {/* Selection Mode Switcher */}
            <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="icon-sm" />
                    Answer Selection Mode
                </Label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            setMultiChosen(false);
                            updateQuestion(questionIndex, "multiple", false);
                        }}
                        className={cn(
                            "flex items-center justify-center gap-2 py-2.5 px-4 border rounded-lg text-sm transition-all font-medium",
                            !question?.multiple
                                ? "bg-primary/5 border-primary text-primary shadow-xs"
                                : "bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-muted/30",
                        )}
                    >
                        <List className="icon-sm shrink-0" />
                        Single Choice (Radio)
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setMultiChosen(true);
                            updateQuestion(questionIndex, "multiple", true);
                        }}
                        className={cn(
                            "flex items-center justify-center gap-2 py-2.5 px-4 border rounded-lg text-sm transition-all font-medium",
                            question?.multiple
                                ? "bg-primary/5 border-primary text-primary shadow-xs"
                                : "bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-muted/30",
                        )}
                    >
                        <CheckSquare className="icon-sm shrink-0" />
                        Multiple Choice (Checkbox)
                    </button>
                </div>
            </div>
        </div>
    );
}
