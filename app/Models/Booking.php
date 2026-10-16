<?php

namespace App\Models;

use App\Support\Phone;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Str;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference', 'user_id', 'bookable_type', 'bookable_id',
        'customer_name', 'customer_email', 'customer_phone',
        'start_date', 'end_date', 'pickup_time', 'pickup_address', 'flight_or_train_number',
        'with_driver', 'extras', 'guests', 'total_price', 'price_breakdown', 'exchange_rate',
        'status', 'payment_status', 'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'total_price' => 'decimal:2',
        'with_driver' => 'boolean',
        'extras' => 'array',
        'price_breakdown' => 'array',
        'exchange_rate' => 'decimal:4',
    ];

    protected static function booted(): void
    {
        static::creating(function (Booking $booking) {
            $booking->reference ??= 'GBR-'.strtoupper(Str::random(8));
        });
    }

    protected function customerPhone(): Attribute
    {
        return Attribute::make(set: fn ($value) => Phone::normalize($value));
    }

    public function bookable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }
}