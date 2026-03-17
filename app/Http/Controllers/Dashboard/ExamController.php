<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Exam;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ExamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Auth $user, Course $course)
    {
        $exam = Exam::where('course_id', $course->id)->get();
        return Inertia::render('dashboard.exams.index', [
            'exams' => $exam,
        ]);
    }



    public function store(Request $request, Course $course)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'questions' => 'required|array|min:1',

            'questions.*.text' => 'required|string',
            'questions.*.multiple' => 'required|boolean',
            'questions.*.answers' => 'required|array|min:2|contains:is_correct',
            'questions.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'questions.*.answers.*.text' => 'required|string',
            'questions.*.answers.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'questions.*.answers.*.is_correct' => 'required|boolean',
        ]);

        $user = Auth::user();
        $userSlug = Str::slug($user->name . '_' . $user->id);
        $courseSlug = Str::slug($course->name . '_' . $course->id);
        $examFolder = 'exam_' . time();

        $baseDirectory = storage_path("app/public/users/{$userSlug}/{$courseSlug}/{$examFolder}");

        if (!File::exists($baseDirectory)) {
            File::makeDirectory($baseDirectory, 0755, true, true);
        }

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


            if (isset($question['image']) && $question['image'] instanceof UploadedFile) {
                $imageContent = file_get_contents($question['image']->getRealPath());
                $questionData['image'] = base64_encode($imageContent);
            }

            $processedQuestions[] = $questionData;
        }

        $jsonPath = $baseDirectory . '/questions.json';
        File::put($jsonPath, json_encode($processedQuestions, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR));

        Exam::create([
            'name' => $request->name,
            'course_id' => $course->id,
            'questions_package' => "{$userSlug}/{$courseSlug}/{$examFolder}",
            'questions_count' => count($processedQuestions),
        ]);

        return redirect()->back()->with('success', 'Create Exam successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course, Exam $exam) {}



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,)
    {
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
