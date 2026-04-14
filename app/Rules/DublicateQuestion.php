<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class DublicateQuestion implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $texts = array_map(function ($item) {
            return strtolower(trim($item['text']));
        }, $value);
        $duplicates = array_diff_assoc($texts, array_unique($texts));
        if (!empty($duplicates)) {
            $fail("dublicate questions in $attribute.");
        }
    }
}
