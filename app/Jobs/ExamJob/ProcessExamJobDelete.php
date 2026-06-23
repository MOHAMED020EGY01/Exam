<?php

namespace App\Jobs\ExamJob;

use App\Events\ExamEvent\ExamDeleteEvent;
use App\Models\Exam;
use App\Services\ExamServices;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessExamJobDelete implements ShouldQueue
{
    use Queueable;

    private Exam $exam;
    public function __construct(Exam $exam)
    {
        $this->exam = $exam;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        ExamServices::deleteExamPackage($this->exam);

        event(new ExamDeleteEvent($this->exam, $this->exam->user_id));
    }
}
