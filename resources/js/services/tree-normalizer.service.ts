import type { CourseData, TreeNode, ExamsData, QuestionsData } from "@/types";

export class TreeNormalizerService {
    static normalizeCoursesToTree(courses: CourseData[] = []): TreeNode[] {
        return courses.map((course) => ({
            id: `course-${course.id}`,
            label: course.name || "Unnamed Course",
            type: "course",
            originalId: course.id,
            originalData: course,
            children: Array.isArray(course?.exams)
                ? course.exams.map((exam: ExamsData) => ({
                      id: `exam-${exam.id}`,
                      label: exam.name || "N/A Exam",
                      type: "exam",
                      parentId: `course-${course.id}`,
                      originalId: exam.id,
                      originalData: {
                          ...exam,
                          courseId: course.id,
                      },
                      children: Array.isArray(exam?.questions_package)
                          ? exam.questions_package.map(
                                (question: QuestionsData, index: number) => ({
                                    id: `question-${exam.id}-${index}`,
                                    label:
                                        question.text ||
                                        `Question ${index + 1}`,
                                    type: "question",
                                    parentId: `exam-${exam.id}`,
                                    originalId: index,
                                    originalData: {
                                        ...question,
                                        index,
                                        examId: exam.id,
                                        courseId: course.id,
                                    },
                                }),
                            )
                          : [],
                  }))
                : [],
        }));
    }

    static filterTree(
        nodes: unknown,
        query: string,
        scope: string = "all",
    ): TreeNode[] {
        const safeNodes: TreeNode[] = Array.isArray(nodes)
            ? (nodes as TreeNode[])
            : nodes && typeof nodes === "object"
              ? (Object.values(nodes) as TreeNode[])
              : [];

        if (!query) return safeNodes;
        const lowerQuery = query.toLowerCase();

        return safeNodes
            .map((node: TreeNode) => {
                if (!node) return null;

                const matchesScope = scope === "all" || node.type === scope;
                const matchesSelf =
                    matchesScope &&
                    (node.label?.toLowerCase().includes(lowerQuery) || false);

                const safeChildren: TreeNode[] = Array.isArray(node.children)
                    ? node.children
                    : node.children && typeof node.children === "object"
                      ? (Object.values(node.children) as TreeNode[])
                      : [];

                if (safeChildren.length > 0) {
                    const filteredChildren = TreeNormalizerService.filterTree(
                        safeChildren,
                        query,
                        scope,
                    );
                    if (filteredChildren.length > 0 || matchesSelf) {
                        return {
                            ...node,
                            children: matchesSelf
                                ? safeChildren
                                : filteredChildren,
                        };
                    }
                } else if (matchesSelf) {
                    return node;
                }
                return null;
            })
            .filter((node): node is TreeNode => node !== null);
    }

    static getFolderNodeIds(nodes: TreeNode[]): string[] {
        const ids: string[] = [];
        const safeNodes = Array.isArray(nodes)
            ? nodes
            : nodes && typeof nodes === "object"
              ? Object.values(nodes)
              : [];

        function traverse(n: TreeNode) {
            if (!n) return;
            if (n.type === "course" || n.type === "exam") {
                ids.push(n.id);
                const safeChildren = (
                    Array.isArray(n.children)
                        ? n.children
                        : n.children && typeof n.children === "object"
                          ? Object.values(n.children)
                          : []
                ) as TreeNode[];
                safeChildren.forEach(traverse);
            }
        }
        (safeNodes as TreeNode[]).forEach(traverse);
        return ids;
    }

    static findNodeById(nodes: TreeNode[], id: string): TreeNode | null {
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children && node.children.length > 0) {
                const found = TreeNormalizerService.findNodeById(
                    node.children,
                    id,
                );
                if (found) return found;
            }
        }
        return null;
    }
}
