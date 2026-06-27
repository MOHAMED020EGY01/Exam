<?php

namespace App\Services;

use App\Models\Exam;


class ClipboardServices
{
    public static function naturalSortFiles(array $files): array
    {
        natsort($files);
        return array_values($files);
    }
    public static function addQuestionAfterChange(Exam $exam, array $files, int $questionIndex){
        $questionFile = $files[$questionIndex];

        $destFiles = ExamServices::filterFilesQuestions($exam->questions_package);
        $nextIndex = count($destFiles) + 1;
        $destPath = $exam->questions_package . "/q{$nextIndex}.json";

        // Copy file content to destination
        $content = FileStorageServices::disk()->get($questionFile);
        FileStorageServices::disk()->put($destPath, $content);
    }
    public static function rebuildExamFiles(Exam $exam)
    {
        $path = $exam->questions_package;
        $questionFiles = ExamServices::filterFilesQuestions($path);
        $questionFiles = self::naturalSortFiles($questionFiles);

        $questionAnswerMap = [];
        $questionCounter = 1;
        $tempFiles = [];

        // 1. Copy to temporary files with correct sequential indices to avoid overwriting conflicts during move
        foreach ($questionFiles as $file) {
            $content = FileStorageServices::disk()->get($file);
            $question = json_decode($content, true);

            $tempFilePath = $path . "/temp_q{$questionCounter}.json";
            FileStorageServices::disk()->put($tempFilePath, json_encode($question, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
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
        foreach ($questionFiles as $file) {
            FileStorageServices::disk()->delete($file);
        }

        // 3. Move temporary sequential files to real question files
        $counter = 1;
        foreach ($tempFiles as $tempFile) {
            $realFilePath = $path . "/q{$counter}.json";
            FileStorageServices::disk()->move($tempFile, $realFilePath);
            $counter++;
        }

        // 4. Save new answer.json and meta files
        $answerString = implode(';', $questionAnswerMap);
        FileStorageServices::disk()->put(
            $path . "/answer.json",
            json_encode($answerString, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR)
        );

        // Write meta file
        $bytes = pack("N", count($tempFiles));
        FileStorageServices::disk()->put($path . "/meta", $bytes);

        // 5. Update database questions count
        $exam->update([
            'questions_count' => count($tempFiles),
        ]);
    }
}
