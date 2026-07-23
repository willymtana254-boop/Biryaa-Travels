<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Price;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    protected array $categories = ['economy', 'midsize', 'suv', 'executive', 'van', 'bus'];

    /**
     * Admin: list every car, with availability + booked status + assigned driver.
     */
    public function index(): Response
    {
        $vehicles = Vehicle::with('currentDriver')
            ->orderBy('name')
            ->get()
            ->map(fn (Vehicle $v) => [
                'id' => $v->id,
                'name' => $v->name,
                'category' => $v->category,
                'price_per_day' => $v->price_per_day,
                'is_available' => $v->is_available,
                'is_booked' => $v->isCurrentlyBooked(),
                'driver' => $v->currentDriver ? [
                    'id' => $v->currentDriver->id,
                    'name' => $v->currentDriver->name,
                ] : null,
            ]);

        return Inertia::render('Admin/Vehicles/Index', [
            'vehicles' => $vehicles,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Vehicles/Create', [
            'categories' => $this->categories,
            'rates' => Price::query()->pluck('price_per_day', 'category'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'in:'.implode(',', $this->categories)],
            'seats' => ['required', 'integer', 'min:1', 'max:60'],
            'transmission' => ['required', 'string', 'in:automatic,manual'],
            'price_per_day' => ['nullable', 'numeric', 'min:0'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        // Fall back to the category rate card if no override price was given.
        $data['price_per_day'] ??= Price::forCategory($data['category'])?->price_per_day ?? 0;
        $data['slug'] = \Illuminate\Support\Str::slug($data['name']).'-'.\Illuminate\Support\Str::random(4);
        $data['is_available'] = true;

        Vehicle::create($data);

        return redirect()->route('admin.vehicles.index')->with('success', 'Vehicle added.');
    }
}
