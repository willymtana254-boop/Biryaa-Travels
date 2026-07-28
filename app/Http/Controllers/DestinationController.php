<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\TransferRoute;
use Inertia\Inertia;
use Inertia\Response;

class DestinationController extends Controller
{
    public function index(): Response
    {
        $towns = Location::towns()
            ->with(['villas' => fn ($q) => $q->where('is_available', true)->orderBy('price_per_night')])
            ->orderBy('name')
            ->get()
            ->map(function ($town) {
                $routes = TransferRoute::with(['fromLocation', 'toLocation'])
                    ->where('from_location_id', $town->id)
                    ->orWhere('to_location_id', $town->id)
                    ->get()
                    ->map(function ($route) use ($town) {
                        $hub = $route->from_location_id === $town->id ? $route->toLocation : $route->fromLocation;

                        return [
                            'route_id' => $route->id,
                            'hub' => $hub->name,
                            'price' => $route->price,
                        ];
                    })
                    ->unique('hub')
                    ->sortBy('price')
                    ->values();

                return [
                    'id' => $town->id,
                    'name' => $town->name,
                    'slug' => $town->slug,
                    'tagline' => $town->tagline,
                    'description' => $town->description,
                    'villas' => $town->villas,
                    'routes' => $routes,
                ];
            });

        return Inertia::render('Destinations/Index', [
            'towns' => $towns,
        ]);
    }
}