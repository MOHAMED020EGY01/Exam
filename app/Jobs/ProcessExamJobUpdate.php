<?php

namespace App\Jobs;

use App\Models\Course;
use App\Models\Exam;
use App\Models\User;
use App\Services\ExamServices;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class ProcessExamJobUpdate implements ShouldQueue
{
    use Queueable, SerializesModels;

    private Course $course;
    private Exam $exam;
    private array $requestData;
    private string $path;
    public function __construct(array $requestData, Course $course, Exam $exam, string $path)
    {
        $this->requestData = $requestData;
        $this->course = $course;
        $this->exam = $exam;
        $this->path = $path;
    }
    /**
     * Execute the job.
     */
    public function handle(): void
    {

        ExamServices::processExamData(
            $this->requestData,
            $this->path
        );

        $filesCount = ExamServices::filterFilesQuestions($this->path);

        DB::transaction(function () use ($filesCount) {
            $this->exam->update([
                'name' => $this->requestData['name'],
                'description' => $this->requestData['description'],
                'questions_count' => count($filesCount),
            ]);
        });
    }
}
