export interface TreeNodeData {
  id: string; // e.g. 'course-1', 'exam-3', 'question-3-0'
  label: string;
  type: 'course' | 'exam' | 'question';
  parentId?: string;
  originalId: string | number;
  originalData?: any;
  children?: TreeNodeData[];
}

/**
 * Normalizes flat Laravel data with nested relationships into a standard TreeNodeData tree.
 * Uses rigorous defensive programming to prevent runtime crashes from null/object data structures.
 */
export function normalizeCoursesToTree(courses: any): TreeNodeData[] {
  const safeCourses = Array.isArray(courses) 
    ? courses 
    : (courses && typeof courses === 'object' ? Object.values(courses) : []);

  return safeCourses
    .map((course: any) => {
      if (!course) return null;
      const courseId = `course-${course.id}`;
      
      // Ensure exams is always treated as an array, even if it's an object or null, supporting Laravel resource collections wrapping
      const rawExams = Array.isArray(course?.exams) 
        ? course.exams 
        : (Array.isArray(course?.exams?.data)
          ? course.exams.data
          : (course?.exams && typeof course.exams === 'object' ? Object.values(course.exams) : []));
        
      const examNodes: TreeNodeData[] = rawExams
        .map((exam: any) => {
          if (!exam) return null;
          const examId = `exam-${exam.id}`;
          
          // Question source can be questions_package or questions, support arrays and objects
          const rawQuestions = Array.isArray(exam?.questions_package)
            ? exam.questions_package
            : (Array.isArray(exam?.questions)
              ? exam.questions
              : (Array.isArray(exam?.questions_package?.data)
                ? exam.questions_package.data
                : (Array.isArray(exam?.questions?.data)
                  ? exam.questions.data
                  : (exam?.questions_package && typeof exam.questions_package === 'object' 
                    ? Object.values(exam.questions_package)
                    : (exam?.questions && typeof exam.questions === 'object' ? Object.values(exam.questions) : [])))));

          const questionNodes: TreeNodeData[] = rawQuestions
            .map((question: any, qIdx: number) => {
              if (!question) return null;
              const questionId = `question-${exam.id}-${qIdx}`;
              return {
                id: questionId,
                label: question?.text || `Question ${qIdx + 1}`,
                type: 'question' as const,
                parentId: examId,
                originalId: qIdx,
                originalData: {
                  ...question,
                  index: qIdx,
                  examId: exam.id,
                  courseId: course.id,
                },
              };
            })
            .filter((q): q is TreeNodeData => q !== null);

          return {
            id: examId,
            label: exam?.name || 'Unnamed Exam',
            type: 'exam' as const,
            parentId: courseId,
            originalId: exam.id,
            originalData: {
              ...exam,
              courseId: course.id,
            },
            children: questionNodes,
          };
        })
        .filter((e): e is TreeNodeData => e !== null);

      return {
        id: courseId,
        label: course?.name || 'Unnamed Course',
        type: 'course' as const,
        originalId: course.id,
        originalData: course,
        children: examNodes,
      };
    })
    .filter((c): c is TreeNodeData => c !== null);
}

/**
 * Recursively filters the tree based on a search query.
 * If a child node matches the query, all its ancestor nodes are kept.
 */
export function filterTree(nodes: any, query: string, scope: string = 'all'): TreeNodeData[] {
  const safeNodes = Array.isArray(nodes) 
    ? nodes 
    : (nodes && typeof nodes === 'object' ? Object.values(nodes) : []);

  if (!query) return safeNodes;
  const lowerQuery = query.toLowerCase();

  return safeNodes
    .map((node: any) => {
      if (!node) return null;
      
      const matchesScope = scope === 'all' || node.type === scope;
      const matchesSelf = matchesScope && (node.label?.toLowerCase().includes(lowerQuery) || false);
      
      const safeChildren = Array.isArray(node.children) 
        ? node.children 
        : (node.children && typeof node.children === 'object' ? Object.values(node.children) : []);

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
    : (nodes && typeof nodes === 'object' ? Object.values(nodes) : []);

  function traverse(n: TreeNodeData) {
    if (!n) return;
    if (n.type === 'course' || n.type === 'exam') {
      ids.push(n.id);
      const safeChildren = Array.isArray(n.children) 
        ? n.children 
        : (n.children && typeof n.children === 'object' ? Object.values(n.children) : []);
      safeChildren.forEach(traverse);
    }
  }
  safeNodes.forEach(traverse);
  return ids;
}
