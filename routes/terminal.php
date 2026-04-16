<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::match(['get', 'post'],'/server-terminal', function (\Illuminate\Http\Request $request) {

    //Password Secret
    $password = '123456';

    if ($request->input('password') !== $password) {
        return '
        <form method="POST">
            '.csrf_field().'
            <h3>Secure Terminal Login</h3>
            <input type="password" name="password" placeholder="Password">
            <button type="submit">Login</button>
        </form>';
    }

    $output = '';

    if ($request->has('command')) {
        $cmd = trim($request->input('command'));

        try {
            Artisan::call($cmd);
            $output = Artisan::output();
        } catch (\Exception $e) {
            $output = $e->getMessage();
        }
    }

    return '
    <html>
    <head>
        <title>Laravel Terminal</title>
        <style>
            body {
                background:#111;
                color:#0f0;
                font-family:monospace;
                padding:20px;
            }
            input, textarea, button {
                width:100%;
                padding:10px;
                margin:10px 0;
                background:#000;
                color:#0f0;
                border:1px solid #0f0;
            }
            button {
                cursor:pointer;
            }
            textarea {
                height:300px;
            }
        </style>
    </head>
    <body>
        <h2>Laravel Web Terminal</h2>

        <form method="POST">
            '.csrf_field().'
            <input type="hidden" name="password" value="'.$password.'">
            <input type="text" name="command" placeholder="Enter artisan command e.g. optimize:clear">
            <button type="submit">Run Command</button>
        </form>

        <textarea readonly>'.$output.'</textarea>
    </body>
    </html>
    ';
});
