<?php

namespace App\Http\Resources;

use App\Services\ExamServices;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Nette\Utils\Json;

class ExamResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $questionContent = ExamServices::responseFileJson($this->questions_package);
        return [
            'id' => (string)$this->id,
            'name' => (string)$this->name,
            'description'=>(string)$this->description,
            'course_id'=>(string)$this->course_id,
            'questions_count' => (int)$this->questions_count,
            'questions_package' => $questionContent,
            'created_at' => (string)$this->created_at?->format('Y-m-d H'),
            'diff_for_humans' => (string)$this->created_at?->diffForHumans(),
        ];
    }
}
