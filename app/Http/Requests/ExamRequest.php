<?php

namespace App\Http\Requests;

use App\Rules\DublicateAnswer;
use App\Rules\DublicateQuestion;
use App\Rules\HasCorrectAnswer;
use App\Rules\ImageFileBase64;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ExamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $examId = $this->route('exam') ? $this->route('exam')->id : null;
        //dd($this->all());
        return [
            'name' => [
                'required',
                'string',
                'max:50',
                Rule::unique('exams', 'name')->ignore($examId)
            ],
            'description' => [
                'required',
                'string',
                'max:255'
            ],
            'questions' => [
                'required',
                'array',
                'min:1',
                new DublicateQuestion(),
            ],
            'questions.*.text' => [
                'required',
                'string',
            ],
            'questions.*.multiple' => [
                'required',
                'boolean'
            ],
            'questions.*.image' => [
                new ImageFileBase64(),
            ],
            'questions.*.answers' => [
                'required',
                'array',
                'min:2',
                new HasCorrectAnswer('is_correct'),
                new DublicateAnswer(),
            ],
            'questions.*.answers.*.text' => [
                'required',
                'string'
            ],
            'questions.*.answers.*.image' => [
                new ImageFileBase64(),
            ],
            'questions.*.answers.*.is_correct' => [
                'required',
                'boolean'
            ],
        ];
    }
}
