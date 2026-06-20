/**
 * MoveModal.tsx
 *
 * Purpose:
 * Dialog modal window that allows users to select destination folders when moving exams/questions.
 *
 * Responsibilities:
 * - Render filtered options list of available destinations (Courses for exams, Exams for questions)
 * - Expose search box inside dialog to query destination titles
 * - Manage and confirm selection targets
 *
 * Dependencies:
 * - Dialog and Input components (Shadcn UI)
 * - Lucide icons
 */

import React, { useState, useMemo } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Book, FileText, ArrowRight, Move } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MoveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeToMove: any; // The tree node we want to move
  courses: any[];  // Full courses list from props
  onMoveConfirm: (destinationId: string | number) => void;
  processing?: boolean;
}

export const MoveModal: React.FC<MoveModalProps> = ({
  open,
  onOpenChange,
  nodeToMove,
  courses,
  onMoveConfirm,
  processing = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | number | null>(null);

  if (!nodeToMove) return null;

  const isExam = nodeToMove.type === 'exam';
  const isQuestion = nodeToMove.type === 'question';

  // 1. Get flat list of options based on type
  const options = useMemo(() => {
    if (isExam) {
      // If moving an exam, options are Courses (excluding the exam's current course)
      const currentCourseId = String(nodeToMove.parentId?.replace('course-', ''));
      return courses
        .filter(c => String(c.id) !== currentCourseId)
        .map(c => ({
          id: c.id,
          name: c.name,
          description: c.description || 'No description',
          type: 'course',
          meta: `${c.exam_count || 0} exams`,
        }));
    } else if (isQuestion) {
      // If moving a question, options are Exams (excluding the question's current exam)
      const currentExamId = String(nodeToMove.originalData?.examId);
      const allExams: any[] = [];
      courses.forEach(course => {
        const exams = Array.isArray(course.exams) 
          ? course.exams 
          : (course.exams && typeof course.exams === 'object' ? Object.values(course.exams) : []);
        
        exams.forEach((exam: any) => {
          if (String(exam.id) !== currentExamId) {
            allExams.push({
              id: exam.id,
              name: exam.name,
              description: `Inside Course: ${course.name}`,
              type: 'exam',
              meta: `${exam.questions_count || 0} questions`,
            });
          }
        });
      });
      return allExams;
    }
    return [];
  }, [nodeToMove, courses, isExam, isQuestion]);

  // 2. Filter options by search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();
    return options.filter(
      opt => 
        opt.name.toLowerCase().includes(q) || 
        opt.description.toLowerCase().includes(q)
    );
  }, [searchQuery, options]);

  const handleConfirm = () => {
    if (selectedDestinationId !== null) {
      onMoveConfirm(selectedDestinationId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md modal-move flex flex-col p-6 overflow-hidden">
        <DialogHeader className="shrink-0 pb-2 border-b">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Move className="w-5 h-5 text-primary" />
            Move {isExam ? 'Exam' : 'Question'}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Choose a new target location to migrate this item. Gaps in indexes will self-heal automatically.
          </DialogDescription>
        </DialogHeader>

        {/* Dynamic path preview */}
        <div className="shrink-0 flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-dashed text-xs my-3 select-none">
          <div className="flex-1 min-w-0">
            <span className="text-muted-foreground block uppercase font-bold text-[9px] tracking-wider">Source Item</span>
            <span className="font-semibold block truncate text-foreground/90">{nodeToMove.label}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-3" />
          <div className="flex-1 min-w-0">
            <span className="text-muted-foreground block uppercase font-bold text-[9px] tracking-wider">Destination</span>
            <span className={cn(
              "font-bold block truncate",
              selectedDestinationId 
                ? "text-primary animate-pulse" 
                : "text-muted-foreground italic"
            )}>
              {selectedDestinationId 
                ? options.find(o => o.id === selectedDestinationId)?.name 
                : 'Select destination below'}
            </span>
          </div>
        </div>

        {/* Search Input */}
        <div className="shrink-0 relative mb-3">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
          <Input
            placeholder={`Search destination ${isExam ? 'courses' : 'exams'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        {/* Options list container */}
        <div className="flex-1 overflow-y-auto options-list border rounded-lg divide-y divide-border select-none">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => setSelectedDestinationId(option.id)}
                className={cn(
                  "p-3 flex items-center justify-between cursor-pointer transition-all duration-150 text-sm hover:bg-muted/10",
                  selectedDestinationId === option.id 
                    ? "bg-primary/5 border-l-4 border-primary pl-2" 
                    : "bg-background"
                )}
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  {isExam ? (
                    <Book className={cn(
                      "w-4 h-4 mt-0.5 shrink-0", 
                      selectedDestinationId === option.id ? "text-primary" : "icon-indigo"
                    )} />
                  ) : (
                    <FileText className={cn(
                      "w-4 h-4 mt-0.5 shrink-0", 
                      selectedDestinationId === option.id ? "text-primary" : "icon-amber"
                    )} />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold block truncate text-foreground">{option.name}</span>
                    <span className="text-xs text-muted-foreground block truncate">{option.description}</span>
                  </div>
                </div>
                <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-medium shrink-0 ml-2">
                  {option.meta}
                </span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No matching destinations found.
            </div>
          )}
        </div>

        <DialogFooter className="shrink-0 pt-4 border-t mt-4 flex gap-2 justify-end">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={processing}
            className="h-9 font-semibold text-xs"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedDestinationId === null || processing}
            className="h-9 font-semibold text-xs min-w-[90px]"
          >
            {processing ? 'Moving...' : 'Confirm Move'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
