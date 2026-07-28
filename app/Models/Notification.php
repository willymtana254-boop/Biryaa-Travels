<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'notifiable_type', 'notifiable_id', 'booking_id',
        'purpose', 'phone', 'message', 'status', 'sent_at',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
    ];

    public function notifiable(): MorphTo
    {
        return $this->morphTo();
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function whatsappUrl(): string
    {
        $digits = preg_replace('/\D/', '', $this->phone);

        return 'https://wa.me/'.$digits.'?text='.urlencode($this->message);
    }

    public static function forDriverJob(Driver $driver, Booking $booking): self
    {
        $vehicle = $booking->bookable;

        $message = "Hi {$driver->name}, you've been assigned a new booking on {$vehicle->name}. "
            ."Customer: {$booking->customer_name} ({$booking->customer_phone}). "
            ."Dates: {$booking->start_date->toDateString()} to {$booking->end_date->toDateString()}. "
            ."Reference: {$booking->reference}.";

        return self::create([
            'notifiable_type' => Driver::class,
            'notifiable_id' => $driver->id,
            'booking_id' => $booking->id,
            'purpose' => 'driver_job_assigned',
            'phone' => $driver->phone,
            'message' => $message,
        ]);
    }

    public static function forVillaCommission(Villa $villa, Booking $booking): self
    {
        $commission = round($booking->total_price * ($villa->commission_rate / 100), 2);

        $message = "Hi {$villa->contact_name}, your guest {$booking->customer_name} is arriving today at {$villa->name} "
            ."(booking {$booking->reference}). Commission due to Biryaa Travels: \${$commission} "
            ."({$villa->commission_rate}% of \${$booking->total_price}).";

        return self::create([
            'notifiable_type' => Villa::class,
            'notifiable_id' => $villa->id,
            'booking_id' => $booking->id,
            'purpose' => 'villa_commission_due',
            'phone' => $villa->contact_phone,
            'message' => $message,
        ]);
    }
}