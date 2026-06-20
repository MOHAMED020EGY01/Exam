/**
 * global.tsx
 *
 * Purpose:
 * Shared interfaces and generic type declarations used across UI/UX components.
 *
 * Responsibilities:
 * - Define DropdownItemInterface configurations
 * - Define CardInterface props
 * - Define generic openSetOpenInterface toggles
 *
 * Dependencies:
 * - React
 */

import { ReactNode } from "react";

export type TypeMethodHTTP = "get" | "post" | "put" | "delete";
export type Variant = "default" | "destructive";
export type nodeType = "course" | "exam" | "question";
export type originalData = CourseData | QuestionsData | ExamsData;
export interface DropdownItemInterface {
    label: string;
    icon: ReactNode;
    openModal: boolean;
    openModalFn?: Function;
    href?: string;
    method?: TypeMethodHTTP;
    variant?: Variant;
    danger?: boolean;
    download?: boolean;
}

export interface ExamsData {
    id: string;
    name: string;
    description: string;
    course_id: string;
    diff_for_humans: string;
    created_at: string;
    questions_count: number;
    questions_package: QuestionsData[];
}

export interface QuestionsData {
    text: string;
    multiple: boolean;
    image: string | null;
    answers: AnswerData[];
    examId?: string;
    courseId?: string;
}

export interface AnswerData {
    image: string | null;
    is_correct: boolean;
    text: string;
}

export interface CourseData {
    id: string;
    name: string;
    exam_count: number;
    description: string;
    created_at: string;
    diff_for_humans: string;
    exams: ExamsData[];
}

export interface TreeNodeData {
    id: string; // e.g. 'course-1', 'exam-3', 'question-3-0'
    label: string;
    type: nodeType;
    parentId?: string;
    originalId: string | number;
    originalData?: originalData;
    children?: TreeNodeData[];
}
