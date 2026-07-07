<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\Tour;
use App\Models\Vehicle;
use App\Models\Villa;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Home', [
            'locations' => Location::orderBy('name')->get(['id', 'name', 'slug', 'tagline', 'hero_image']),
            'featuredVehicles' => Vehicle::where('is_available', true)->latest()->take(3)->get(),
            'featuredVillas' => Villa::with('location')->where('is_available', true)->latest()->take(3)->get(),
            'featuredTours' => Tour::with('location')->where('is_available', true)->latest()->take(3)->get(),
        ]);
    }
}
