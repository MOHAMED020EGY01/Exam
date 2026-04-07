import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React from "react";
interface Props {
    data:any
    errors: any;
    setData: any;
}
function ExamData({  errors , data , setData }: Props) {
    return (
        <div className="space-y-3">
            {/* 🔹 Name */}
            <div className="space-y-3">
                <Label>Exam Name</Label>
                <Input
                    value={data.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setData("name", e.target.value)
                    }
                    className={cn(errors.name && "border-red-400")}
                />
                {errors.name && (
                    <p className="text-red-400 text-sm">{errors.name}</p>
                )}
            </div>

            {/* 🔹 Description */}
            <div className="space-y-3">
                <Label>Description</Label>
                <Input
                    value={data.description}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setData("description", e.target.value)
                    }
                    className={cn(errors.description && "border-red-400")}
                />
                {errors.description && (
                    <p className="text-red-400 text-sm">{errors.description}</p>
                )}
            </div>
        </div>
    );
}

export default ExamData;
