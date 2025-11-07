<?php

use App\Http\Controllers\apiKeysController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');



});


Route::post('firebaseKeys', [apiKeysController::class, 'keys']);
Route::post('/log', [apiKeysController::class, 'log']);
Route::get('/csrf-token', function () {
    return response()->json(['csrfToken' => csrf_token()]);
});