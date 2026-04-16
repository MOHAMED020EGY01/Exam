<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamApiResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string)$this->id,
            'name_exam' => (string)$this->name,
            'description_exam'=>(string)$this->description,
            'course_name'=>(string)$this->course->name,
            'user_name'=>(string)$this->user->name,
            'number_of_questions' => (int)$this->questions_count,
        ];
    }
}
