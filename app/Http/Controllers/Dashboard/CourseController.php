<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CourseController extends Controller
{

    public function index(Auth $user)
    {

        $courses = Course::where('user_id', $user->user()->id)->get();
        return Inertia::render('dashboard.courses.index', [
            'courses' => $courses,
        ]);
    }

    public function store(Request $request, Auth $user)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $course = Course::create([
            'name' => $request->name,
            'user_id' => $user->user()->id,
        ]);

        return redirect()->route('dashboard.courses.index');
    }

    public function show(Auth $user, Course $course)
    {
        $course->load('exams');
        return Inertia::render('dashboard.courses.show', [
            'course' => $course,
        ]);
    }

    public function update(Request $request,Auth $user, Course $course)
    {
        if($course->user_id !== $user->user()->id) {
            return back()->with('error', 'You are not authorized to update this course');
        }
        $request->validate([
            'name' => ['required ','string', 'max:255'],
        ]);
        
        $course->update([
            'name' => $request->name,
        ]);
        
        return back()->with('success', 'Course updated successfully');
    }


    public function destroy(Course $course,Auth $user)
    {
        if($course->user_id !== $user->user()->id) {
            return back()->with('error', 'You are not authorized to delete this course');
        }
        $course->delete();
        return back()->with('success', 'Course deleted successfully');
    }
}
