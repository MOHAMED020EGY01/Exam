<?php

namespace App\Jobs\ClipboardJob;

use App\Enums\StatusHttp;
use App\Events\ClipboardEvent\MoveQuestionEvent;
use App\Models\Exam;
use App\Models\User;
use App\Services\ClipboardServices;
use App\Services\ExamServices;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\SerializesModels;

class ProcessJobMoveQuestion implements ShouldQueue
{
    use Queueable, SerializesModels;
    /**
     * Summary of __construct
     * @param User $user
     * @param array $requestData
     */
    public function __construct(
        private User $user,
        private array $requestData
    ) {}
    public function handle(): void
    {
        $sourceExam = Exam::where('id', '=', $this->requestData['source_exam_id'], 'and')->where('user_id', $this->user->id)->firstOrFail();
        $destinationExam = Exam::where('id', '=', $this->requestData['destination_exam_id'], 'and')->where('user_id', $this->user->id)->firstOrFail();

        if ($sourceExam->id === $destinationExam->id) {
            event(new MoveQuestionEvent(StatusHttp::ERROR, 'Cannot move a question to the exact same exam.', $this->user->id));
            // TODO: Handle error case
            return;
        }

        // Retrieve source files
        $sourceFiles = ExamServices::filterFilesQuestions($sourceExam->questions_package);
        $sourceFiles = ClipboardServices::naturalSortFiles($sourceFiles);

        $questionIndex = (int)$this->requestData['question_index'];
        if (!isset($sourceFiles[$questionIndex])) {
            event(new MoveQuestionEvent(StatusHttp::ERROR, 'Question index out of bounds.', $this->user->id));
            // TODO: Handle error case
            return;
        }
        ClipboardServices::addQuestionAfterChange($destinationExam, $sourceFiles, $questionIndex);
        // Rebuild files for both exams (self-healing indices)
        ClipboardServices::rebuildExamFiles($sourceExam);
        ClipboardServices::rebuildExamFiles($destinationExam);

        event(new MoveQuestionEvent(StatusHttp::SUCCESS, 'Question pasted successfully.', $this->user->id));

    }
}
