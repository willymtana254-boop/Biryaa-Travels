<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'category', 'seats', 'transmission',
        'price_per_day', 'description', 'images', 'is_available',
    ];

    protected $casts = [
        'images' => 'array',
        'is_available' => 'boolean',
        'price_per_day' => 'decimal:2',
    ];

    public function bookings(): MorphMany
    {
        return $this->morphMany(Booking::class, 'bookable');
    }

    public function isAvailableBetween(string $start, string $end): bool
    {
        if (! $this->is_available) {
            return false;
        }

        return ! $this->bookings()
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($q) use ($start, $end) {
                $q->whereBetween('start_date', [$start, $end])
                    ->orWhereBetween('end_date', [$start, $end])
                    ->orWhere(function ($q2) use ($start, $end) {
                        $q2->where('start_date', '<=', $start)->where('end_date', '>=', $end);
                    });
            })
            ->exists();
    }
}
