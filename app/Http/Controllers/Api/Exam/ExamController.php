<?php

namespace App\Http\Controllers\Api\Exam;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExamApiResource;
use App\Models\Exam;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

class ExamController extends Controller
{

    private static function disk()
    {
        return Storage::disk('local');
    }
    public function index()
    {
        $user = Auth::user();
        $exams = Exam::where('user_id', '=', $user->id)->with('course', 'user')->paginate(8)->withQueryString();
        return response()->json([
            'exams' => ExamApiResource::collection($exams)->resolve(),
            'links' => $exams->linkCollection()->toArray()
        ]);
    }
    public function downloadQuestions(string $id)
    {
        $user = Auth::user();
        $exam = Exam::find($id);

        if (!$exam) {
            return response()->json([
                'message' => 'Exam not found'
            ], 404);
        }
        if ($exam->user_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }
        $fileName = 'exam_' . $exam->name . '.json';
        if (!self::disk()->exists($exam->questions_package)) {
            return response()->json([
                'message' => 'File not found'
            ], 404);
        }
        $jsonData = self::disk()->get($exam->questions_package);

        $fileName = 'exam_' . $exam->name;
        $jsonFilePath = storage_path("app/{$fileName}.json");
        $zipFilePath  = storage_path("app/{$fileName}.zip");

        file_put_contents($jsonFilePath, $jsonData);

        $zip = new ZipArchive;

        if ($zip->open($zipFilePath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            return response()->json(['message' => 'Cannot create zip file'], 500);
        }

        $zip->addFile($jsonFilePath, "{$fileName}.json");
        $zip->close();

        unlink($jsonFilePath);

        return response()->download(
            $zipFilePath,
            "{$fileName}.zip"
        )->deleteFileAfterSend(true);
    }
}
