<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\Tour;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TourController extends Controller
{
    public function index(Request $request): Response
    {
        $tours = Tour::with('location')
            ->where('is_available', true)
            ->when($request->category, fn ($q, $category) => $q->where('category', $category))
            ->when($request->location, fn ($q, $locationId) => $q->where('location_id', $locationId))
            ->orderBy('price')
            ->get();

        return Inertia::render('Tours/Index', [
            'tours' => $tours,
            'locations' => Location::orderBy('name')->get(['id', 'name', 'slug']),
            'categories' => ['marine', 'cultural', 'city', 'golf', 'wildlife'],
            'filters' => $request->only('category', 'location'),
        ]);
    }

    public function show(Tour $tour): Response
    {
        $tour->load('location');

        return Inertia::render('Tours/Show', [
            'tour' => $tour,
        ]);
    }
}
