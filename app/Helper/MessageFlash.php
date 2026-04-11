<?php
namespace App\Helper;

class MessageFlash
{
    public static function success($title, $message, $code = 200)
    {
        self::flash($title, $message, 'success', $code);
    }

    public static function info($title, $message, $code = 200)
    {
        self::flash($title, $message, 'info', $code);
    }

    public static function warning($title, $message, $code = 400)
    {
        self::flash($title, $message, 'warning', $code);
    }

    public static function error($title, $message, $code = 500)
    {
        self::flash($title, $message, 'error', $code);
    }

    private static function flash($title, $message, $type, $code = 200)
    {
        session()->flash('message', [
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'code' => $code
        ]);
    }
}
