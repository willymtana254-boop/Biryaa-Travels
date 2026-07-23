<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    /**
     * A logged-in user's own car hire record.
     */
    public function index(Request $request): Response
    {
        $bookings = $request->user()
            ->bookings()
            ->where('bookable_type', Vehicle::class)
            ->with('bookable')
            ->latest()
            ->get();

        return Inertia::render('Account/MyBookings', [
            'bookings' => $bookings,
        ]);
    }
}
