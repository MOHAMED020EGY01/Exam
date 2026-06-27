<?php

namespace App\Jobs\ExamJob;

use App\Events\ExamEvent\ExamCreatedEvent;
use App\Models\Course;
use App\Models\Exam;
use App\Models\User;
use App\Services\ExamServices;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\SerializesModels;

class ProcessExamJobCreate implements ShouldQueue
{
    use Queueable, SerializesModels;


    /**
     * Summary of __construct
     * @param Course $course
     * @param User $user
     * @param array $requestData
     * @param string $path
     */
    public function __construct(
        private Course $course,
        private User $user,
        private array $requestData,
        private string $path
    ) {}
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
        event(new ExamCreatedEvent($exam, $this->user->id));
    }
}
