<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Str;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference', 'user_id', 'bookable_type', 'bookable_id',
        'customer_name', 'customer_email', 'customer_phone',
        'start_date', 'end_date', 'guests', 'total_price',
        'status', 'payment_status', 'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'total_price' => 'decimal:2',
    ];

    protected static function booted(): void
    {
        static::creating(function (Booking $booking) {
            $booking->reference ??= 'GBR-'.strtoupper(Str::random(8));
        });
    }

    public function bookable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
