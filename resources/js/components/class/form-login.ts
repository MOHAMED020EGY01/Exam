export type Answer = {
  text: string;
  is_correct: boolean;
  image: File | null;
};

export type Question = {
  text: string;
  multiple: boolean;
  image: File | null;
  answers: Answer[];
};

export class ExamManager {
  private questions: Question[];

  constructor(questions: Question[]) {
    this.questions = questions;
  }

  /* ================= Questions ================= */

  addQuestion(): Question[] {
    this.questions.push({
      text: "",
      multiple: false,
      image: null,
      answers: [
        { text: "", is_correct: false, image: null },
        { text: "", is_correct: false, image: null },
      ],
    });

    return this.questions;
  }

  removeQuestion(qi: number): Question[] {
    this.questions = this.questions.filter((_, i) => i !== qi);
    return this.questions;
  }

  updateQuestion<K extends keyof Question>(
    qi: number,
    key: K,
    value: Question[K]
  ): Question[] {
    this.questions[qi][key] = value;
    return this.questions;
  }

  /* ================= Answers ================= */

  addAnswer(qi: number): Question[] {
    this.questions[qi].answers.push({
      text: "",
      is_correct: false,
      image: null,
    });

    return this.questions;
  }

  removeAnswer(qi: number, ai: number): Question[] {
    this.questions[qi].answers =
      this.questions[qi].answers.filter((_, i) => i !== ai);

    return this.questions;
  }

  updateAnswer<K extends keyof Answer>(
    qi: number,
    ai: number,
    key: K,
    value: Answer[K]
  ): Question[] {
    this.questions[qi].answers[ai][key] = value;
    return this.questions;
  }

  toggleCorrect(qi: number, ai: number): Question[] {
    const question = this.questions[qi];

    if (!question.multiple) {
      question.answers.forEach((a) => (a.is_correct = false));
    }

    question.answers[ai].is_correct =
      !question.answers[ai].is_correct;

    return this.questions;
  }
}