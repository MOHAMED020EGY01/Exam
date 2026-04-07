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

export class Questions {
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

  removeQuestion(questionIndex: number): Question[] {
    this.questions = this.questions.filter((_, i) => i !== questionIndex);
    return this.questions;
  }

  updateQuestion<K extends keyof Question>(
    questionIndex: number,
    key: K,
    value: Question[K]
  ): Question[] {
    this.questions[questionIndex][key] = value;
    return this.questions;
  }

  /* ================= Answers ================= */

  addAnswer(questionIndex: number): Question[] {
    this.questions[questionIndex].answers.push({
      text: "",
      is_correct: false,
      image: null,
    });

    return this.questions;
  }

  removeAnswer(questionIndex: number, answerIndex: number): Question[] {
    this.questions[questionIndex].answers =
      this.questions[questionIndex].answers.filter((_, i) => i !== answerIndex);

    return this.questions;
  }

  updateAnswer<K extends keyof Answer>(
    questionIndex: number,
    answerIndex: number,
    key: K,
    value: Answer[K]
  ): Question[] {
    this.questions[questionIndex].answers[answerIndex][key] = value;
    return this.questions;
  }

  toggleCorrect(questionIndex: number, answerIndex: number): Question[] {
    const question = this.questions[questionIndex];

    if (!question.multiple) {
      question.answers.forEach((a) => (a.is_correct = false));
    }

    question.answers[answerIndex].is_correct =
      !question.answers[answerIndex].is_correct;

    return this.questions;
  }
}