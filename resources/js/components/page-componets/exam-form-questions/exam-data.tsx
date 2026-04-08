import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React from "react";
import { Textarea } from "@/components/ui/textarea"

interface Props {
    data:any
    errors: any;
    setData: any;
}
function ExamData({  errors , data , setData }: Props) {
    return (
        <div className="space-y-3 animate-in fade-in-5 slide-in-from-right-30 duration-700">
            {/* 🔹 Name */}
            <div className="space-y-3">
                <Label>Exam Name</Label>
                <Input
                    value={data.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setData("name", e.target.value)
                    }
                    className={cn(errors.name && "border-destructive")}
                />
                {errors.name && (
                    <p className="text-destructive text-sm">{errors.name}</p>
                )}
            </div>

            {/* 🔹 Description */}
            <div className="space-y-3">
                <Label>Description</Label>
                <Textarea
                    value={data.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setData("description", e.target.value)
                    }
                    className={cn(errors.description && "border-destructive")}
                />
                {errors.description && (
                    <p className="text-destructive text-sm">{errors.description}</p>
                )}
            </div>
        </div>
    );
}

export default ExamData;
