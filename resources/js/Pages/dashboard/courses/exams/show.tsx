import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard';

interface Answer {
  text: string;
  image: string | null;
  is_correct: boolean;
}

interface Question {
  text: string;
  multiple: boolean;
  image: string | null;
  answers: Answer[];
}

interface ExamData {
  id: string;
  name: string;
  description: string;
  course_id: string;
  questions_count: number;
  questions_package: Question[];
  created_at: string;
  diff_for_humans: string;
}

interface SelectedAnswers {
  [questionIndex: number]: number | number[];
}

function Show({ exam }: { exam: ExamData }) {
  const examData = exam as ExamData;

  const safeQuestions = useMemo(() => {
    const pkg = examData?.questions_package;
    return Array.isArray(pkg) ? pkg : (pkg && typeof pkg === 'object' ? Object.values(pkg) as Question[] : []);
  }, [examData]);

  const questionsWithoutAnswers = useMemo(() => {
    return safeQuestions.map((q: Question) => {
      const { answers, ...questionWithoutAnswers } = q;
      return questionWithoutAnswers;
    });
  }, [safeQuestions]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = safeQuestions;
  const currentQuestion = questions[currentQuestionIndex] || null;
  const progressPercentage = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const handleAnswerSelect = (answerIndex: number) => {
    if (!currentQuestion) return;

    if (currentQuestion.multiple) {
      const current = (selectedAnswers[currentQuestionIndex] as number[]) || [];
      const updated = current.includes(answerIndex)
        ? current.filter(idx => idx !== answerIndex)
        : [...current, answerIndex];
      setSelectedAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: updated,
      }));
    } else {
      setSelectedAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: answerIndex,
      }));
    }
  };

  const isAnswerSelected = (answerIndex: number): boolean => {
    const selected = selectedAnswers[currentQuestionIndex];
    if (currentQuestion?.multiple) {
      return Array.isArray(selected) && selected.includes(answerIndex);
    }
    return selected === answerIndex;
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  if (!examData || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">No exam data available</p>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Exam Submitted</CardTitle>
            <CardDescription>Your responses have been recorded</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Thank you for completing the exam: <strong>{examData.name}</strong></p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full px-2 py-4 sm:px-0">
        {/* Exam Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl">{examData.name}</CardTitle>
                <CardDescription className="mt-2">{examData.description}</CardDescription>
              </div>
              <Badge variant="outline" className="ml-4">
                {examData.questions_count} Questions
              </Badge>
            </div>
            <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
              <span>Created: {examData.created_at}</span>
              <span>({examData.diff_for_humans})</span>
            </div>
          </CardHeader>
        </Card>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">{currentQuestion.text}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Question Image */}
              {currentQuestion.image && (
                <div className="mb-6">
                  <img
                    src={currentQuestion.image}
                    alt="Question"
                    className="max-w-full h-auto rounded-lg border"
                  />
                </div>
              )}

              <Separator className="mb-6" />

              {/* Answers */}
              <div className="space-y-3">
                {Array.isArray(currentQuestion.answers) && currentQuestion.answers.length > 0 ? (
                  currentQuestion.multiple ? (
                    // Multiple Choice - Checkboxes
                    <div className="space-y-3">
                      {currentQuestion.answers.map((answer, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <Checkbox
                            id={`answer-${idx}`}
                            checked={isAnswerSelected(idx)}
                            onCheckedChange={() => handleAnswerSelect(idx)}
                            className="mt-1"
                          />
                          <label
                            htmlFor={`answer-${idx}`}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="space-y-2">
                              <p className="text-sm font-medium leading-relaxed">
                                {answer.text}
                              </p>
                              {answer.image && (
                                <img
                                  src={answer.image}
                                  alt="Answer"
                                  className="max-w-xs h-auto rounded border"
                                />
                              )}
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Single Choice - Radio Group
                    <RadioGroup
                      value={String(selectedAnswers[currentQuestionIndex] ?? '')}
                      onValueChange={val => handleAnswerSelect(parseInt(val))}
                    >
                      {currentQuestion.answers.map((answer, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <RadioGroupItem
                            value={String(idx)}
                            id={`answer-${idx}`}
                            className="mt-1"
                          />
                          <label
                            htmlFor={`answer-${idx}`}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="space-y-2">
                              <p className="text-sm font-medium leading-relaxed">
                                {answer.text}
                              </p>
                              {answer.image && (
                                <img
                                  src={answer.image}
                                  alt="Answer"
                                  className="max-w-xs h-auto rounded border"
                                />
                              )}
                            </div>
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">No answers available</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex-1" />

          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4" />
              Submit Exam
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={currentQuestionIndex === questions.length - 1}
              className="gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
  );
}
Show.layout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);
export default Show;
