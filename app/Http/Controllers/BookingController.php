<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Tour;
use App\Models\TransferRoute;
use App\Models\Vehicle;
use App\Models\Villa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    protected function resolveType(string $type): string
    {
        return match ($type) {
            'vehicle' => Vehicle::class,
            'villa' => Villa::class,
            'tour' => Tour::class,
            'transfer' => TransferRoute::class,
            default => abort(404),
        };
    }

    public function create(string $type, int $id): Response
    {
        $modelClass = $this->resolveType($type);

        $with = match ($type) {
            'villa', 'tour' => ['location'],
            'transfer' => ['fromLocation', 'toLocation'],
            default => [],
        };

        $bookable = $modelClass::with($with)->findOrFail($id);

        return Inertia::render('Booking/Checkout', [
            'type' => $type,
            'bookable' => $bookable,
            'pricePerUnit' => $bookable->price_per_day ?? $bookable->price_per_night ?? $bookable->price ?? null,
            'vehicles' => $type === 'transfer'
                ? Vehicle::where('is_available', true)->orderBy('name')->get(['id', 'name', 'category'])
                : [],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'type' => ['required', Rule::in(['vehicle', 'villa', 'tour', 'transfer'])],
            'bookable_id' => ['required', 'integer'],
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:30'],
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'guests' => ['nullable', 'integer', 'min:1'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $modelClass = $this->resolveType($data['type']);
        $bookable = $modelClass::findOrFail($data['bookable_id']);

        $end = $data['end_date'] ?? $data['start_date'];

        // Vehicles and villas have a real availability calendar — enforce it.
        if (in_array($modelClass, [Vehicle::class, Villa::class]) && method_exists($bookable, 'isAvailableBetween')) {
            if (! $bookable->isAvailableBetween($data['start_date'], $end)) {
                return back()
                    ->withErrors(['start_date' => 'Sorry, this is already booked for part of those dates. Please choose different dates.'])
                    ->withInput();
            }
        }

        $unitPrice = $bookable->price_per_day ?? $bookable->price_per_night ?? $bookable->price ?? 0;
        $nights = $data['end_date'] ?? null
            ? max(1, \Carbon\Carbon::parse($data['start_date'])->diffInDays($data['end_date']))
            : 1;

        $booking = Booking::create([
            'user_id' => $request->user()?->id,
            'bookable_type' => $modelClass,
            'bookable_id' => $bookable->id,
            'customer_name' => $data['customer_name'],
            'customer_email' => $data['customer_email'],
            'customer_phone' => $data['customer_phone'],
            'start_date' => $data['start_date'],
            'end_date' => $end,
            'guests' => $data['guests'] ?? null,
            'total_price' => $unitPrice * $nights,
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'notes' => $data['notes'] ?? null,
        ]);

        if ($modelClass === Vehicle::class) {
            $driver = \App\Models\Driver::where('vehicle_id', $bookable->id)->first();
            if ($driver) {
                \App\Models\Notification::forDriverJob($driver, $booking);
            }
        }

        return redirect()->route('bookings.confirmation', $booking->reference);
    }

    public function confirmation(string $reference): Response
    {
        $booking = Booking::where('reference', $reference)->with('bookable')->firstOrFail();

        return Inertia::render('Booking/Confirmation', [
            'booking' => $booking,
        ]);
    }
}