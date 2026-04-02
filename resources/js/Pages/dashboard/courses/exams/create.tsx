import { DashboardLayout } from "@/components/layout/dashboard";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React from "react";
import { Answer, ExamManager, Question } from "@/components/class/form-login"; 
/* ================= TYPES ================= */


type FormData = {
  name: string;
  description: string;
  questions: Question[];
};

/* ================= COMPONENT ================= */
interface Props{
  course:any
}
function Create({course}:Props) {
  const { data, setData, post, processing, errors } = useForm<FormData>({
    name: "",
    description: "",
    questions: [],

  });
  /* ================= HELPERS ================= */

const addQuestion = () => {
  const manager = new ExamManager([...data.questions]);
  setData("questions", manager.addQuestion());
};

const removeQuestion = (qi: number) => {
  const manager = new ExamManager([...data.questions]);
  setData("questions", manager.removeQuestion(qi));
};

const addAnswer = (qi: number) => {
  const manager = new ExamManager([...data.questions]);
  setData("questions", manager.addAnswer(qi));
};

const removeAnswer = (qi: number, ai: number) => {
  const manager = new ExamManager([...data.questions]);
  setData("questions", manager.removeAnswer(qi, ai));
};

const updateQuestion = <K extends keyof Question>(
  qi: number,
  key: K,
  value: Question[K]
) => {
  const manager = new ExamManager([...data.questions]);
  setData("questions", manager.updateQuestion(qi, key, value));
};

const updateAnswer = <K extends keyof Answer>(
  qi: number,
  ai: number,
  key: K,
  value: Answer[K]
) => {
  const manager = new ExamManager([...data.questions]);
  setData(
    "questions",
    manager.updateAnswer(qi, ai, key, value)
  );
};

  /* ================= SUBMIT ================= */

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (data.questions.length === 0) {
      alert("Add at least one question");
      return;
    }

    post(route('exams.store',course.id));
  };

  /* ================= UI ================= */

  return (
    <form onSubmit={submit} className="p-6 space-y-6">

      {/* 🔹 Name */}
      <div className="space-y-2">
        <Label>Exam Name</Label>
        <Input
          value={data.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setData("name", e.target.value)
          }
          className={cn(errors.name && "border-red-400")}
        />
        {errors.name && (
          <p className="text-red-400 text-sm">{errors.name}</p>
        )}
      </div>

      {/* 🔹 Description */}
      <div className="space-y-2">
        <Label>Description</Label>
        <Input
          value={data.description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setData("description", e.target.value)
          }
          className={cn(errors.description && "border-red-400")}
        />
        {errors.description && (
          <p className="text-red-400 text-sm">
            {errors.description}
          </p>
        )}
      </div>

      {/* 🔥 Questions */}
      {data.questions.map((q, qi) => (
        <div
          key={qi}
          className="border rounded-xl p-4 space-y-4"
        >
          {/* Question Text */}
          <div>
            <Label>Question</Label>
            <Input
              value={q.text}
              onChange={(e) =>
                updateQuestion(qi, "text", e.target.value)
              }
              className={cn(
                errors[`questions.${qi}.text`] &&
                  "border-red-400"
              )}
            />
          </div>

          {/* Multiple */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={q.multiple}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateQuestion(qi, "multiple", e.target.checked)
              }
            />
            Multiple Choice
          </label>

          {/* Question Image */}
          <Input
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateQuestion(
                qi,
                "image",
                e.target.files?.[0] ?? null
              )
            }
          />

          {/* 🧩 Answers */}
          {q.answers.map((a, ai) => (
            <div key={ai} className="flex gap-2 items-center">
              <Input
                placeholder="Answer"
                value={a.text}
                onChange={(e) =>
                  updateAnswer(qi, ai, "text", e.target.value)
                }
              />

              {/* is_correct */}
              <input
                type="checkbox"
                checked={a.is_correct}
                onChange={() => {
                  const manager = new ExamManager([...data.questions]);
                  setData("questions", manager.toggleCorrect(qi, ai));
                }}
              />

              {/* Image */}
              <Input
                type="file"
                onChange={(e) =>
                  updateAnswer(
                    qi,
                    ai,
                    "image",
                    e.target.files?.[0] ?? null
                  )
                }
              />

              <Button
                type="button"
                variant="destructive"
                onClick={() => removeAnswer(qi, ai)}
              >
                X
              </Button>
            </div>
          ))}

          <Button type="button" onClick={() => addAnswer(qi)}>
            + Add Answer
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={() => removeQuestion(qi)}
          >
            Delete Question
          </Button>
        </div>
      ))}

      {/* Add Question */}
      <Button type="button" onClick={addQuestion}>
        + Add Question
      </Button>

      {/* Submit */}
      <Button type="submit" disabled={processing}>
        Submit
      </Button>
    </form>
  );
}

/* ================= LAYOUT ================= */

Create.layout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default Create;