<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\CourseRequest;
use App\Http\Resources\CoursesResource;
use App\Models\Course;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;


class CourseController extends Controller
{
    private static function disk()
    {
        return Storage::disk('local');
    }
    public function index()
    {
        $user = Auth::user();
        $courses = Course::where('user_id', '=', $user->id, 'and')->with('exams')->get();
        return Inertia::render('Home', [
            'courses' => CoursesResource::collection($courses)->resolve(),
        ]);
    }

    public function store(CourseRequest $request)
    {
        $user = Auth::user();
        Course::create([
            'name' => $request->name,
            'user_id' => $user->id,
            'description' => $request->description,
            'path' => "users/" . Str::slug($user->name . '_' . $user->id) . "/" . Str::slug($request->name)
        ]);

        return redirect()->back()->with('success', 'Create Courses successfuly');
    }

    public function show(Course $course)
    {
        return redirect()->route('courses.index', ['course_id' => $course->id]);
    }

    public function update(CourseRequest $request, Course $course)
    {
        $user = Auth::user();
        if ($course->user_id !== $user->id) {
            return back()->with('error', 'You are not authorized to update this course');
        }

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
        if (self::disk()->exists($course->path)) {
            self::disk()->deleteDirectory($course->path);
        }
        $course->delete($course->id);
        return back()->with('success', 'Course deleted successfully');
    }
}
