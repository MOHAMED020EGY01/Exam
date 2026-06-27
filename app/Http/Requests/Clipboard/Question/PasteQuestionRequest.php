<?php

namespace App\Http\Requests\Clipboard\Question;

use Illuminate\Foundation\Http\FormRequest;

class PasteQuestionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'source_exam_id' => 'required|exists:exams,id',
            'question_index' => 'required|integer|min:0',
            'destination_exam_id' => 'required|exists:exams,id',
        ];
    }
}
