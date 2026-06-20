/**
 * Modal.tsx
 *
 * Purpose:
 * Renders a dialog/modal containing a dynamic form.
 *
 * Responsibilities:
 * - Handle dialog open/close state
 * - Render dynamic fields based on field definition configurations
 * - Handle dynamic form submissions and validations with Inertia useForm
 *
 * Dependencies:
 * - Dialog components (Shadcn UI)
 * - Input/Textarea components (Shadcn UI)
 * - useForm hook (Inertia)
 */

import React from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
import { ModalInterface } from "@/interface/modal-interface";
import { Textarea } from "@/components/ui/textarea";
import {
    Book,
    GraduationCap,
    AlertCircle,
    Trash2,
    HelpCircle,
} from "lucide-react";

const ModalDynamic = <T extends Record<string, any>>({
    open,
    setOpen,
    inputForm,
    url,
    method,
    title,
    description,
    dataForm,
}: ModalInterface<T>) => {
    const inputFormSlice = inputForm?.reduce(
        (acc, key) => {
            acc[key.field] = dataForm?.[key.field] ?? "";
            return acc;
        },
        {} as Record<string, any>,
    );

    const {
        data,
        setData,
        processing,
        submit,
        errors,
        resetAndClearErrors,
        reset,
    } = useForm({
        ...inputFormSlice,
    });

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        submit(method, url, {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    const close = () => {
        resetAndClearErrors();
        setOpen(false);
    };

    const isDelete = method.toLowerCase() === "delete";
    const isEdit = method.toLowerCase() === "put";
    const isCreate = method.toLowerCase() === "post";

    // Beautiful dynamic title icon based on type and action
    const renderTitleIcon = () => {
        if (isDelete) {
            return <Trash2 className="w-5 h-5 text-destructive shrink-0" />;
        }
        if (title.toLowerCase().includes("course")) {
            return <Book className="w-5 h-5 icon-indigo shrink-0" />;
        }
        if (title.toLowerCase().includes("exam")) {
            return (
                <GraduationCap className="w-5 h-5 icon-amber shrink-0" />
            );
        }
        return <HelpCircle className="w-5 h-5 text-primary shrink-0" />;
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                showCloseButton={true}
                className="sm:max-w-md p-0 overflow-hidden rounded-2xl border bg-background shadow-2xl animate-in duration-200"
            >
                {/* Visual Top Decorative Gradient Line */}
                <div
                    className={cn(
                        "h-1.5 w-full shrink-0",
                        isDelete
                            ? "bg-destructive"
                            : "bg-gradient-to-r from-indigo-500 via-primary to-emerald-500",
                    )}
                />

                <form onSubmit={handleSubmit} className="flex flex-col">
                    {/* Header Area */}
                    <div className="px-6 pt-5 pb-4 border-b border-border select-none">
                        <DialogHeader className="gap-1">
                            <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                                {renderTitleIcon()}
                                {title}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                {description}
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    {/* Form Fields Area */}
                    {inputForm && inputForm.length > 0 && (
                        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
                            <FieldGroup className="space-y-4">
                                {inputForm.map((item, index) => {
                                    const hasError = !!errors[item.field];
                                    const fieldLabel =
                                        item.field.charAt(0).toUpperCase() +
                                        item.field.slice(1).replace(/_/g, " ");
                                    const isDescriptionField =
                                        item.field.toLowerCase() ===
                                        "description";

                                    return (
                                        <Field
                                            key={index}
                                            className="space-y-1.5 flex flex-col"
                                        >
                                            <Label
                                                htmlFor={item.field}
                                                className="text-xs uppercase font-bold tracking-wider text-muted-foreground/80 select-none"
                                            >
                                                {fieldLabel}
                                            </Label>

                                            {isDescriptionField ? (
                                                <Textarea
                                                    id={item.field}
                                                    name={item.field}
                                                    value={data[item.field]}
                                                    placeholder={`Enter ${item.field.toLowerCase()}...`}
                                                    rows={4}
                                                    onChange={(e) => {
                                                        setData(
                                                            item.field,
                                                            e.target.value,
                                                        );
                                                    }}
                                                    className={cn(
                                                        "min-h-[100px] resize-y transition-all focus-visible:ring-primary focus-visible:ring-2",
                                                        hasError &&
                                                            "border-destructive focus-visible:ring-destructive focus-visible:ring-2",
                                                    )}
                                                />
                                            ) : (
                                                <Input
                                                    id={item.field}
                                                    name={item.field}
                                                    value={data[item.field]}
                                                    placeholder={`Enter ${item.field.toLowerCase()}...`}
                                                    onChange={(e) => {
                                                        setData(
                                                            item.field,
                                                            e.target.value,
                                                        );
                                                    }}
                                                    className={cn(
                                                        "h-10 transition-all focus-visible:ring-primary focus-visible:ring-2",
                                                        hasError &&
                                                            "border-destructive focus-visible:ring-destructive focus-visible:ring-2",
                                                    )}
                                                />
                                            )}

                                            {hasError && (
                                                <p className="text-destructive text-xs font-semibold mt-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-150 select-none">
                                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                    {errors[item.field]}
                                                </p>
                                            )}
                                        </Field>
                                    );
                                })}
                            </FieldGroup>
                        </div>
                    )}

                    {/* Footer Area */}
                    <div className="px-6 py-4 bg-muted/20 border-t flex justify-end gap-3 select-none">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={close}
                                disabled={processing}
                                className="h-9 font-semibold text-xs transition-all hover:bg-muted"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={processing}
                            variant={isDelete ? "destructive" : "default"}
                            className={cn(
                                "h-9 font-semibold text-xs min-w-[90px] transition-all flex items-center gap-1.5 shadow-sm",
                                isDelete
                                    ? "hover:bg-destructive/95"
                                    : "hover:bg-primary/95",
                            )}
                        >
                            {processing ? (
                                <>
                                    <Spinner className="w-3.5 h-3.5 animate-spin" />
                                    {isDelete ? "Deleting..." : "Saving..."}
                                </>
                            ) : isDelete ? (
                                "Delete"
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export { ModalDynamic };
