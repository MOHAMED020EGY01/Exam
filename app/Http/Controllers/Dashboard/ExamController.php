<?php

namespace App\Http\Controllers\Dashboard;

use App\Helper\MessageFlash;
use App\Http\Controllers\Controller;
use App\Http\Requests\ExamRequest;
use App\Http\Resources\ExamResource;
use App\Models\Course;
use App\Models\Exam;
use App\Services\ExamServices;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ExamController extends Controller
{
    private static function HelperMessageFlash(string $type, string $exam_name, string $courses_name)
    {
        return redirect()
            ->back()
            ->with(MessageFlash::success(
                "$type Exam successfully",
                "$type the exam ($exam_name) in course ($courses_name)",
                201
            ));
    }
    private static function disk()
    {
        return Storage::disk('local');
    }

    public function store(ExamRequest $request, Course $course)
    {
        $user = Auth::user();
        $examFolder = 'exam_' . time();
        $path = "$course->path/$examFolder";
        return DB::transaction(function () use ($request, $course, $user, $path) {
            ExamServices::directoryFindOrCreate($path);
            ExamServices::processExamData($request, $path);

            $filesCount = ExamServices::filterFilesQuestions($path);
            $exam = Exam::create([
                'name' => $request->name,
                'description' => $request->description,
                'user_id' => $user->id,
                'course_id' => $course->id,
                'questions_package' => $path,
                'questions_count' => count($filesCount),
            ]);

            return self::HelperMessageFlash('Create', $exam->name, $course->name);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course, Exam $exam)
    {
        return Inertia::render('dashboard/courses/exams/show', [
            'exam' => ExamResource::make($exam)->resolve(),
        ]);
    }

    public function update(ExamRequest $request, Course $course, Exam $exam)
    {
        return DB::transaction(function () use ($request, $course, $exam) {
            $path = $exam->questions_package;

            ExamServices::processExamData($request, $path);
            $filesCount = ExamServices::filterFilesQuestions($path);
            $exam->update([
                'name' => $request->name,
                'description' => $request->description,
                'questions_count' => count($filesCount),
            ]);

            return self::HelperMessageFlash('Update', $exam->name, $course->name);
        });
    }


    public function destroy(Course $course, Exam $exam)
    {
        return DB::transaction(function () use ($course, $exam) {
            ExamServices::deleteExamPackage($exam);
            $exam->delete($exam->id);
            return self::HelperMessageFlash('Delete', $exam->name, $course->name);
        });
    }

    public function download(Course $course, Exam $exam)
    {
        $file = ExamServices::downloadZipExam($exam);

        if (!$file || !file_exists($file)) {
            return response()->json([
                'message' => 'Zip file not generated'
            ], 500);
        }
        return response()->download(
            $file,
            "{$exam->name}_exam.elr"
        )->deleteFileAfterSend(true);
    }

    public function all()
    {
        return redirect()->route('courses.index');
    }
}
