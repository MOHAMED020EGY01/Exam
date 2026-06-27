<?php

namespace App\Jobs\ExamJob;

use App\Events\ExamEvent\ExamDeleteEvent;
use App\Models\Exam;
use App\Services\ExamServices;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\SerializesModels;

class ProcessExamJobDelete implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Summary of __construct
     * @param Exam $exam
     */
    public function __construct(
        private Exam $exam
    ) {}
    /**
     * Execute the job.
     */
    public function handle(): void
    {
        ExamServices::deleteExamPackage($this->exam);
        $oldExam = $this->exam->toArray();
        $this->exam->delete($this->exam->id);
        
        event(new ExamDeleteEvent($oldExam, $oldExam['user_id']));
    }
}
