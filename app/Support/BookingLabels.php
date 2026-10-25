<?php

namespace App\Support;

use App\Models\Booking;
use App\Models\Tour;
use App\Models\TransferRoute;
use App\Models\Vehicle;
use App\Models\Villa;
use Illuminate\Support\Carbon;

/**
 * Turns a Booking into the plain array the admin screens need.
 */
class BookingLabels
{
    public static function type(?string $class): string
    {
        return match ($class) {
            Vehicle::class => 'Car Hire',
            Villa::class => 'Accommodation',
            Tour::class => 'Experience',
            TransferRoute::class => 'Transfer',
            default => 'Unknown',
        };
    }

    public static function title(Booking $booking): string
    {
        $item = $booking->bookable;

        if (! $item) {
            return 'Item removed';
        }

        if ($item instanceof TransferRoute) {
            return ($item->fromLocation?->name ?? '?').' → '.($item->toLocation?->name ?? '?');
        }

        return $item->name ?? ('#'.$item->id);
    }

    private static function date($value): ?string
    {
        return $value ? Carbon::parse($value)->toDateString() : null;
    }

    public static function row(Booking $booking): array
    {
        return [
            'id' => $booking->id,
            'reference' => $booking->reference,
            'customer_name' => $booking->customer_name,
            'customer_email' => $booking->customer_email,
            'customer_phone' => $booking->customer_phone,
            'start_date' => self::date($booking->start_date),
            'end_date' => self::date($booking->end_date),
            'total_price' => $booking->total_price,
            'status' => $booking->status,
            'payment_status' => $booking->payment_status,
            'type' => self::type($booking->bookable_type),
            'title' => self::title($booking),
            'created_at' => optional($booking->created_at)->toIso8601String(),
        ];
    }
}
