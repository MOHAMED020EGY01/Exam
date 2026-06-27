<?php

namespace App\Jobs\ClipboardJob;

use App\Enums\StatusHttp;
use App\Events\ClipboardEvent\DeleteQuestionEvent;
use App\Models\Exam;
use App\Models\User;
use App\Services\ClipboardServices;
use App\Services\ExamServices;
use App\Services\FileStorageServices;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\SerializesModels;

class ProcessDeleteQuestion implements ShouldQueue
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
        $exam = Exam::where('id', '=', $this->requestData['exam_id'], 'and')->where('user_id', $this->user->id)->firstOrFail();

        // Retrieve files
        $files = ExamServices::filterFilesQuestions($exam->questions_package);
        $files = ClipboardServices::naturalSortFiles($files);

        $questionIndex = (int)$this->requestData['question_index'];
        if (!isset($files[$questionIndex])) {
            event(new  DeleteQuestionEvent(StatusHttp::ERROR, 'Question not found.', $this->user->id));
            return;
        }

        // Delete the question file
        FileStorageServices::disk()->delete($files[$questionIndex]);
        ClipboardServices::rebuildExamFiles($exam);

        event(new  DeleteQuestionEvent(StatusHttp::SUCCESS, 'Question deleted successfully.', $this->user->id));
    }
}
