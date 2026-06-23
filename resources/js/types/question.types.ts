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
