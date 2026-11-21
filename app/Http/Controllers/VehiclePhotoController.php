<?php

namespace App\Http\Controllers;

use App\Models\VehiclePhoto;
use Illuminate\Http\Response;

class VehiclePhotoController extends Controller
{
    public function show(int $vehicle): Response
    {
        $photo = VehiclePhoto::where('vehicle_id', $vehicle)->firstOrFail();

        // The address carries ?v=timestamp, so a replaced photo gets a new address and old copies can be cached hard.
        return response(base64_decode($photo->data), 200, [
            'Content-Type' => 'image/jpeg',
            'Cache-Control' => 'public, max-age=2592000, immutable',
        ]);
    }
}
