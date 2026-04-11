<?php
namespace App\Services;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
class ExamServices
{
    private static $basePath = 'storage/';
    public static function processExamData($request)
    {
        $processedQuestions = [];
        foreach ($request->questions as $question) {
            $answers = [];
            foreach ($question['answers'] as $answer) {

                $answerData = [
                    'text' => $answer['text'],
                    'image' => null,
                    'is_correct' => $answer['is_correct'],
                ];

                if (isset($answer['image']) && $answer['image'] instanceof UploadedFile) {
                    $imageContent = file_get_contents($answer['image']->getRealPath());
                    $answerData['image'] = base64_encode($imageContent);
                }

                $answers[] = $answerData;
            }
            $questionData = [
                'text' => $question['text'],
                'multiple' => $question['multiple'],
                'answers' => $answers,
                'image' => null,
            ];
            $processedQuestions[] = $questionData;
        }
        return $processedQuestions;
    }
    public static function saveFile($jsonPath, $processedQuestions)
    {
        File::put(
            $jsonPath,
            json_encode($processedQuestions, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR)
        );
    }
    public static function responseFileJson($questions_package)
    {

        $question = $questions_package;
        if (File::exists(self::$basePath . $question)) {
            $questionContent = file_get_contents(self::$basePath . $question);
        } else {
            $questionContent = null;
        }
        return $questionContent;
    }

    public static function deleteExamPackage($exam)
    {
        $oldPackagePath = public_path('storage/' . $exam->questions_package);
        if (File::exists($oldPackagePath)) {
            File::delete($oldPackagePath);
            $oldDirectory = dirname($oldPackagePath);
            if (File::exists($oldDirectory)) {
                File::deleteDirectory($oldDirectory);
            }
        }
    }
}
