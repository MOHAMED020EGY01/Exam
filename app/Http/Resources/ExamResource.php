<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamResource extends JsonResource
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
            'name' => (string)$this->name,
            'questions_count' => (int)$this->questions_count,
            'created_at' => (string)$this->created_at?->format('Y-m-d H'),
            'diff_for_humans' => (string)$this->created_at?->diffForHumans(),
        ];
    }
}
