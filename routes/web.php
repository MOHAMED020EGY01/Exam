<?php

use App\Http\Controllers\Dashboard\Clipboard\ExamClipboardController;
use App\Http\Controllers\Dashboard\Clipboard\QuestionClipboardController;
use App\Http\Controllers\Dashboard\CourseController;
use App\Http\Controllers\Dashboard\ExamController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});
Route::group([
    'middleware' => 'auth',
], function () {

    Route::get('courses', [CourseController::class, 'index'])->name('courses.index');
    Route::post('courses', [CourseController::class, 'store'])->name('courses.store');
    Route::get('courses/{course}', [CourseController::class, 'show'])->name('courses.show');
    Route::put('courses/{course}', [CourseController::class, 'update'])->name('courses.update');
    Route::delete('courses/{course}', [CourseController::class, 'destroy'])->name('courses.destroy');

    Route::post('courses/{course}/exams', [ExamController::class, 'store'])->name('exams.store');
    Route::put('courses/{course}/exams/{exam}/update', [ExamController::class, 'update'])->name('exams.update');
    Route::delete('courses/{course}/exams/{exam}/destroy', [ExamController::class, 'destroy'])->name('exams.destroy');
    Route::get('courses/{course}/exams/{exam}/download', [ExamController::class, 'download'])->name('exams.download');

    // Explorer Clipboard Routes
    Route::post('clipboard/exams/paste', [ExamClipboardController::class, 'pasteExam'])->name('exams.paste');
    Route::post('clipboard/exams/move', [ExamClipboardController::class, 'moveExam'])->name('exams.move');
    Route::post('clipboard/exams/duplicate', [ExamClipboardController::class, 'duplicateExam'])->name('exams.duplicate');

    Route::post('clipboard/questions/paste', [QuestionClipboardController::class, 'pasteQuestion'])->name('questions.paste');
    Route::post('clipboard/questions/move', [QuestionClipboardController::class, 'moveQuestion'])->name('questions.move');
    Route::post('clipboard/questions/duplicate', [QuestionClipboardController::class, 'duplicateQuestion'])->name('questions.duplicate');
    Route::post('clipboard/questions/delete', [QuestionClipboardController::class, 'deleteQuestion'])->name('questions.delete');
});


require __DIR__ . '/auth.php';