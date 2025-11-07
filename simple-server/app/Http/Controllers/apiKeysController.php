<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class apiKeysController extends Controller
{
    public function keys(){
        

        $keyArr = [
            "apiKey" =>config('custom_vars.apiKey'),
            "authDomain" =>config('custom_vars.authDomain'),
            "databaseUrl" =>config('custom_vars.databaseUrl'),
            "projectId" =>config('custom_vars.projectId'),
            "storageBucket" =>config('custom_vars.storageBucket'),
            "messagingSenderId" =>config('custom_vars.messagingSenderId'),
            "appId" =>config('custom_vars.appId')];
            

            // Log::info("requred for firebase keys:");
            // Log::info($keyArr);


        return response() -> json(['apiDeets' => $keyArr]);

    }

    public function logs(Request $request){
        
        try {
            
        Log::info($request->message);    

        } catch (\Throwable $th) {

            Log::error($th);
        }

    }
}
