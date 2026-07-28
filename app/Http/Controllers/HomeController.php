<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Home', [
            'locations' => Location::towns()->orderBy('name')->get(['id', 'name', 'slug', 'tagline', 'hero_image']),
        ]);
    }
}
