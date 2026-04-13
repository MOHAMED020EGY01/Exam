<?php

namespace App\Services;


use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\JpegEncoder;

class ExamServices
{
    private static function disk()
    {
        return Storage::disk('local');
    }
    public static function processExamData($request, $exam = null)
    {
        $processedQuestions = [];
        $usedIds = [];
        if ($exam) {
            $getOldQuestions = self::disk()->get($exam->questions_package);
            $oldQuestions = json_decode($getOldQuestions, true);
            $usedIds = collect($oldQuestions)->pluck('id')->toArray();
        }
        foreach ($request->questions as $question) {
            $questionId = $question['id'] ?? null;
            if (!$questionId || !in_array($questionId, $usedIds)) {
                $questionId = Str::uuid()->toString();
            }
            $answers = [];

            if (isset($question['image']) && $question['image']) {
                $question['image'] = self::compressImageConvertBase64($question['image']);
            } else {
                if ($exam) {
                    $oldQuestion = collect($oldQuestions)?->firstWhere('id', $questionId);
                    $question['image'] = $oldQuestion['image'] ?? null;
                }
            }

            foreach ($question['answers'] as $answer) {
                $answerData = [
                    'text' => $answer['text'],
                    'image' => isset($answer['image'])
                        ? self::compressImageConvertBase64($answer['image'])
                        : null,
                    'is_correct' => (bool) $answer['is_correct'],
                ];

                $answers[] = $answerData;
            }

            $processedQuestions[] = [
                'id' => $questionId,
                'text' => $question['text'],
                'multiple' => (bool) $question['multiple'],
                'answers' => $answers,
                'image' => $question['image'] ?? null,
            ];
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
        if (self::disk()->exists($question)) {
            $questionContent = self::disk()->get($question);
        } else {
            $questionContent = null;
        }
        return $questionContent;
    }

    public static function deleteExamPackage($exam)
    {
        $oldPackagePath = $exam->questions_package;
        if (self::disk()->exists($oldPackagePath)) {
            self::disk()->delete($oldPackagePath);
            $oldDirectory = dirname($oldPackagePath);
            if (self::disk()->exists($oldDirectory)) {
                self::disk()->deleteDirectory($oldDirectory);
            }
        }
    }

    public static function compressImageConvertBase64($image)
    {
        if ($image instanceof UploadedFile) {

            $manager = new ImageManager(new Driver());

            // قراءة الصورة
            $imageCompress = $manager->read($image->getRealPath());

            // ضغط وتحويل إلى JPEG
            $encoded = $imageCompress->encode(new JpegEncoder(quality: 65));

            // تحويل مباشرة إلى Base64
            return base64_encode($encoded->toString());
        }
        return null;
    }
}
