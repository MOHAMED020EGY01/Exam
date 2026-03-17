<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{

    protected $fillable = [
        'name',
        'user_id',
    ];  

    //* Relations 
    public function user(){
        return $this->belongsTo(User::class);
    }

    public function exams(){
        return $this->hasMany(Exam::class);
    }

    //* Attribute
}
