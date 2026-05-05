<?php

namespace App\Http\Controllers\Api\Exam;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExamApiResource;
use App\Models\Exam;
use App\Services\ExamServices;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use ZipArchive;
use Nette\Utils\Json;
class ExamController extends Controller
{

    private static function disk()
    {
        return Storage::disk('local');
    }
    public function index()
    {
        $user = Auth::user();
        $exams = Exam::where('user_id', '=', $user->id, 'and')->with('course', 'user')->paginate(8)->withQueryString();
        return response()->json([
            'exams' => ExamApiResource::collection($exams)->resolve(),
            'links' => $exams->linkCollection()->toArray()
        ]);
    }
    public function downloadQuestions(string $id)
    {
        $user = Auth::user();
        $exam = Exam::where('user_id', '=', $user->id, 'and')->where('id', '=', $id)->first();

         if (!$exam) {
            return response()->json(['message' => 'Exam not found'], 404);
        }

        if (!$exam) {
            return response()->json(['message' => 'Exam not found'], 404);
        }

        if ($exam->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $folderPath = $exam->questions_package;

        if (!self::disk()->exists($folderPath)) {
            return response()->json(['message' => 'Folder not found'], 404);
        }

        $files = self::disk()->files($folderPath);
        $questionsFiles = ExamServices::filterFilesQuestions($folderPath);

        foreach ($questionsFiles as $file) {
            Json::decode(self::disk()->get($file));

        }
        $fileName = 'exam_' . $exam->name;
        $zipFilePath = storage_path("app/{$fileName}.zip");

        $zip = new ZipArchive;

        if ($zip->open($zipFilePath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            return response()->json(['message' => 'Cannot create zip file'], 500);
        }

        foreach ($files as $file) {

            $fullPath = storage_path('app/' . $file);

            $relativeName = basename($file);

            $zip->addFile($fullPath, $relativeName);
        }
        $zip->close();

        return response()->download(
            $zipFilePath,
            "{$fileName}.zip"
        )->deleteFileAfterSend(true);
    }
}
