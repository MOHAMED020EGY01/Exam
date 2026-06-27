<?php

namespace App\Jobs\ExamJob;

use App\Events\ExamEvent\ExamUpdatedEvent;
use App\Models\Exam;
use App\Services\ExamServices;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class ProcessExamJobUpdate implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Summary of __construct
     * @param array $requestData
     * @param Exam $exam
     * @param string $path
     */
    public function __construct(
        private array $requestData,
        private Exam $exam,
        private string $path
    ) {}


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
        event(new ExamUpdatedEvent($this->exam, $this->exam->user_id));
    }
}