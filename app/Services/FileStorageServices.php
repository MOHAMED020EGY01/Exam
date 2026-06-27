<?php 

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class FileStorageServices
{
    public static function disk(string $disk = 'local')
    {
        return Storage::disk($disk);
    }
}