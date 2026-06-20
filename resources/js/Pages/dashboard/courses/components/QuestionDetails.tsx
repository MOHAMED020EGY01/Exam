/**
 * QuestionDetails.tsx
 *
 * Purpose:
 * Renders the question details panel on the right side of the split pane.
 *
 * Responsibilities:
 * - Display question prompt text and single vs multiple choice badge
 * - Render question image attachment (if any)
 * - Render choices list and mark correct answers dynamically
 *
 * Dependencies:
 * - Card and CardContent components (Shadcn UI)
 * - Lucide icons (HelpCircle, CheckCircle2, XCircle)
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, CheckCircle2, XCircle } from "lucide-react";
import { TreeNodeData } from "@/lib/treeHelpers";

interface QuestionDetailsProps {
  selectedNode: TreeNodeData;
  selectedNodeAnswers: any[];
}

export const QuestionDetails: React.FC<QuestionDetailsProps> = ({
  selectedNode,
  selectedNodeAnswers,
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-muted/10 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-500" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Question {(selectedNode.originalId as number) + 1}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {selectedNode.originalData?.multiple ? "Multiple Choice" : "Single Choice"}
            </span>
          </div>
          <CardTitle className="text-xl font-bold mt-2 leading-relaxed">
            {selectedNode.label}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Question Image (if any) */}
        {selectedNode.originalData?.image && (
          <div className="border rounded-lg overflow-hidden bg-muted/5 p-2 flex justify-center max-w-lg mx-auto">
            <img 
              src={selectedNode.originalData.image} 
              alt="Question Context"
              className="max-h-60 object-contain rounded-md"
            />
          </div>
        )}

        {/* Answer Options */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground">Options:</h4>
          <div className="flex flex-col gap-3">
            {selectedNodeAnswers.map((answer: any, index: number) => (
              <div 
                key={index} 
                className={`flex items-start gap-3 p-3 border rounded-lg transition-colors ${
                  answer?.is_correct 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-300" 
                    : "bg-background border-border text-foreground"
                }`}
              >
                {answer?.is_correct ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-muted-foreground/30 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium leading-relaxed">{answer?.text || "No option text"}</p>
                  {answer?.image && (
                    <div className="border rounded bg-muted/5 p-1 max-w-xs">
                      <img src={answer.image} alt="Option Visual" className="max-h-32 object-contain" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
