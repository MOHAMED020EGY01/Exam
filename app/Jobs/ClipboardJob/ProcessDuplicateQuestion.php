<?php

namespace App\Jobs\ClipboardJob;

use App\Enums\StatusHttp;
use App\Events\ClipboardEvent\DuplicateQuestionEvent;
use App\Models\Exam;
use App\Models\User;
use App\Services\ClipboardServices;
use App\Services\ExamServices;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\SerializesModels;

class ProcessDuplicateQuestion implements ShouldQueue
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
        $exam = Exam::where('id', '=', $this->requestData['exam_id'], 'and')->where('user_id', $this->user->id)->firstOrFail();

        // Retrieve files
        $files = ExamServices::filterFilesQuestions($exam->questions_package);
        $files = ClipboardServices::naturalSortFiles($files);

        $questionIndex = (int)$this->requestData['question_index'];
        if (!isset($files[$questionIndex])) {
            event(new DuplicateQuestionEvent(StatusHttp::ERROR, 'Question index out of bounds.', $this->user->id));
            // TODO: Handle error case
            return;
        }
        ClipboardServices::addQuestionAfterChange($exam, $files, $questionIndex);
        // Rebuild files
        ClipboardServices::rebuildExamFiles($exam);

        event(new  DuplicateQuestionEvent(StatusHttp::SUCCESS, 'Question duplicated successfully.', $this->user->id));

    }
}
