<?php

namespace App\Http\Controllers\Dashboard\Clipboard;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Services\ClipboardServices;
use App\Services\ExamServices;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class QuestionClipboardController extends Controller
{
    private static function disk()
    {
        return Storage::disk('local');
    }

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
        $request->validate($this->validatorQuestion);
        $user = Auth::user();
        $sourceExam = Exam::where('id', '=', $request->source_exam_id, 'and')->where('user_id', $user->id)->firstOrFail();
        $destinationExam = Exam::where('id', '=', $request->destination_exam_id, 'and')->where('user_id', $user->id)->firstOrFail();

        // Retrieve source files
        $sourceFiles = ExamServices::filterFilesQuestions($sourceExam->questions_package);
        $sourceFiles = ClipboardServices::naturalSortFiles($sourceFiles);

        $questionIndex = (int)$request->question_index;
        if (!isset($sourceFiles[$questionIndex])) {
            return back()->with('error', 'Question index out of bounds.');
        }

        ClipboardServices::addQuestionAfterChange($destinationExam, $sourceFiles, $questionIndex);
        // Rebuild destination files
        ClipboardServices::rebuildExamFiles($destinationExam);

        return redirect()->back()->with('success', 'Question pasted successfully.');
    }

    /**
     * Move a question from a source exam to a destination exam.
     */
    public function moveQuestion(Request $request)
    {
        $request->validate($this->validatorQuestion);

        $user = Auth::user();
        $sourceExam = Exam::where('id', '=', $request->source_exam_id, 'and')->where('user_id', $user->id)->firstOrFail();
        $destinationExam = Exam::where('id', '=', $request->destination_exam_id, 'and')->where('user_id', $user->id)->firstOrFail();

        if ($sourceExam->id === $destinationExam->id) {
            return back()->with('error', 'Cannot move a question to the exact same exam.');
        }

        // Retrieve source files
        $sourceFiles = ExamServices::filterFilesQuestions($sourceExam->questions_package);
        natsort($sourceFiles);
        $sourceFiles = array_values($sourceFiles);

        $questionIndex = (int)$request->question_index;
        if (!isset($sourceFiles[$questionIndex])) {
            return back()->with('error', 'Question index out of bounds.');
        }
        ClipboardServices::addQuestionAfterChange($destinationExam, $sourceFiles, $questionIndex);
        // Rebuild files for both exams (self-healing indices)
        ClipboardServices::rebuildExamFiles($sourceExam);
        ClipboardServices::rebuildExamFiles($destinationExam);

        return redirect()->back()->with('success', 'Question moved successfully.');
    }
    /**
     * Duplicate a question inside the same exam.
     */
    public function duplicateQuestion(Request $request)
    {
        $request->validate($this->validatorQuestionExam_id);
        $user = Auth::user();
        $exam = Exam::where('id', '=', $request->exam_id, 'and')->where('user_id', $user->id)->firstOrFail();

        // Retrieve files
        $files = ExamServices::filterFilesQuestions($exam->questions_package);
        natsort($files);
        $files = array_values($files);

        $questionIndex = (int)$request->question_index;
        if (!isset($files[$questionIndex])) {
            return back()->with('error', 'Question index out of bounds.');
        }
        ClipboardServices::addQuestionAfterChange($exam, $files, $questionIndex);
        // Rebuild files
        ClipboardServices::rebuildExamFiles($exam);

        return redirect()->back()->with('success', 'Question duplicated successfully.');
    }

    /**
     * Delete a question from an exam and re-index.
     */
    public function deleteQuestion(Request $request)
    {
        $request->validate($this->validatorQuestionExam_id);

        $user = Auth::user();
        $exam = Exam::where('id', '=', $request->exam_id, 'and')->where('user_id', $user->id)->firstOrFail();

        // Retrieve files
        $files = ExamServices::filterFilesQuestions($exam->questions_package);
        $files = ClipboardServices::naturalSortFiles($files);

        $questionIndex = (int)$request->question_index;
        if (!isset($files[$questionIndex])) {
            return back()->with('error', 'Question index out of bounds.');
        }

        self::disk()->delete($files[$questionIndex]);
        ClipboardServices::rebuildExamFiles($exam);

        return redirect()->back()->with('success', 'Question deleted successfully.');
    }

    /**
     * Rebuild questions package indices, answer.json, and meta files, resolving any gaps.
     */
}
