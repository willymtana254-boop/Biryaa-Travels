<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Vehicles/Index', [
            'vehicles' => Vehicle::with('driver')->orderBy('name')->get(),
            'unassignedDrivers' => Driver::whereNull('vehicle_id')->orderBy('name')->get(),
        ]);
    }


    public function create(): Response
   {
        return Inertia::render('Admin/Vehicles/Create', [
            'categories' => ['economy', 'midsize', 'suv', 'executive', 'van', 'bus'],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
       $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'in:economy,midsize,suv,executive,van,bus'],
            'seats' => ['required', 'integer', 'min:1'],
            'transmission' => ['required', 'in:manual,automatic'],
            'price_per_day' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
        ]);

       $data['slug'] = str($data['name'])->slug().'-'.\Illuminate\Support\Str::random(4);
       $data['is_available'] = true;

     Vehicle::create($data);

         return redirect()->route('admin.vehicles.index')->with('success', 'Vehicle added.');
    }
    public function assignDriver(Request $request, Vehicle $vehicle): RedirectResponse
    {
        $data = $request->validate([
            'driver_id' => ['required', 'exists:drivers,id'],
        ]);

        // Free up the vehicle's current driver, if any.
        Driver::where('vehicle_id', $vehicle->id)->update(['vehicle_id' => null, 'is_available' => true]);

        Driver::where('id', $data['driver_id'])->update([
            'vehicle_id' => $vehicle->id,
            'is_available' => false,
        ]);

        return back()->with('success', 'Driver assigned.');
    }

    public function deassignDriver(Vehicle $vehicle): RedirectResponse
    {
        Driver::where('vehicle_id', $vehicle->id)->update(['vehicle_id' => null, 'is_available' => true]);

        return back()->with('success', 'Driver removed from vehicle.');
    }
}