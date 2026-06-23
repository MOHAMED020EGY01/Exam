<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExamRequest;
use App\Jobs\ExamJob\ProcessExamJobCreate;
use App\Jobs\ExamJob\ProcessExamJobDelete;
use App\Jobs\ExamJob\ProcessExamJobUpdate;
use App\Models\Course;
use App\Models\Exam;
use App\Services\ExamServices;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ExamController extends Controller
{

    public function store(ExamRequest $request, Course $course)
    {
        $user = Auth::user();
        $examFolder = 'exam_' . time();
        $path = "{$course->path}/{$examFolder}";
        $requestDate = $request->validated();
        ProcessExamJobCreate::dispatch(
            $requestDate,
            $course,
            $user,
            $path
        );

        return redirect()->back()->with('success', "Create Exam in Process {$requestDate['name']} ");
    }
    public function update(ExamRequest $request, Course $course, Exam $exam)
    {
        $path = $exam->questions_package;
        $requestDate = $request->validated();
        ProcessExamJobUpdate::dispatch(
            $requestDate,
            $exam,
            $path
        );
        return redirect()->back()->with('success', "Update Exam in Process {$exam->name} in course {$course->name}");
    }


    public function destroy(Course $course, Exam $exam)
    {
        return DB::transaction(function () use ($course, $exam) {
            
            ProcessExamJobDelete::dispatch(
                $exam,
            );
            $exam->delete($exam->id);
            return redirect()->back()->with('success', "Delete Exam in Process {$exam->name} in course {$course->name} ");
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
}
