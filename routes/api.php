<?php

use App\Http\Controllers\Api\Auth\GoogleAuthController;
use App\Http\Controllers\Api\Exam\ExamController;
use Illuminate\Support\Facades\Route;


Route::group([
    'prefix' => 'v1'
], function () {
    Route::group([
        'middleware' => 'auth:sanctum'
    ], function () {
        Route::get('Exam', [ExamController::class, 'index']);
        Route::get('Exam/download/{id}', [ExamController::class, 'downloadQuestions']);
    });
    Route::post('login', [GoogleAuthController::class, 'login']);
});
