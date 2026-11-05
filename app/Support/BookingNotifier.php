<?php

namespace App\Support;

use App\Mail\BookingMessage;
use App\Models\Booking;
use App\Models\Vehicle;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Sends the booking emails (and optional texts).
 * Nothing in here is allowed to break a booking: every send is wrapped so a mail problem is only logged.
 */
class BookingNotifier
{
    private static function safe(callable $fn, string $what): void
    {
        try {
            $fn();
        } catch (\Throwable $e) {
            Log::warning("Booking notification failed ({$what}): ".$e->getMessage());
        }
    }

    private static function day($value): ?string
    {
        return $value ? Carbon::parse($value)->format('D j M Y') : null;
    }

    private static function money(Booking $b): string
    {
        $usd = (float) $b->total_price;
        $rate = (float) ($b->exchange_rate ?: 0);

        return $rate > 0
            ? 'KES '.number_format(round($usd * $rate)).' (about US$ '.number_format($usd, 2).')'
            : 'US$ '.number_format($usd, 2);
    }

    private static function e164(?string $phone): ?string
    {
        $digits = preg_replace('/\D+/', '', (string) $phone);

        return $digits ? '+'.$digits : null;
    }

    private static function rows(Booking $b): array
    {
        $b->loadMissing('bookable');

        return [
            'Reference' => $b->reference,
            'Booking' => BookingLabels::type($b->bookable_type).': '.BookingLabels::title($b),
            'From' => self::day($b->start_date),
            'To' => $b->end_date && $b->end_date != $b->start_date ? self::day($b->end_date) : null,
            'Pickup time' => $b->pickup_time ? substr($b->pickup_time, 0, 5) : null,
            'Guests' => $b->guests,
            'Driver' => $b->with_driver ? 'Requested' : null,
            'Estimated total' => self::money($b),
        ];
    }

    /** Called right after a booking is made. */
    public static function received(Booking $b): void
    {
        $isCar = $b->bookable_type === Vehicle::class;

        // 1. Customer email
        self::safe(function () use ($b, $isCar) {
            if (! filled($b->customer_email)) {
                return;
            }

            Mail::to($b->customer_email)->send(new BookingMessage([
                'subject' => "We received your booking {$b->reference}",
                'heading' => 'Thank you, '.explode(' ', trim($b->customer_name))[0].'!',
                'intro' => 'We have received your booking request. Our team will contact you shortly on WhatsApp or email to confirm the details and arrange payment.',
                'rows' => self::rows($b),
                'button' => $isCar ? ['label' => 'Complete your car hire verification', 'url' => url('/verify?ref='.$b->reference)] : null,
                'note' => $isCar
                    ? 'To confirm a car hire we need to verify the hirer: ID or passport, driving licence, address and a live selfie. Please complete this before your pickup date.'
                    : 'This is a booking request, not yet a confirmed booking. Keep your reference number for any enquiry.',
            ]));
        }, 'customer email');

        // 2. Team email
        self::safe(function () use ($b) {
            $to = config('biryaa.alert_email');
            if (! filled($to)) {
                return;
            }

            $wa = 'https://wa.me/'.ltrim(preg_replace('/\D+/', '', (string) $b->customer_phone), '0');

            Mail::to($to)->send(new BookingMessage([
                'subject' => "New booking {$b->reference}: {$b->customer_name}",
                'heading' => 'New booking received',
                'intro' => 'A customer has just made a booking on the website.',
                'rows' => self::rows($b) + [
                    'Customer' => $b->customer_name,
                    'Phone' => $b->customer_phone,
                    'Email' => $b->customer_email,
                    'Notes' => $b->notes,
                    'WhatsApp' => $wa,
                ],
                'button' => ['label' => 'Open in admin', 'url' => url('/admin/bookings/'.$b->id)],
            ]));
        }, 'team email');

        // 3. Optional texts
        self::safe(function () use ($b) {
            if (! Sms::configured()) {
                return;
            }

            if (filled(config('biryaa.alert_phone'))) {
                Sms::send(config('biryaa.alert_phone'), "New booking {$b->reference}: {$b->customer_name} {$b->customer_phone}. ".BookingLabels::title($b));
            }

            if (config('biryaa.sms_customer') && ($to = self::e164($b->customer_phone))) {
                Sms::send($to, "Biryaa Travels: we received your booking {$b->reference}. We will contact you shortly.");
            }
        }, 'sms');
    }

    /** Called when staff change a booking to confirmed or cancelled. */
    public static function statusChanged(Booking $b): void
    {
        if (! in_array($b->status, ['confirmed', 'cancelled'], true) || ! filled($b->customer_email)) {
            return;
        }

        self::safe(function () use ($b) {
            $confirmed = $b->status === 'confirmed';

            Mail::to($b->customer_email)->send(new BookingMessage([
                'subject' => ($confirmed ? 'Your booking is confirmed: ' : 'Your booking was cancelled: ').$b->reference,
                'heading' => $confirmed ? 'Your booking is confirmed' : 'Your booking was cancelled',
                'intro' => $confirmed
                    ? 'Good news! Your booking is confirmed. We look forward to hosting you.'
                    : 'Your booking has been cancelled. If this is a surprise, please contact us and we will help.',
                'rows' => self::rows($b),
                'note' => $confirmed ? 'Please keep this email. Reply or WhatsApp us if anything changes.' : null,
            ]));
        }, 'status email');
    }
}
