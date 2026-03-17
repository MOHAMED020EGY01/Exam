<?php

use App\Http\Controllers\Auth\SocialiteController;
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
});


Route::get('auth/{provider}', [SocialiteController::class, 'redirect'])
->name('auth.redirect');

Route::get('auth/{provider}/callback', [SocialiteController::class, 'callback'])
->name('auth.callback');