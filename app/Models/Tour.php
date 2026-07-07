<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Tour extends Model
{
    use HasFactory;

    protected $fillable = [
        'location_id', 'name', 'slug', 'category', 'description',
        'price', 'duration_hours', 'images', 'is_available',
    ];

    protected $casts = [
        'images' => 'array',
        'is_available' => 'boolean',
        'price' => 'decimal:2',
    ];

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function bookings(): MorphMany
    {
        return $this->morphMany(Booking::class, 'bookable');
    }
}
