<?php

namespace App\Services;

use App\Models\Exam;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\JpegEncoder;
use ZipArchive;

class ExamServices
{
    private static function disk()
    {
        return Storage::disk('local');
    }

    private static function metaFile(int $n_of_question, string $path)
    {
        $bytes = pack("N", $n_of_question);
        self::disk()->put($path . "/meta", $bytes);
    }
    public static function filterFilesQuestions(string $path)
    {
        $allFiles = self::disk()->files($path);
        $qFiles = array_filter($allFiles, function ($file) {
            return preg_match('/\/q\d+\.json$/', $file);
        });
        return $qFiles;
    }
    public static function directoryFindOrCreate(string $path)
    {
        if (!self::disk()->exists($path)) {
            self::disk()->makeDirectory($path);
        }
    }
    public static function processExamData(array $request, string $path, $exam = null)
    {
        $processedQuestions = [];
        $questionAnswerMap = [];
        $questionCounter = 1;

        foreach ($request["questions"] as $qIndex => $question) {

            $answers = [];
            $correctIndexes = [];

            if (isset($question['image']) && !is_string($question['image'])) {
                $question['image'] = self::compressImageConvertBase64($question['image']);
            }

            foreach ($question['answers'] as $aIndex => $answer) {

                if (isset($answer['image']) && !is_string($answer['image'])) {
                    $answer['image'] = self::compressImageConvertBase64($answer['image']);
                }

                $answers[] = [
                    'text' => $answer['text'],
                    'image' => $answer['image'] ?? null,
                    'is_correct' => (bool) $answer['is_correct'],
                ];

                if (!empty($answer['is_correct'])) {
                    $correctIndexes[] = $aIndex;
                }
            }

            $processedQuestions = [
                'text' => $question['text'],
                'image' => $question['image'] ?? null,
                'multiple' => (bool) $question['multiple'],
                'answers' => $answers,
            ];
            ExamServices::saveFile(
                $path . "/q{$questionCounter}.json",
                $processedQuestions
            );
            $questionAnswerMap[] = $questionCounter . ':' . implode(',', $correctIndexes);
            $questionCounter++;
        }

        $answerString = implode(';', $questionAnswerMap);

        ExamServices::saveFile(
            $path . "/answer.json",
            $answerString
        );
        self::metaFile(count($request["questions"]), $path);
    }

    public static function saveFile(string $jsonPath, array|string $processedQuestions)
    {
        self::disk()->put(
            $jsonPath,
            json_encode($processedQuestions, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR)
        );
    }
    public static function responseFileJson(string $questions_package)
    {
        if (self::disk()->exists($questions_package)) {
            $qFiles = self::filterFilesQuestions($questions_package);
            natsort($qFiles);
            $merged = [];
            foreach ($qFiles as $file) {
                $content = self::disk()->get($file);
                $json = json_decode($content, true);
                if ($json !== null) {
                    $merged[] = $json;
                }
            }
            return $merged;
        }
        return null;
    }

    public static function deleteExamPackage(Exam $exam)
    {
        $path = $exam->questions_package;
        if (self::disk()->exists($path)) {
            self::disk()->deleteDirectory($path);
        }
    }
    public static function compressImageConvertBase64(UploadedFile $image)
    {
        if ($image instanceof UploadedFile) {
            $manager = new ImageManager(new Driver());
            $imageCompress = $manager->read($image->getRealPath());
            $encoded = $imageCompress->encode(new JpegEncoder(quality: 65));
            $base64 = base64_encode($encoded->toString());
            return "data:jpeg;base64,$base64";
        }
        return null;
    }

    public static function downloadZipExam(Exam $exam)
    {
        $folderPath = $exam->questions_package;
        if (!self::disk()->exists($folderPath)) {
            return null;
        }
        $files = self::disk()->files($folderPath);
        $zipFilePath = storage_path("app/{$exam->name}_exam.elr");

        $zip = new ZipArchive;

        if ($zip->open($zipFilePath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            return null;
        }

        foreach ($files as $file) {
            $filename = basename($file);
            if (preg_match('/^q\d+\.json$/', $filename)) {

                $content = self::disk()->get($file);
                $json = json_decode($content, true);

                if ($json) {

                    $json['isSingleSelection'] = !$json['multiple'];
                    unset($json['multiple']);

                    if (isset($json['answers']) && is_array($json['answers'])) {
                        foreach ($json['answers'] as &$answer) {
                            unset($answer['is_correct']);
                        }
                    }

                    $content = json_encode($json, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
                }
                $zip->addFromString($filename, $content);
            } else {
                $zip->addFile(self::disk()->path($file), $filename);
            }
        }
        $zip->close();

        return $zipFilePath;
    }
}