<?php

use App\Http\Controllers\Auth\SocialiteController;
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


Route::group([
    'middleware' => 'guest',
], function () {
    Route::get('/login', function () {
        return Inertia::render('auth/login');
    })->name('login');
});

Route::get('auth/{provider}', [SocialiteController::class, 'redirect'])
    ->name('auth.redirect');

Route::get('auth/{provider}/callback', [SocialiteController::class, 'callback'])
    ->name('auth.callback');
