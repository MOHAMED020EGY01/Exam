<?php

namespace App\Http\Controllers\Dashboard\Clipboard;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Services\ExamServices;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class QuestionCliboardController extends Controller
{
    private static function disk()
    {
        return Storage::disk('local');
    }


    /**
     * Copy a question from a source exam and paste it into a destination exam.
     */
    public function pasteQuestion(Request $request){
        $request->validate([
            'source_exam_id' => 'required|exists:exams,id',
            'question_index' => 'required|integer|min:0',
            'destination_exam_id' => 'required|exists:exams,id',
        ]);

        $user = Auth::user();
        $sourceExam = Exam::where('id', '=', $request->source_exam_id,'and')->where('user_id', $user->id)->firstOrFail();
        $destinationExam = Exam::where('id', '=',$request->destination_exam_id,'and')->where('user_id', $user->id)->firstOrFail();

        // Retrieve source files
        $sourceFiles = ExamServices::filterFilesQuestions($sourceExam->questions_package);
        natsort($sourceFiles);
        $sourceFiles = array_values($sourceFiles);

        $questionIndex = (int)$request->question_index;
        if (!isset($sourceFiles[$questionIndex])) {
            return back()->with('error', 'Question index out of bounds.');
        }

        $sourceQuestionFile = $sourceFiles[$questionIndex];

        return DB::transaction(function () use ($sourceQuestionFile, $destinationExam) {
            $destFiles = ExamServices::filterFilesQuestions($destinationExam->questions_package);
            $nextIndex = count($destFiles) + 1;
            $destPath = $destinationExam->questions_package . "/q{$nextIndex}.json";

            // Copy file content
            $content = self::disk()->get($sourceQuestionFile);
            self::disk()->put($destPath, $content);

            // Rebuild destination files
            $this->rebuildExamFiles($destinationExam);

            return redirect()->back()->with('success', 'Question pasted successfully.');
        });
    }

        /**
     * Move a question from a source exam to a destination exam.
     */
    public function moveQuestion(Request $request){
        $request->validate([
            'source_exam_id' => 'required|exists:exams,id',
            'question_index' => 'required|integer|min:0',
            'destination_exam_id' => 'required|exists:exams,id',
        ]);

        $user = Auth::user();
        $sourceExam = Exam::where('id', '=',$request->source_exam_id,'and')->where('user_id', $user->id)->firstOrFail();
        $destinationExam = Exam::where('id', '=',$request->destination_exam_id,'and')->where('user_id', $user->id)->firstOrFail();

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

        $sourceQuestionFile = $sourceFiles[$questionIndex];

        return DB::transaction(function () use ($sourceExam, $sourceQuestionFile, $destinationExam) {
            $destFiles = ExamServices::filterFilesQuestions($destinationExam->questions_package);
            $nextIndex = count($destFiles) + 1;
            $destPath = $destinationExam->questions_package . "/q{$nextIndex}.json";

            // Copy file content to destination
            $content = self::disk()->get($sourceQuestionFile);
            self::disk()->put($destPath, $content);

            // Delete from source
            self::disk()->delete($sourceQuestionFile);

            // Rebuild files for both exams (self-healing indices)
            $this->rebuildExamFiles($sourceExam);
            $this->rebuildExamFiles($destinationExam);

            return redirect()->back()->with('success', 'Question moved successfully.');
        });
    }
    /**
     * Duplicate a question inside the same exam.
     */
    public function duplicateQuestion(Request $request){
        $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'question_index' => 'required|integer|min:0',
        ]);

        $user = Auth::user();
        $exam = Exam::where('id', '=' ,$request->exam_id,'and')->where('user_id', $user->id)->firstOrFail();

        // Retrieve files
        $files = ExamServices::filterFilesQuestions($exam->questions_package);
        natsort($files);
        $files = array_values($files);

        $questionIndex = (int)$request->question_index;
        if (!isset($files[$questionIndex])) {
            return back()->with('error', 'Question index out of bounds.');
        }

        $questionFile = $files[$questionIndex];

        return DB::transaction(function () use ($exam, $questionFile) {
            $files = ExamServices::filterFilesQuestions($exam->questions_package);
            $nextIndex = count($files) + 1;
            $destPath = $exam->questions_package . "/q{$nextIndex}.json";

            // Copy file content
            $content = self::disk()->get($questionFile);
            self::disk()->put($destPath, $content);

            // Rebuild files
            $this->rebuildExamFiles($exam);

            return redirect()->back()->with('success', 'Question duplicated successfully.');
        });
    }

    /**
     * Rebuild questions package indices, answer.json, and meta files, resolving any gaps.
     */
    private function rebuildExamFiles(Exam $exam){
        $path = $exam->questions_package;
        $qFiles = ExamServices::filterFilesQuestions($path);
        natsort($qFiles);
        $qFiles = array_values($qFiles);

        $questionAnswerMap = [];
        $questionCounter = 1;
        $tempFiles = [];

        // 1. Copy to temporary files with correct sequential indices to avoid overwriting conflicts during move
        foreach ($qFiles as $file) {
            $content = self::disk()->get($file);
            $question = json_decode($content, true);

            $tempFilePath = $path . "/temp_q{$questionCounter}.json";
            self::disk()->put($tempFilePath, json_encode($question, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            $tempFiles[] = $tempFilePath;

            // Accumulate answers map
            $correctIndexes = [];
            if (isset($question['answers']) && is_array($question['answers'])) {
                foreach ($question['answers'] as $aIndex => $answer) {
                    if (!empty($answer['is_correct'])) {
                        $correctIndexes[] = $aIndex;
                    }
                }
            }
            $questionAnswerMap[] = $questionCounter . ':' . implode(',', $correctIndexes);
            $questionCounter++;
        }

        // 2. Clear old sequential files
        foreach ($qFiles as $file) {
            self::disk()->delete($file);
        }

        // 3. Move temporary sequential files to real question files
        $counter = 1;
        foreach ($tempFiles as $tempFile) {
            $realFilePath = $path . "/q{$counter}.json";
            self::disk()->move($tempFile, $realFilePath);
            $counter++;
        }

        // 4. Save new answer.json and meta files
        $answerString = implode(';', $questionAnswerMap);
        self::disk()->put(
            $path . "/answer.json",
            json_encode($answerString, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR)
        );

        // Write meta file
        $bytes = pack("N", count($tempFiles));
        self::disk()->put($path . "/meta", $bytes);

        // 5. Update database questions count
        $exam->update([
            'questions_count' => count($tempFiles),
        ]);
    }

    /**
     * Delete a question from an exam and re-index.
     */
    public function deleteQuestion(Request $request){
        $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'question_index' => 'required|integer|min:0',
        ]);

        $user = Auth::user();
        $exam = Exam::where('id', '=',$request->exam_id,'and')->where('user_id', $user->id)->firstOrFail();

        // Retrieve files
        $files = ExamServices::filterFilesQuestions($exam->questions_package);
        natsort($files);
        $files = array_values($files);

        $questionIndex = (int)$request->question_index;
        if (!isset($files[$questionIndex])) {
            return back()->with('error', 'Question index out of bounds.');
        }

        return DB::transaction(function () use ($exam, $files, $questionIndex) {
            self::disk()->delete($files[$questionIndex]);
            $this->rebuildExamFiles($exam);

            return redirect()->back()->with('success', 'Question deleted successfully.');
        });
    }
}
