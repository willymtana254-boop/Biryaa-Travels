<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DriverController extends Controller
{
    public function index(): Response
    {
        $drivers = Driver::with('vehicle')->orderBy('name')->get();

        return Inertia::render('Admin/Drivers/Index', [
            'drivers' => $drivers,
            // Vehicles a driver could be assigned to: any car without a driver already.
            'unassignedVehicles' => Vehicle::query()
                ->whereDoesntHave('currentDriver')
                ->orderBy('name')
                ->get(['id', 'name', 'category']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Drivers/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'license_number' => ['required', 'string', 'max:50', 'unique:drivers,license_number'],
            'photo' => ['nullable', 'string', 'max:2048'],
        ]);

        $data['is_available'] = true;

        Driver::create($data);

        return redirect()->route('admin.drivers.index')->with('success', 'Driver added.');
    }

    /**
     * Assign (or unassign, if vehicle_id is null) a driver to a car.
     */
    public function assign(Request $request, Driver $driver): RedirectResponse
    {
        $data = $request->validate([
            'vehicle_id' => ['nullable', 'integer', 'exists:vehicles,id'],
        ]);

        if ($data['vehicle_id'] ?? null) {
            // A car can only have one driver at a time — refuse if already taken.
            $alreadyAssigned = Driver::where('vehicle_id', $data['vehicle_id'])
                ->where('id', '!=', $driver->id)
                ->exists();

            if ($alreadyAssigned) {
                return back()->with('error', 'That vehicle already has a driver assigned.');
            }
        }

        $driver->update(['vehicle_id' => $data['vehicle_id'] ?? null]);

        return back()->with('success', $data['vehicle_id'] ? 'Driver assigned.' : 'Driver unassigned.');
    }
}
