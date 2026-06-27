<?php

namespace App\Http\Controllers\Dashboard\Clipboard;

use App\Http\Controllers\Controller;
use App\Jobs\ClipboardJob\ProcessDeleteQuestion;
use App\Jobs\ClipboardJob\ProcessDuplicateQuestion;
use App\Jobs\ClipboardJob\ProcessJobMoveQuestion;
use App\Jobs\ClipboardJob\ProcessJobPasteQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuestionClipboardController extends Controller
{
    private array $validatorQuestion = [
        'source_exam_id' => 'required|exists:exams,id',
        'question_index' => 'required|integer|min:0',
        'destination_exam_id' => 'required|exists:exams,id',
    ];
    private array $validatorQuestionExam_id = [
        'exam_id' => 'required|exists:exams,id',
        'question_index' => 'required|integer|min:0',
    ];
    /**
     * Copy a question from a source exam and paste it into a destination exam.
     */
    public function pasteQuestion(Request $request)
    {
        $validatedData = $request->validate($this->validatorQuestion);
        $user = Auth::user();
        ProcessJobPasteQuestion::dispatch($user, $validatedData);

        return redirect()->back()->with('success', 'Question pasted successfully.');
    }

    /**
     * Move a question from a source exam to a destination exam.
     */
    public function moveQuestion(Request $request)
    {
        $request->validate($this->validatorQuestion);

        $user = Auth::user();
        $validatedData = $request->validate($this->validatorQuestion);
        ProcessJobMoveQuestion::dispatch($user, $validatedData);

        return redirect()->back()->with('success', 'Question moved successfully.');
    }
    /**
     * Duplicate a question inside the same exam.
     */
    public function duplicateQuestion(Request $request)
    {
        $request->validate($this->validatorQuestionExam_id);
        $user = Auth::user();
        $validatedData = $request->validate($this->validatorQuestionExam_id);
        ProcessDuplicateQuestion::dispatch($user, $validatedData);

        return redirect()->back()->with('success', 'Question duplicated successfully.');
    }

    /**
     * Delete a question from an exam and re-index.
     */
    public function deleteQuestion(Request $request)
    {
        $request->validate($this->validatorQuestionExam_id);
        $validatedData = $request->validate($this->validatorQuestionExam_id);

        $user = Auth::user();
        ProcessDeleteQuestion::dispatch($user, $validatedData);

        return redirect()->back()->with('success', 'Question deleted successfully.');
    }

    /**
     * Rebuild questions package indices, answer.json, and meta files, resolving any gaps.
     */
}
