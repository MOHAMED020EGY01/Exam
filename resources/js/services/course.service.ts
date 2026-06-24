import { Routes } from "./routes.service";

export class CourseService {
    static downloadExam(courseId: string | number, examId: string | number) {
        window.location.href = Routes.exams.download(courseId, examId);
    }
}
