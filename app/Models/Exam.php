<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Exam extends Model
{
    protected $fillable = [
        'name',
        'course_id',
        'user_id',
        'questions_package',
        'questions_count',
    ];

    //* Relations

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    //* Attribute
}
