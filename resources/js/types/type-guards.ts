import type { CourseData, ExamsData, QuestionsData } from "./tree.types";

export function isCourseData(data: unknown): data is CourseData {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "exams" in data
  );
}

export function isExamData(data: unknown): data is ExamsData {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "course_id" in data
  );
}

export function isQuestionData(data: unknown): data is QuestionsData {
  return (
    typeof data === "object" &&
    data !== null &&
    "text" in data &&
    "answers" in data
  );
}
