<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Driver;
use App\Models\Notification;
use App\Models\Tour;
use App\Models\TransferRoute;
use App\Models\Vehicle;
use App\Models\Villa;
use App\Support\Currency;
use App\Support\Pricing;
use Illuminate\Http\JsonResponse;
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

        $extraOptions = collect(config("pricing.extras.{$type}", []))
            ->map(fn ($def, $key) => ['key' => $key] + $def)
            ->values();

        return Inertia::render('Booking/Checkout', [
            'type' => $type,
            'bookable' => $bookable,
            'pricePerUnit' => $bookable->price_per_day ?? $bookable->price_per_night ?? $bookable->price ?? null,
            'vehicles' => $type === 'transfer'
                ? Vehicle::where('is_available', true)->orderBy('name')->get(['id', 'name', 'category'])
                : [],
            'extraOptions' => $extraOptions,
            'driverFeePerDay' => $type === 'vehicle' ? (float) config('pricing.vehicle.driver_fee_per_day') : 0,
            'discountTiers' => collect(config("pricing.{$type}.discounts", []))->sortBy('min_days')->values(),
        ]);
    }

    /** Live price + availability for the checkout form (read-only, so a plain GET). */
    public function quote(Request $request): JsonResponse
    {
        $data = $request->validate([
            'type' => ['required', Rule::in(['vehicle', 'villa', 'tour', 'transfer'])],
            'id' => ['required', 'integer'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'guests' => ['nullable', 'integer', 'min:1', 'max:100'],
            'with_driver' => ['nullable', 'boolean'],
            'extras' => ['nullable', 'array'],
            'extras.*' => ['integer', 'min:0', 'max:10'],
        ]);

        $bookable = $this->resolveType($data['type'])::findOrFail($data['id']);
        $quote = Pricing::quote($data['type'], $bookable, $data);

        $available = true;
        if (in_array($data['type'], ['vehicle', 'villa'], true)) {
            $available = $bookable->isAvailableBetween($data['start_date'], $data['end_date'] ?? $data['start_date']);
        }

        return response()->json($quote + [
            'available' => $available,
            'rate' => Currency::kesPerUsd(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'type' => ['required', Rule::in(['vehicle', 'villa', 'tour', 'transfer'])],
            'bookable_id' => ['required', 'integer'],
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:30', 'regex:/^\+?[0-9\s\-()]{9,20}$/'],
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'guests' => [Rule::requiredIf($request->input('type') === 'tour'), 'nullable', 'integer', 'min:1', 'max:100'],
            'pickup_time' => [Rule::requiredIf($request->input('type') === 'transfer'), 'nullable', 'date_format:H:i'],
            'pickup_address' => ['nullable', 'string', 'max:255'],
            'flight_or_train_number' => ['nullable', 'string', 'max:30'],
            'with_driver' => ['nullable', 'boolean'],
            'extras' => ['nullable', 'array'],
            'extras.*' => ['integer', 'min:0', 'max:10'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ], [
            'customer_phone.regex' => 'Please enter a valid phone number, e.g. 0712 345 678 or +44 7911 123456.',
            'pickup_time.required' => 'Please tell us the pickup time.',
            'guests.required' => 'Please tell us how many guests.',
        ]);

        $modelClass = $this->resolveType($data['type']);
        $bookable = $modelClass::findOrFail($data['bookable_id']);
        $end = $data['end_date'] ?? $data['start_date'];

        if (in_array($modelClass, [Vehicle::class, Villa::class], true) && ! $bookable->isAvailableBetween($data['start_date'], $end)) {
            return back()
                ->withErrors(['start_date' => 'Sorry, this is already booked for part of those dates. Please choose different dates.'])
                ->withInput();
        }

        // The server always recalculates the price. Nothing the browser sends can change it.
        $quote = Pricing::quote($data['type'], $bookable, [
            'start_date' => $data['start_date'],
            'end_date' => $end,
            'guests' => $data['guests'] ?? null,
            'with_driver' => $data['type'] === 'vehicle' && ! empty($data['with_driver']),
            'extras' => $data['extras'] ?? [],
        ]);

        $booking = Booking::create([
            'user_id' => $request->user()?->id,
            'bookable_type' => $modelClass,
            'bookable_id' => $bookable->id,
            'customer_name' => $data['customer_name'],
            'customer_email' => $data['customer_email'],
            'customer_phone' => $data['customer_phone'],
            'start_date' => $data['start_date'],
            'end_date' => $end,
            'pickup_time' => $data['pickup_time'] ?? null,
            'pickup_address' => $data['pickup_address'] ?? null,
            'flight_or_train_number' => $data['flight_or_train_number'] ?? null,
            'with_driver' => $data['type'] === 'vehicle' && ! empty($data['with_driver']),
            'extras' => $quote['extras'] ?: null,
            'guests' => $data['guests'] ?? null,
            'total_price' => $quote['total'],
            'price_breakdown' => $quote['lines'],
            'exchange_rate' => Currency::kesPerUsd(),
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'notes' => $data['notes'] ?? null,
        ]);

        if ($modelClass === Vehicle::class) {
            $driver = Driver::where('vehicle_id', $bookable->id)->first();
            if ($driver) {
                Notification::forDriverJob($driver, $booking);
            }
        }

        return redirect()->route('bookings.confirmation', $booking->reference);
    }

    public function confirmation(string $reference): Response
    {
        $booking = Booking::where('reference', $reference)->with('bookable')->firstOrFail();

        return Inertia::render('Booking/Confirmation', ['booking' => $booking]);
    }
}