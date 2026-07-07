<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Tour;
use App\Models\Vehicle;
use App\Models\Villa;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        return \Inertia\Inertia::render('Admin/Dashboard', [
            'stats' => [
                'pendingBookings' => Booking::where('status', 'pending')->count(),
                'confirmedBookings' => Booking::where('status', 'confirmed')->count(),
                'vehicles' => Vehicle::count(),
                'villas' => Villa::count(),
                'tours' => Tour::count(),
                'revenueThisMonth' => Booking::where('payment_status', 'paid')
                    ->whereMonth('created_at', now()->month)
                    ->sum('total_price'),
            ],
            'recentBookings' => Booking::with('bookable')->latest()->take(10)->get(),
        ]);
    }
}