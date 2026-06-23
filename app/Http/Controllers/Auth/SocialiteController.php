<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    public function logout(){
        Auth::logout();
        return Inertia::render('auth/login');
    }
    public function login(){
        return Inertia::render('auth/login');
    }
    public function redirect(string $provider)
    {
        /** @var \Laravel\Socialite\Two\AbstractProvider $socialDriver */
        $socialDriver = Socialite::driver($provider);
        return $socialDriver->stateless()->redirect();
    }

    public function callback(string $provider)
    {
        /** @var \Laravel\Socialite\Two\AbstractProvider $socialDriver */
        $socialDriver = Socialite::driver($provider);
        $provider_user = $socialDriver->stateless()->user();
        $user = User::where([
            'provider' => $provider,
            'provider_id' => $provider_user->id,
            ])->first();
            if (!$user) {
            $user = User::create([
                'avatar' => $provider_user->avatar,
                'name' => $provider_user->name,
                'email' => $provider_user->email,
                'password' => Hash::make(Str::random(10)),
                'provider' => $provider,
                'provider_id' => $provider_user->id,
                'provider_token' => $provider_user->token,
            ]);
        }

        Auth::login($user);
        return redirect()->route('courses.index');
    }
}
