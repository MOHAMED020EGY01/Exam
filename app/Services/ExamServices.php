<?php

namespace App\Services;


use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
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

        foreach ($request->questions as $question) {
            $answers = [];

            if (isset($question['image']) && !is_string($question['image'])) {
                $question['image'] = self::compressImageConvertBase64($question['image']);
            }

            foreach ($question['answers'] as $answer) {
                if (isset($answer['image']) && !is_string($answer['image'])) {
                    $answer['image'] = self::compressImageConvertBase64($answer['image']);
                }
                $answerData = [
                    'text' => $answer['text'],
                    'image' => $answer['image'] ?? null,
                    'is_correct' => (bool) $answer['is_correct'],
                ];

                $answers[] = $answerData;
            }

            $processedQuestions[] = [
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

            // read image
            $imageCompress = $manager->read($image->getRealPath());

            // encode as JPEG
            $encoded = $imageCompress->encode(new JpegEncoder(quality: 65));

            // base64
            $base64 = base64_encode($encoded->toString());

            $mime = $image->getMimeType();

            return "data:$mime;base64,$base64";
        }

        return null;
    }
}
