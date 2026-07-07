<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class TransferRoute extends Model
{
    use HasFactory;

    protected $fillable = [
        'from_location_id', 'to_location_id', 'vehicle_category',
        'price', 'distance_km', 'duration_minutes',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function fromLocation(): BelongsTo
    {
        return $this->belongsTo(Location::class, 'from_location_id');
    }

    public function toLocation(): BelongsTo
    {
        return $this->belongsTo(Location::class, 'to_location_id');
    }

    public function bookings(): MorphMany
    {
        return $this->morphMany(Booking::class, 'bookable');
    }

    public function label(): string
    {
        return "{$this->fromLocation->name} → {$this->toLocation->name}";
    }
}
