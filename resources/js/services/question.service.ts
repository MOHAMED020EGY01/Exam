import type { Question, Answer } from '@/types';

export class QuestionService {
  /**
   * إضافة سؤال جديد فارغ إلى القائمة.
   * @param questions - مصفوفة الأسئلة الحالية
   * @returns مصفوفة الأسئلة بعد الإضافة
   */
  static addQuestion(questions: Question[]): Question[] {
    return [
      ...questions,
      {
        text: '',
        multiple: false,
        image: null,
        answers: [
          { text: '', is_correct: false, image: null },
          { text: '', is_correct: false, image: null },
        ],
      },
    ];
  }

  /**
   * حذف سؤال حسب الفهرس.
   * @param questions - مصفوفة الأسئلة الحالية
   * @param questionIndex - فهرس السؤال المراد حذفه
   * @returns مصفوفة الأسئلة بعد الحذف
   */
  static removeQuestion(questions: Question[], questionIndex: number): Question[] {
    return questions.filter((_, i) => i !== questionIndex);
  }

  /**
   * تحديث حقل معين في سؤال.
   * @param questions - مصفوفة الأسئلة الحالية
   * @param questionIndex - فهرس السؤال المراد تحديثه
   * @param key - حقل السؤال المراد تحديثه
   * @param value - القيمة الجديدة
   * @returns مصفوفة الأسئلة بعد التحديث
   */
  static updateQuestion<K extends keyof Question>(
    questions: Question[],
    questionIndex: number,
    key: K,
    value: Question[K]
  ): Question[] {
    return questions.map((q, i) => {
      if (i !== questionIndex) return q;
      return { ...q, [key]: value };
    });
  }

  /**
   * إضافة إجابة فارغة إلى سؤال.
   * @param questions - مصفوفة الأسئلة الحالية
   * @param questionIndex - فهرس السؤال المراد إضافة إجابة إليه
   * @returns مصفوفة الأسئلة بعد الإضافة
   */
  static addAnswer(questions: Question[], questionIndex: number): Question[] {
    return questions.map((q, i) => {
      if (i !== questionIndex) return q;
      return {
        ...q,
        answers: [
          ...q.answers,
          { text: '', is_correct: false, image: null },
        ],
      };
    });
  }

  /**
   * حذف إجابة من سؤال.
   * @param questions - مصفوفة الأسئلة الحالية
   * @param questionIndex - فهرس السؤال الذي يحتوي على الإجابة المراد حذفها
   * @param answerIndex - فهرس الإجابة المراد حذفها
   * @returns مصفوفة الأسئلة بعد الحذف
   */
  static removeAnswer(questions: Question[], questionIndex: number, answerIndex: number): Question[] {
    return questions.map((q, i) => {
      if (i !== questionIndex) return q;
      return {
        ...q,
        answers: q.answers.filter((_, ai) => ai !== answerIndex),
      };
    });
  }

  /**
   * تحديث حقل معين في إجابة.
   * @param questions - مصفوفة الأسئلة الحالية
   * @param questionIndex - فهرس السؤال الذي يحتوي على الإجابة المراد تحديثها
   * @param answerIndex - فهرس الإجابة المراد تحديثها
   * @param key - حقل الإجابة المراد تحديثه
   * @param value - القيمة الجديدة
   * @returns مصفوفة الأسئلة بعد التحديث
   */
  static updateAnswer<K extends keyof Answer>(
    questions: Question[],
    questionIndex: number,
    answerIndex: number,
    key: K,
    value: Answer[K]
  ): Question[] {
    return questions.map((q, i) => {
      if (i !== questionIndex) return q;
      return {
        ...q,
        answers: q.answers.map((a, ai) => {
          if (ai !== answerIndex) return a;
          return { ...a, [key]: value };
        }),
      };
    });
  }

  /**
   * تبديل حالة الإجابة الصحيحة (يتعامل مع单选/متعدد).
   * @param questions - مصفوفة الأسئلة الحالية
   * @param questionIndex - فهرس السؤال
   * @param answerIndex - فهرس الإجابة المراد تبديلها
   * @returns مصفوفة الأسئلة بعد التحديث
   */
  static toggleCorrect(questions: Question[], questionIndex: number, answerIndex: number): Question[] {
    return questions.map((q, i) => {
      if (i !== questionIndex) return q;
      
      let newAnswers: Answer[];
      if (!q.multiple) {
        newAnswers = q.answers.map((a, ai) => ({
          ...a,
          is_correct: ai === answerIndex ? !a.is_correct : false,
        }));
      } else {
        newAnswers = q.answers.map((a, ai) => {
          if (ai !== answerIndex) return a;
          return { ...a, is_correct: !a.is_correct };
        });
      }

      return { ...q, answers: newAnswers };
    });
  }
}
