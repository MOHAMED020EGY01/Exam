/**
 * treeHelpers.ts
 *
 * Purpose:
 * Normalizes flat course and exam structures into recursive TreeNodeData format
 * and provides helper functions to filter and traverse the tree nodes.
 *
 * Responsibilities:
 * - Convert courses array into tree structure
 * - Recursively filter nodes by scope and query
 * - Extract expanded/collapsed folder node keys
 *
 * Dependencies:
 * - TreeNodeData (type definitions)
 */

import { CourseData, ExamsData, QuestionsData, TreeNodeData } from "@/interface/global";

/**
 * Normalizes flat Laravel data with nested relationships into a standard TreeNodeData tree.
 * Uses rigorous defensive programming to prevent runtime crashes from null/object data structures.
 */
export function normalizeCoursesToTree(
    courses: CourseData[] = [],
): TreeNodeData[] {

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
                            label: question.text || `Question ${index + 1}`,
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
/**
 * Recursively filters the tree based on a search query.
 * If a child node matches the query, all its ancestor nodes are kept.
 */
export function filterTree(
    nodes: any,
    query: string,
    scope: string = "all",
): TreeNodeData[] {
    const safeNodes = Array.isArray(nodes)
        ? nodes
        : nodes && typeof nodes === "object"
          ? Object.values(nodes)
          : [];

    if (!query) return safeNodes;
    const lowerQuery = query.toLowerCase();

    return safeNodes
        .map((node: any) => {
            if (!node) return null;

            const matchesScope = scope === "all" || node.type === scope;
            const matchesSelf =
                matchesScope &&
                (node.label?.toLowerCase().includes(lowerQuery) || false);

            const safeChildren = Array.isArray(node.children)
                ? node.children
                : node.children && typeof node.children === "object"
                  ? Object.values(node.children)
                  : [];

            if (safeChildren.length > 0) {
                const filteredChildren = filterTree(safeChildren, query, scope);
                if (filteredChildren.length > 0 || matchesSelf) {
                    return {
                        ...node,
                        children: matchesSelf ? safeChildren : filteredChildren,
                    };
                }
            } else if (matchesSelf) {
                return node;
            }
            return null;
        })
        .filter((node): node is TreeNodeData => node !== null);
}

/**
 * Gets all IDs of folder nodes (course and exam) in a tree.
 * Useful for "Expand All" operations.
 */
export function getFolderNodeIds(nodes: any): string[] {
    const ids: string[] = [];
    const safeNodes = Array.isArray(nodes)
        ? nodes
        : nodes && typeof nodes === "object"
          ? Object.values(nodes)
          : [];

    function traverse(n: TreeNodeData) {
        if (!n) return;
        if (n.type === "course" || n.type === "exam") {
            ids.push(n.id);
            const safeChildren = (
                Array.isArray(n.children)
                    ? n.children
                    : n.children && typeof n.children === "object"
                      ? Object.values(n.children)
                      : []
            ) as TreeNodeData[];
            safeChildren.forEach(traverse);
        }
    }
    safeNodes.forEach(traverse);
    return ids;
}
