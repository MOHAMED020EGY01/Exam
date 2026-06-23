<?php

namespace App\Jobs;

use App\Events\ExamCreatedEvent;
use App\Models\Course;
use App\Models\Exam;
use App\Models\User;
use App\Services\ExamServices;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessExamJobCreate implements ShouldQueue
{
    use Queueable, SerializesModels;

    private Course $course;
    private User $user;
    private array $requestData;
    private string $path;
    public function __construct(array $requestData, Course $course, User $user, string $path)
    {
        $this->requestData = $requestData;
        $this->course = $course;
        $this->user = $user;
        $this->path = $path;
    }
    /**
     * Execute the job.
     */
    public function handle(): void
    {

        ExamServices::directoryFindOrCreate($this->path);
        ExamServices::processExamData(
            $this->requestData,
            $this->path
        );

        $filesCount = ExamServices::filterFilesQuestions($this->path);
        $exam = Exam::create([
            'name' => $this->requestData['name'],
            'description' => $this->requestData['description'],
            'user_id' => $this->user->id,
            'course_id' => $this->course->id,
            'questions_package' => $this->path,
            'questions_count' => count($filesCount),
        ]);

        Log::info("before");
        event(new ExamCreatedEvent($exam, $this->user->id));
        Log::info("After");

    }
}
