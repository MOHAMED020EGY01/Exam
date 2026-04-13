<?php

namespace App\Http\Requests;

use App\Rules\HasCorrectAnswer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class ExamRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        //dd($this->all());
        $examId = $this->route('exam') ? $this->route('exam')->id : null;
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
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,gif,svg',
                'max:2048'
            ],
            'questions.*.answers' => [
                'required',
                'array',
                'min:2',
                new HasCorrectAnswer('is_correct')
            ],
            'questions.*.answers.*.text' => [
                'required',
                'string'
            ],
            'questions.*.answers.*.image' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,gif,svg',
                'max:2048'
            ],
            'questions.*.answers.*.is_correct' => [
                'required',
                'boolean'
            ],
        ];
    }
}
