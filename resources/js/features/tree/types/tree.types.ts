export type NodeType = 'course' | 'exam' | 'question';

export interface CourseData {
  id: string;
  name: string;
  exam_count: number;
  description: string;
  created_at: string;
  diff_for_humans: string;
  exams: ExamsData[];
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
  index?: number;
}

export interface AnswerData {
  image: string | null;
  is_correct: boolean;
  text: string;
}

export type TreeOriginalData = CourseData | ExamsData | QuestionsData;

export interface TreeNode {
  readonly id: string;
  readonly label: string;
  readonly type: NodeType;
  readonly parentId?: string;
  readonly originalId: string | number;
  readonly originalData?: TreeOriginalData;
  readonly children?: TreeNode[];
}
