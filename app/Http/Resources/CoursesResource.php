<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CoursesResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string)$this->id,
            'name' => (string)$this->name,
            'exam_count' => (int)$this->exams->count(),
            'description' => (string)$this->description,
            'created_at' => (string)$this->created_at?->format('Y-m-d H'),
            'diff_for_humans' => (string)$this->created_at?->diffForHumans(),
        ];
    }
}
