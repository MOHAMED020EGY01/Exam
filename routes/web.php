<?php

use App\Http\Controllers\Auth\SocialiteController;
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
    Route::resource('courses/{course}/exams', ExamController::class);
    Route::get('exams/all', [ExamController::class, 'all'])->name('exams.all');
});


Route::group([
    'middleware' => 'guest',
    ], function () {
    Route::get('/login', [SocialiteController::class, 'login'])->name('login');
    Route::get('auth/{provider}', [SocialiteController::class, 'redirect'])
        ->name('auth.redirect');
    Route::get('auth/{provider}/callback', [SocialiteController::class, 'callback'])
        ->name('auth.callback');
});

Route::delete('logout', [SocialiteController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');
