<?php

namespace App\Rules;

use Closure;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;

class ImageFileBase64 implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // =========================
        // 1) Nullable
        // =========================
        if ($value == null) {
            return;
        }
        // =========================
        // 1) Uploaded File
        // =========================
        if ($value instanceof UploadedFile) {

            $mime = $value->getMimeType();

            $allowedMimes = [
                'image/jpeg',
                'image/png',
                'image/jpg',
                'image/gif',
                'image/svg+xml',
            ];

            if (!in_array($mime, $allowedMimes)) {
                $fail('Invalid image type.');
                return;
            }

            if ($value->getSize() > 2 * 1024 * 1024) {
                $fail('Image size must not exceed 2MB.');
                return;
            }

            return;
        }

        // =========================
        // 2) Base64 string
        // =========================
        if (is_string($value)) {

            if (str_contains($value, 'base64,')) {
                $value = explode('base64,', $value)[1];
            }

            $decoded = base64_decode($value, true);

            if ($decoded === false) {
                $fail('Invalid base64 image.');
                return;
            }

            if (strlen($decoded) > 2 * 1024 * 1024) {
                $fail('Image size must not exceed 2MB.');
                return;
            }

            if (!@getimagesizefromstring($decoded)) {
                $fail('Invalid image content.');
                return;
            }

            $finfo = new \finfo(FILEINFO_MIME_TYPE);
            $mime = $finfo->buffer($decoded);

            $allowedMimes = [
                'image/jpeg',
                'image/png',
                'image/jpg',
                'image/gif',
                'image/svg+xml',
            ];

            if (!in_array($mime, $allowedMimes)) {
                $fail('Unsupported image type.');
                return;
            }
        } else {
            $fail('Image must be file or base64 string.');
        }
    }
}
