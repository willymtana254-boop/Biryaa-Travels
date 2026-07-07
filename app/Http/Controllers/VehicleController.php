<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    public function index(Request $request): Response
    {
        $vehicles = Vehicle::query()
            ->where('is_available', true)
            ->when($request->category, fn ($q, $category) => $q->where('category', $category))
            ->orderBy('price_per_day')
            ->get();

        return Inertia::render('Vehicles/Index', [
            'vehicles' => $vehicles,
            'filters' => $request->only('category'),
            'categories' => ['economy', 'midsize', 'suv', 'executive', 'van', 'bus'],
        ]);
    }

    public function show(Vehicle $vehicle): Response
    {
        return Inertia::render('Vehicles/Show', [
            'vehicle' => $vehicle,
        ]);
    }
}
