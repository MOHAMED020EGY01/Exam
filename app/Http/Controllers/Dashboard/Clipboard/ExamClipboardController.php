<?php

namespace App\Http\Controllers\Dashboard\Clipboard;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Exam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ExamClipboardController extends Controller
{
    private static function disk()
    {
        return Storage::disk('local');
    }
    /**
     * Copy an exam and paste it into a destination course.
     */
    public function pasteExam(Request $request){
        $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'destination_course_id' => 'required|exists:courses,id',
        ]);

        $user = Auth::user();
        $sourceExam = Exam::where('id', '=' ,$request->exam_id,'and')->where('user_id', $user->id)->firstOrFail();
        $destinationCourse = Course::where('id', '=' ,$request->destination_course_id,'and')->where('user_id', $user->id)->firstOrFail();

        // Resolve name collision in the destination course
        $baseName = $sourceExam->name;
        $newName = $baseName;
        $suffix = 1;
        while (Exam::where('name', '=' ,$newName,'and')->where('course_id', $destinationCourse->id)->where('user_id', $user->id)->exists()) {
            $newName = $baseName . " - Copy" . ($suffix > 1 ? " $suffix" : "");
            $suffix++;
        }

        // New folder for the pasted exam package
        $examFolder = 'exam_' . time() . '_' . rand(100, 999);
        $destinationPath = $destinationCourse->path . '/' . $examFolder;

        return DB::transaction(function () use ($sourceExam, $destinationCourse, $newName, $destinationPath) {
            // Copy physical files
            $sourcePath = $sourceExam->questions_package;
            if (self::disk()->exists($sourcePath)) {
                self::disk()->makeDirectory($destinationPath);
                $files = self::disk()->allFiles($sourcePath);
                foreach ($files as $file) {
                    $relativeName = str_replace($sourcePath . '/', '', $file);
                    self::disk()->copy($file, $destinationPath . '/' . $relativeName);
                }
            } else {
                return back()->with('error', 'Source exam question package files not found.');
            }

            // Create Exam Database Record
            $newExam = Exam::create([
                'name' => $newName,
                'description' => $sourceExam->description,
                'user_id' => Auth::id(),
                'course_id' => $destinationCourse->id,
                'questions_package' => $destinationPath,
                'questions_count' => $sourceExam->questions_count,
            ]);

            return redirect()->back()->with('success', 'Exam pasted successfully as "' . $newName . '"');
        });
    }


    /**
     * Move an exam from its current course to a destination course.
     */
    public function moveExam(Request $request){
        $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'destination_course_id' => 'required|exists:courses,id',
        ]);

        $user = Auth::user();
        $exam = Exam::where('id', '=' ,$request->exam_id,'and')->where('user_id', $user->id)->firstOrFail();
        $destinationCourse = Course::where('id', '=' ,$request->destination_course_id,'and')->where('user_id', $user->id)->firstOrFail();

        if ($exam->course_id === $destinationCourse->id) {
            return back()->with('error', 'Exam is already in the selected destination course.');
        }

        // Prevent name collisions in destination course
        $conflictExists = Exam::where('name', '=' ,$exam->name,'and')
            ->where('course_id', $destinationCourse->id)
            ->where('user_id', $user->id)
            ->exists();

        if ($conflictExists) {
            return back()->with('error', 'An exam with name "' . $exam->name . '" already exists in the destination course.');
        }

        return DB::transaction(function () use ($exam, $destinationCourse) {
            $sourcePath = $exam->questions_package;
            $examFolder = basename($sourcePath);
            $destinationPath = $destinationCourse->path . '/' . $examFolder;

            // Move directory physically
            if (self::disk()->exists($sourcePath)) {
                self::disk()->makeDirectory(dirname($destinationPath));
                self::disk()->move($sourcePath, $destinationPath);
            }

            // Update Database record
            $exam->update([
                'course_id' => $destinationCourse->id,
                'questions_package' => $destinationPath,
            ]);

            return redirect()->back()->with('success', 'Exam moved successfully to Course "' . $destinationCourse->name . '"');
        });
    }



    /**
     * Duplicate an exam inside the same course.
     */
    public function duplicateExam(Request $request){
        $request->validate([
            'exam_id' => 'required|exists:exams,id',
        ]);

        $user = Auth::user();
        $sourceExam = Exam::where('id', '=' ,$request->exam_id,'and')->where('user_id', $user->id)->firstOrFail();

        $request->merge([
            'destination_course_id' => $sourceExam->course_id
        ]);

        return $this->pasteExam($request);
    }
}
