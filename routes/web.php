<?php

use App\Http\Controllers\Dashboard\Clipboard\ExamCliboardController;
use App\Http\Controllers\Dashboard\Clipboard\QuestionCliboardController;
use App\Http\Controllers\Dashboard\CourseController;
use App\Http\Controllers\Dashboard\ExamController;
use App\Http\Controllers\Dashboard\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

    Route::get('/',function(){
        return Inertia::render('welcome');
    });
Route::group([
    'middleware' => 'auth',
    'prefix' => 'home',
], function () {
    Route::get('/home', HomeController::class)->name('home');
    Route::apiResource('courses', CourseController::class);
    Route::post('courses/{course}/exams/{exam}/update', [ExamController::class, 'update'])->name('exams.update');
    Route::get('courses/{course}/exams/{exam}/download', [ExamController::class, 'download'])->name('exams.download');
    Route::apiResource('courses/{course}/exams', ExamController::class)->except(['index', 'update']);
    Route::get('exams/all', [ExamController::class, 'all'])->name('exams.all');

    // Explorer Clipboard Routes
    Route::post('clipboard/exams/paste'        ,[ExamCliboardController::class, 'pasteExam'])->name('exams.paste');
    Route::post('clipboard/exams/move'         ,[ExamCliboardController::class, 'moveExam'])->name('exams.move');
    Route::post('clipboard/exams/duplicate'    ,[ExamCliboardController::class, 'duplicateExam'])->name('exams.duplicate');

    Route::post('clipboard/questions/paste'    ,[QuestionCliboardController::class, 'pasteQuestion'])->name('questions.paste');
    Route::post('clipboard/questions/move'     ,[QuestionCliboardController::class, 'moveQuestion'])->name('questions.move');
    Route::post('clipboard/questions/duplicate',[QuestionCliboardController::class, 'duplicateQuestion'])->name('questions.duplicate');
    Route::post('clipboard/questions/delete'   ,[QuestionCliboardController::class, 'deleteQuestion'])->name('questions.delete');
});


require __DIR__.'/auth.php';
