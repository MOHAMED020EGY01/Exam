<?php

use App\Http\Controllers\Dashboard\CourseController;
use App\Http\Controllers\Dashboard\ExamController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
});
Route::group([
    'middleware' => 'auth',
], function () {
    Route::get('/home', function () {
        return Inertia::render('dashboard/home');
    })->name('home');

    Route::apiResource('courses', CourseController::class);
    Route::apiResource('courses/{course}/exams', ExamController::class);
});


require_once __DIR__ . '/auth.php';
