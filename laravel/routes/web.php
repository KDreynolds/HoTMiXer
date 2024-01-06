<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('index');
});

Route::get('/endpoint', function () {
    return 'We are so back!';
});
