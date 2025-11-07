<?php

use App\Http\Controllers\apiKeysController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::post('firebaseKeys', [apiKeysController::class, 'keys']);
Route::post('/log', [apiKeysController::class, 'logs']);

Route::group(['middleware' => ['web']], function () {

    Route::get('/csrf-token', function (Request $request) {
        $token = $request->session()->token();
     
        $token = csrf_token();
        return response()->json(['csrfToken' => $token]);
    });
    
    // your routes here
});