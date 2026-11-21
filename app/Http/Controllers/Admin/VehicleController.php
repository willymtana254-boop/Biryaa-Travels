<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\Vehicle;
use App\Models\VehiclePhoto;
use App\Support\ImagePipeline;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    private const CATEGORIES = ['economy', 'midsize', 'suv', 'executive', 'van', 'bus'];

    public function index(): Response
    {
        return Inertia::render('Admin/Vehicles/Index', [
            'vehicles' => Vehicle::with('driver')->orderBy('name')->get(),
            'unassignedDrivers' => Driver::whereNull('vehicle_id')->orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Vehicles/Create', ['categories' => self::CATEGORIES]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request, photoRequired: true);
        $jpeg = $this->jpeg($request);

        if ($jpeg === null) {
            return back()->withErrors(['photo' => 'That file could not be read as a picture. Try a JPG or PNG.'])->withInput();
        }

        unset($data['photo']);
        $data['slug'] = Str::slug($data['name']).'-'.Str::random(4);
        $data['is_available'] = $request->boolean('is_available', true);

        $vehicle = Vehicle::create($data);
        $this->savePhoto($vehicle, $jpeg);

        return redirect()->route('admin.vehicles.index')->with('success', 'Vehicle added.');
    }

    public function edit(Vehicle $vehicle): Response
    {
        return Inertia::render('Admin/Vehicles/Edit', [
            'vehicle' => $vehicle,
            'categories' => self::CATEGORIES,
        ]);
    }

    public function update(Request $request, Vehicle $vehicle): RedirectResponse
    {
        $data = $this->validated($request, photoRequired: false);
        unset($data['photo']);
        $data['is_available'] = $request->boolean('is_available');

        if ($request->hasFile('photo')) {
            $jpeg = $this->jpeg($request);

            if ($jpeg === null) {
                return back()->withErrors(['photo' => 'That file could not be read as a picture. Try a JPG or PNG.']);
            }

            $this->savePhoto($vehicle, $jpeg);
        }

        $vehicle->update($data);

        return redirect()->route('admin.vehicles.index')->with('success', 'Vehicle updated.');
    }

    public function destroy(Vehicle $vehicle): RedirectResponse
    {
        if ($vehicle->bookings()->exists()) {
            return back()->with('error', 'This car has bookings, so it cannot be deleted. Edit it and untick "Available for hire" instead.');
        }

        Driver::where('vehicle_id', $vehicle->id)->update(['vehicle_id' => null, 'is_available' => true]);
        VehiclePhoto::where('vehicle_id', $vehicle->id)->delete();
        $vehicle->delete();

        return back()->with('success', 'Vehicle deleted.');
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

    private function validated(Request $request, bool $photoRequired): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'in:'.implode(',', self::CATEGORIES)],
            'seats' => ['required', 'integer', 'min:1', 'max:80'],
            'transmission' => ['required', 'in:manual,automatic'],
            'price_per_day' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string', 'max:3000'],
            'photo' => [$photoRequired ? 'required' : 'nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:10240'],
        ], [
            'photo.required' => 'Please choose a photo of the car.',
            'photo.image' => 'The photo must be a picture (JPG, PNG or WebP).',
            'photo.max' => 'The photo is too large. Please choose one under 10 MB.',
        ]);
    }

    private function jpeg(Request $request): ?string
    {
        $file = $request->file('photo');

        return $file ? ImagePipeline::fromUpload($file, 1400, 80) : null;
    }

    private function savePhoto(Vehicle $vehicle, string $jpeg): void
    {
        VehiclePhoto::updateOrCreate(
            ['vehicle_id' => $vehicle->id],
            ['data' => base64_encode($jpeg)]
        );

        // The public pages already read the "images" list, so point it at the stored photo.
        // ?v= changes on every upload so browsers never show the old picture.
        $vehicle->forceFill([
            'images' => [route('vehicles.photo', $vehicle->id, false).'?v='.time()],
        ])->save();
    }
}
