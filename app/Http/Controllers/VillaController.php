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
            ->when($request->location, fn ($q, $id) => $q->where('location_id', $id))
            ->when($request->guests, fn ($q, $g) => $q->where('max_guests', '>=', $g))
            ->when($request->bedrooms, fn ($q, $b) => $q->where('bedrooms', '>=', $b))
            ->when($request->max_price, fn ($q, $p) => $q->where('price_per_night', '<=', $p))
            ->when(
                $request->sort === 'price_desc',
                fn ($q) => $q->orderByDesc('price_per_night'),
                fn ($q) => $q->orderBy('price_per_night')
            )
            ->get();

        return Inertia::render('Villas/Index', [
            'villas' => $villas,
            'locations' => Location::towns()->orderBy('name')->get(['id', 'name', 'slug']),
            'filters' => $request->only('location', 'guests', 'bedrooms', 'max_price', 'sort'),
        ]);
    }

    public function show(Villa $villa): Response
    {
        $villa->load('location');

        $related = Villa::with('location')
            ->where('is_available', true)
            ->where('id', '!=', $villa->id)
            ->where('location_id', $villa->location_id)
            ->take(3)
            ->get();

        return Inertia::render('Villas/Show', [
            'villa' => $villa,
            'related' => $related,
        ]);
    }
}