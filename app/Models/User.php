<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Crypt;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'provider',
        'provider_id',
        'provider_token',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'provider_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'provider_token' => 'encrypted',
        ];
    }
    //* Relations
    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    //* Attribute
    public function getProviderTokenAttribute($value)
    {
        return Crypt::decryptString($value);
    }
}
