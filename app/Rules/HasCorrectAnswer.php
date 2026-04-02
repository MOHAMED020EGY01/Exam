<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class HasCorrectAnswer implements ValidationRule
{
    protected string $filed;
    public function __construct(string $filed)
    {
        $this->filed = $filed;
    }
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $hasCorrect = collect($value)->contains($this->filed,true);
        if (!$hasCorrect) {
            $fail('please you not chose the correct answer');
        }
    }
}
