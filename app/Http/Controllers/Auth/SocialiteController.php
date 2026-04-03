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
    public function redirect($provider)
    {
        return Socialite::driver($provider)->stateless()->redirect();
    }

    public function callback($provider)
    {
        
        $provider_user = Socialite::driver($provider)->stateless()->user();
        $user = User::where([
            'provider' => $provider,
            'provider_id' => $provider_user->id,
        ])->first();
        if (!$user) {
            $user = User::create([
                'name' => $provider_user->name,
                'email' => $provider_user->email,
                'password' => Hash::make(Str::random(10)),
                'provider' => $provider,
                'provider_id' => $provider_user->id,
                'provider_token' => $provider_user->token,
            ]);
        }

        Auth::login($user);
        return redirect()->route('home');
    }
}
