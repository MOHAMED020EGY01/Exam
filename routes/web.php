<?php

use App\Http\Controllers\Dashboard\CourseController;
use App\Http\Controllers\Dashboard\ExamController;
use App\Http\Controllers\Dashboard\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
});
Route::group([
    'middleware' => 'auth',
    'prefix' => 'home',
], function () {
    Route::get('/', HomeController::class)->name('home');
    Route::apiResource('courses', CourseController::class);
    Route::post('courses/{course}/exams/{exam}/update', [ExamController::class, 'update'])->name('exams.update');
    Route::get('courses/{course}/exams/{exam}/download', [ExamController::class, 'download'])->name('exams.download');
    Route::apiResource('courses/{course}/exams', ExamController::class)->except(['index', 'update']);
    Route::get('exams/all', [ExamController::class, 'all'])->name('exams.all');
});


require __DIR__.'/auth.php';
require __DIR__.'/terminal.php';
