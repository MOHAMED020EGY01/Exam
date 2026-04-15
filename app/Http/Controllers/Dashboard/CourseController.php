<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Resources\CoursesResource;
use App\Http\Resources\ExamResource;
use App\Models\Course;
use App\Models\Exam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CourseController extends Controller
{

    public function index()
    {
        $user = Auth::user();
        $courses = Course::where('user_id', $user->id)->with('exams')->paginate(5)->withQueryString();
        return Inertia::render('dashboard/courses/index', [
            'courses' => CoursesResource::collection($courses)->resolve(),
            'links' => $courses->linkCollection()->toArray(),
        ]);
    }

    public function store(Request $request)
    {

        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('courses')->where(function ($query) {
                    return $query->where('user_id', Auth::id());
                }),
            ],
            'description' => ['required', 'string', 'max:255'],
        ]);
        $user = Auth::user();
        Course::create([
            'name' => $request->name,
            'user_id' => $user->id,
            'description' => $request->description,
        ]);

        return redirect()->back()->with('success', 'Create Courses successfuly');
    }

    public function show(Course $course)
    {
        $user = Auth::user();
        $exams = Exam::where('course_id', '=', $course->id)
            ->where('user_id', '=', $user->id)
            ->paginate()->withQueryString();
        return Inertia::render('dashboard/courses/exams/index', [
            'exams' => ExamResource::collection($exams)->resolve(),
            'course' => $course,
            'links' => $exams->linkCollection()->toArray(),
        ]);
    }

    public function update(Request $request, Course $course)
    {
        $user = Auth::user();
        if ($course->user_id !== $user->id) {
            return back()->with('error', 'You are not authorized to update this course');
        }
        $request->validate([
            'name' => ['required ', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:255'],
        ]);

        $course->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return back()->with('success', 'Course updated successfully');
    }


    public function destroy(Course $course)
    {
        $user = Auth::user();
        if ($course->user_id !== $user->id) {
            return back()->with('error', 'You are not authorized to delete this course');
        }
        $course->delete();
        return back()->with('success', 'Course deleted successfully');
    }
}
