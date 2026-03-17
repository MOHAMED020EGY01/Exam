<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    protected $fillable = [
        'name',
        'course_id',
        'questions_package',
        'questions_count',
    ];

    //* Relations

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    //* Attribute
}
