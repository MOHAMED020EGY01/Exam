import { router } from '@inertiajs/react';

export const courseService = {
  /**
   * Delete a course by ID
   */
  deleteCourse(courseId: string | number, onSuccess?: () => void) {
    router.delete(route('courses.destroy', courseId), {
      onSuccess: () => {
        if (onSuccess) onSuccess();
      },
    });
  },

  /**
   * Delete an exam by course ID and exam ID
   */
  deleteExam(courseId: string | number, examId: string | number, onSuccess?: () => void) {
    router.delete(
      route('exams.destroy', { course: courseId, exam: examId }),
      {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        },
      }
    );
  },

  /**
   * Trigger the zip download for a specific exam
   */
  downloadExam(courseId: string | number, examId: string | number) {
    window.location.href = route('exams.download', {
      course: courseId,
      exam: examId,
    });
  },
};
