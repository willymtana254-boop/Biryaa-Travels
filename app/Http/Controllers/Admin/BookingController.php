<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        $bookings = Booking::with('bookable')
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $bookings,
            'filters' => $request->only('status'),
        ]);
    }

    public function show(Booking $booking): Response
    {
      $booking->load(['bookable', 'user']);

      return Inertia::render('Admin/Bookings/Show', [
        'booking' => $booking,
        'bookingType' => match ($booking->bookable_type) {
            \App\Models\Vehicle::class => 'Car Hire',
            \App\Models\Villa::class => 'Villa',
            \App\Models\Tour::class => 'Experience',
            \App\Models\TransferRoute::class => 'Airport / SGR Transfer',
            default => 'Unknown',
        },
      ]);
    }

    public function update(Request $request, Booking $booking): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['sometimes', Rule::in(['pending', 'confirmed', 'cancelled', 'completed'])],
            'payment_status' => ['sometimes', Rule::in(['unpaid', 'paid', 'refunded'])],
        ]);

        $booking->update($data);

        return back()->with('success', 'Booking updated.');
    }
}