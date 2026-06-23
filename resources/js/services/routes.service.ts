import { route } from "ziggy-js";

export const Routes = {
    courses: {
        store: () => route("courses.store"),
        update: (id: string | number) => route("courses.update", id),
        destroy: (id: string | number) => route("courses.destroy", id),
    },
    exams: {
        store: (courseId: string | number) => route("exams.store", courseId),
        update: (courseId: string | number, examId: string | number) =>
            route("exams.update", { course: courseId, exam: examId }),
        destroy: (courseId: string | number, examId: string | number) =>
            route("exams.destroy", { course: courseId, exam: examId }),
        download: (courseId: string | number, examId: string | number) =>
            route("exams.download", { course: courseId, exam: examId }),
        paste: () => route("exams.paste"),
        duplicate: () => route("exams.duplicate"),
        move: () => route("exams.move"),
    },
    questions: {
        paste: () => route("questions.paste"),
        duplicate: () => route("questions.duplicate"),
        move: () => route("questions.move"),
        delete: () => route("questions.delete"),
    },
    auth: {
        logout: () => route("logout"),
    },
};
