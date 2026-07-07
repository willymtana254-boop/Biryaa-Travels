<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\Villa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VillaController extends Controller
{
    public function index(Request $request): Response
    {
        $villas = Villa::with('location')
            ->where('is_available', true)
            ->when($request->location, fn ($q, $locationId) => $q->where('location_id', $locationId))
            ->when($request->guests, fn ($q, $guests) => $q->where('max_guests', '>=', $guests))
            ->orderBy('price_per_night')
            ->get();

        return Inertia::render('Villas/Index', [
            'villas' => $villas,
            'locations' => Location::orderBy('name')->get(['id', 'name', 'slug']),
            'filters' => $request->only('location', 'guests'),
        ]);
    }

    public function show(Villa $villa): Response
    {
        $villa->load('location');

        return Inertia::render('Villas/Show', [
            'villa' => $villa,
        ]);
    }
}
