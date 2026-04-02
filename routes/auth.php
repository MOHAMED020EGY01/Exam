<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\SocialiteController;

Route::get('/login', [SocialiteController::class, 'login'])->name('login');
Route::group([
    'middleware' => 'guest',
], function () {
    Route::get('auth/{provider}', [SocialiteController::class, 'redirect'])
        ->name('auth.redirect');
    Route::get('auth/{provider}/callback', [SocialiteController::class, 'callback'])
        ->name('auth.callback');
});

Route::delete('logout', [SocialiteController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');
