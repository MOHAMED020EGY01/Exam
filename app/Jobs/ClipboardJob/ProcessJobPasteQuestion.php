<?php

namespace App\Jobs\ClipboardJob;

use App\Enums\StatusHttp;
use App\Events\ClipboardEvent\PasteQuestionEvent;
use App\Models\Exam;
use App\Models\User;
use App\Services\ClipboardServices;
use App\Services\ExamServices;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessJobPasteQuestion implements ShouldQueue
{
    use Queueable , SerializesModels;
    private User $user;
    private array $requestData;
    public function __construct(User $user, array $requestData)
    {
        $this->user = $user;
        $this->requestData = $requestData;
    }

    public function handle(): void
    {
        $sourceExam = Exam::where('id', '=', $this->requestData['source_exam_id'], 'and')->where('user_id', $this->user->id)->firstOrFail();
        $destinationExam = Exam::where('id', '=', $this->requestData['destination_exam_id'], 'and')->where('user_id', $this->user->id)->firstOrFail();

        if ($sourceExam->id === $destinationExam->id) {
            event(new PasteQuestionEvent(StatusHttp::ERROR, 'Cannot move a question to the exact same exam.', $this->user->id));
            // TODO: Handle error case
            return;
        }
        // Retrieve source files
        $sourceFiles = ExamServices::filterFilesQuestions($sourceExam->questions_package);
        $sourceFiles = ClipboardServices::naturalSortFiles($sourceFiles);

        $questionIndex = (int)$this->requestData['question_index'];
        if (!isset($sourceFiles[$questionIndex])) {
            event(new PasteQuestionEvent(StatusHttp::ERROR, 'Question index out of bounds.', $this->user->id));
            // TODO: Handle error case
            return;
        }
        ClipboardServices::addQuestionAfterChange($destinationExam, $sourceFiles, $questionIndex);
        // Rebuild destination files
        ClipboardServices::rebuildExamFiles($destinationExam);

        event(new PasteQuestionEvent(StatusHttp::SUCCESS, 'Question pasted successfully.', $this->user->id));

    }
}
