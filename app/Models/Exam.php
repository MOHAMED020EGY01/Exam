<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

/**
 * @property int $id
 * @property string $name
 * @property string $description
 * @property int $course_id
 * @property int $user_id
 * @property string $questions_package
 * @property int $questions_count
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Course $course
 * @property-read User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam whereCourseId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam whereQuestionsCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam whereQuestionsPackage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam whereUserId($value)
 * @mixin \Eloquent
 */
class Exam extends Model
{
    protected $fillable = [
        'name',
        'description',
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
