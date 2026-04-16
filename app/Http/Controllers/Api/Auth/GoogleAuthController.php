<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\JWK;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class GoogleAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'id_token' => 'required|string',
        ]);

        try {
            $keys = Http::get('https://www.googleapis.com/oauth2/v3/certs')->json();

            $decoded = JWT::decode(
                $request->id_token,
                JWK::parseKeySet($keys)
            );

            if ($decoded->aud !== env('GOOGLE_CLIENT_ID')) {
                return response()->json([
                    'message' => 'Invalid audience'
                ], 401);
            }

            $googleId = $decoded->sub;

            $user = User::where('provider_id', $googleId)->first();
            if(!$user){
                return response()->json([
                    'message' => 'User not found please register in our app'
                ], 404);
            }
            Auth::login($user);

            $token = $user->createToken('mobile-token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'token' => "Bearer $token",
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Invalid Google token',
                'error' => $e->getMessage()
            ], 401);
        }
    }
}