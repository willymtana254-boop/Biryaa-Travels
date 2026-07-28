<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Models\Notification;
use App\Models\Villa;
use Illuminate\Console\Command;

class NotifyVillasOfArrivals extends Command
{
    protected $signature = 'bookings:notify-villas';

    protected $description = 'Generate WhatsApp-ready commission notices for villas whose guests arrive today.';

    public function handle(): int
    {
        $bookings = Booking::where('bookable_type', Villa::class)
            ->whereIn('status', ['pending', 'confirmed'])
            ->whereDate('start_date', today())
            ->get();

        $count = 0;

        foreach ($bookings as $booking) {
            $alreadyNotified = Notification::where('booking_id', $booking->id)
                ->where('purpose', 'villa_commission_due')
                ->exists();

            if ($alreadyNotified) {
                continue;
            }

            $villa = $booking->bookable;

            if (! $villa || ! $villa->contact_phone) {
                continue;
            }

            Notification::forVillaCommission($villa, $booking);
            $count++;
        }

        $this->info("Generated {$count} villa commission notice(s).");

        return self::SUCCESS;
    }
}