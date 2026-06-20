/**
 * ExplorerEmptyState.tsx
 *
 * Purpose:
 * Renders the landing panel when no tree node is selected.
 *
 * Responsibilities:
 * - Render splash icon and welcome text
 * - Display button trigger to add/create a course
 *
 * Dependencies:
 * - Card and Button components (Shadcn UI)
 * - Book and Plus icons (lucide-react)
 */

import React from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Plus } from "lucide-react";

interface ExplorerEmptyStateProps {
  onAddCourse: () => void;
}

export const ExplorerEmptyState: React.FC<ExplorerEmptyStateProps> = ({
  onAddCourse,
}) => {
  return (
    <Card className="h-full border border-dashed flex flex-col items-center justify-center p-12 text-center bg-muted/10 min-h-[400px]">
      <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
        <Book className="w-8 h-8" />
      </div>
      <CardTitle className="text-xl">Explorer Details</CardTitle>
      <CardDescription className="max-w-sm mt-2 text-sm">
        Select any Course, Exam, or Question from the tree explorer on the left to view detailed metadata, answer choices, and actions.
      </CardDescription>
      <div className="flex gap-3 mt-6">
        <Button onClick={onAddCourse}>
          <Plus className="w-4 h-4 mr-2" />
          Create Course
        </Button>
      </div>
    </Card>
  );
};
