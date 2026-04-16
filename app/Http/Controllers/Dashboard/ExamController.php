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
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ExamController extends Controller
{
    private static function HelperMessageFlash($type, $exam_name, $courses_name)
    {
        return redirect()
            ->back()
            ->with(MessageFlash::success(
                "$type Exam successfully",
                "$type the exam ($exam_name) in course ($courses_name)",
                201
            ));
    }
    private static function disk(){
        return Storage::disk('local');
    }

    public function store(ExamRequest $request, Course $course)
    {
        $user = Auth::user();
        $userSlug = Str::slug($user->name . '_' . $user->id);
        $courseSlug = Str::slug($course->name . '_' . $course->id);
        $examFolder = 'exam_' . time();

        return DB::transaction(function () use ($request, $course, $user, $userSlug, $courseSlug, $examFolder) {
            $baseDirectory = self::disk()->path("users/{$userSlug}/{$courseSlug}/{$examFolder}");
            if (!File::exists($baseDirectory)) {
                File::makeDirectory($baseDirectory, 0755, true, true);
            }
            $processedQuestions = ExamServices::processExamData($request);
            $jsonPath = $baseDirectory . '/questions.json';
            ExamServices::saveFile($jsonPath, $processedQuestions);
            $exam = Exam::create([
                'name' => $request->name,
                'description' => $request->description,
                'user_id' => $user->id,
                'course_id' => $course->id,
                'questions_package' => "users/{$userSlug}/{$courseSlug}/{$examFolder}/questions.json",
                'questions_count' => count($processedQuestions),
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
            $baseDirectory = self::disk()->path($exam->questions_package);
            if (!File::exists($baseDirectory)) {
                File::makeDirectory($baseDirectory, 0755, true, true);
            }
            $processedQuestions = ExamServices::processExamData($request,$exam);

            $jsonPath = $baseDirectory;
            ExamServices::saveFile($jsonPath, $processedQuestions);
            $exam->update([
                'name' => $request->name,
                'description' => $request->description,
                'questions_count' => count($processedQuestions),
            ]);

            return self::HelperMessageFlash('Update', $exam->name, $course->name);
        });
    }


    public function destroy(Course $course, Exam $exam)
    {
        return DB::transaction(function () use ($course, $exam) {
            ExamServices::deleteExamPackage($exam);
            $exam->delete();
            return self::HelperMessageFlash('Delete', $exam->name, $course->name);
        });
    }
    public function all(){
        $user = Auth::user();
        $exams = Exam::where('user_id' , '=' , $user->id)->paginate(10)->withQueryString();
        return Inertia::render('dashboard/courses/exams/all',[
            'exams' =>  ExamResource::collection($exams)->resolve(),
            'links' => $exams->linkCollection()->toArray(),
        ]);
    }
}
