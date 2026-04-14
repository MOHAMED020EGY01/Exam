<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class DublicateAnswer implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $texts = array_map(function ($item) {
            return strtolower(trim($item['text']));
        }, $value);
        $duplicates = array_diff_assoc($texts, array_unique($texts));
        if (!empty($duplicates)) {
            $fail("dublicate answers in $attribute.");
        }
    }
}
