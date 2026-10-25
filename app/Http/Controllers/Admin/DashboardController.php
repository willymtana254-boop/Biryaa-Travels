<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Review;
use App\Models\Tour;
use App\Models\Vehicle;
use App\Models\Villa;
use App\Support\BookingLabels;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $today = now()->toDateString();
        $weekAhead = now()->addDays(7)->toDateString();
        $live = ['pending', 'confirmed'];

        $unpaid = Booking::where('payment_status', 'unpaid')->whereIn('status', $live);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'newToday' => Booking::whereDate('created_at', $today)->count(),
                'pendingBookings' => Booking::where('status', 'pending')->count(),
                'confirmedBookings' => Booking::where('status', 'confirmed')->count(),
                'unpaidCount' => (clone $unpaid)->count(),
                'unpaidAmount' => (clone $unpaid)->sum('total_price'),
                'revenueThisMonth' => Booking::where('payment_status', 'paid')
                    ->whereYear('created_at', now()->year)
                    ->whereMonth('created_at', now()->month)
                    ->sum('total_price'),
                'pendingReviews' => Review::where('status', 'pending')->count(),
                'vehicles' => Vehicle::count(),
                'villas' => Villa::count(),
                'tours' => Tour::count(),
            ],
            'upcoming' => Booking::with('bookable')
                ->whereIn('status', $live)
                ->whereBetween('start_date', [$today, $weekAhead])
                ->orderBy('start_date')
                ->take(8)
                ->get()
                ->map(fn ($b) => BookingLabels::row($b))
                ->values(),
            'recentBookings' => Booking::with('bookable')
                ->latest()
                ->take(8)
                ->get()
                ->map(fn ($b) => BookingLabels::row($b))
                ->values(),
        ]);
    }
}
