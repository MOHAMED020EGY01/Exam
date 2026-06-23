import { router } from '@inertiajs/react';
import { Routes } from './routes.service';
import type { ClipboardContent, TreeNode, QuestionsData } from '@/types';

export class ClipboardService {
  static async pasteExam(
    clipboard: ClipboardContent,
    destination: TreeNode,
    onFinish?: () => void,
  ) {
    if (destination.type !== 'course') return;
    router.post(
      Routes.exams.paste(),
      {
        exam_id: clipboard.originalId,
        destination_course_id: destination.originalId,
      },
      {
        onFinish,
      },
    );
  }

  static async pasteQuestion(
    clipboard: ClipboardContent,
    destination: TreeNode,
    onFinish?: () => void,
  ) {
    if (destination.type !== 'exam') return;
    const originalData = clipboard.originalData as QuestionsData;
    router.post(
      Routes.questions.paste(),
      {
        source_exam_id: originalData.examId,
        question_index: clipboard.originalId,
        destination_exam_id: destination.originalId,
      },
      {
        onFinish,
      },
    );
  }

  static async duplicateExam(node: TreeNode, onFinish?: () => void) {
    router.post(
      Routes.exams.duplicate(),
      {
        exam_id: node.originalId,
      },
      {
        onFinish,
      },
    );
  }

  static async duplicateQuestion(node: TreeNode, onFinish?: () => void) {
    const originalData = node.originalData as QuestionsData;
    router.post(
      Routes.questions.duplicate(),
      {
        exam_id: originalData.examId,
        question_index: node.originalId,
      },
      {
        onFinish,
      },
    );
  }

  static async moveExam(
    node: TreeNode,
    destinationId: string | number,
    onSuccess?: () => void,
    onFinish?: () => void,
  ) {
    router.post(
      Routes.exams.move(),
      {
        exam_id: node.originalId,
        destination_course_id: destinationId,
      },
      {
        onSuccess,
        onFinish,
      },
    );
  }

  static async moveQuestion(
    node: TreeNode,
    destinationId: string | number,
    onSuccess?: () => void,
    onFinish?: () => void,
  ) {
    const originalData = node.originalData as QuestionsData;
    router.post(
      Routes.questions.move(),
      {
        source_exam_id: originalData.examId,
        question_index: node.originalId,
        destination_exam_id: destinationId,
      },
      {
        onSuccess,
        onFinish,
      },
    );
  }

  static async deleteQuestion(node: TreeNode, onFinish?: () => void) {
    const originalData = node.originalData as QuestionsData;
    router.post(
      Routes.questions.delete(),
      {
        exam_id: originalData.examId,
        question_index: node.originalId,
      },
      {
        onFinish,
      },
    );
  }
}
