<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Driver;
use App\Models\Notification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Notifications/Index', [
            'notifications' => Notification::with(['notifiable', 'booking'])->latest()->paginate(20),
        ]);
    }

    public function markSent(Notification $notification): RedirectResponse
    {
        $notification->update(['status' => 'sent', 'sent_at' => now()]);

        return back()->with('success', 'Marked as sent.');
    }

    /**
     * Manually assign + notify a driver for a transfer booking
     * (transfers aren't tied to a single vehicle, so this can't be automatic).
     */
    public function assignTransferDriver(Request $request, Booking $booking): RedirectResponse
    {
        $data = $request->validate([
            'driver_id' => ['required', 'exists:drivers,id'],
        ]);

        $driver = Driver::findOrFail($data['driver_id']);

        $route = $booking->bookable;
        $leg = $route ? "{$route->fromLocation?->name} → {$route->toLocation?->name}" : 'transfer';

        $message = "Hi {$driver->name}, transfer job: {$leg}. "
        ."Date: {$booking->start_date->toDateString()}".($booking->pickup_time ? ' at '.substr($booking->pickup_time, 0, 5) : '').'. '
        .($booking->pickup_address ? "Address: {$booking->pickup_address}. " : '')
        .($booking->flight_or_train_number ? "Flight/train: {$booking->flight_or_train_number}. " : '')
        ."Customer: {$booking->customer_name} ({$booking->customer_phone}). Ref: {$booking->reference}.";
        Notification::create([
            'notifiable_type' => Driver::class,
            'notifiable_id' => $driver->id,
            'booking_id' => $booking->id,
            'purpose' => 'driver_job_assigned',
            'phone' => $driver->phone,
            'message' => $message,
        ]);

        return back()->with('success', 'Driver notified.');
    }
}