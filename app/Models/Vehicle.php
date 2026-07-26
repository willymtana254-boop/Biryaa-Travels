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

    protected $appends = ['availability'];

    public function bookings(): MorphMany
    {
        return $this->morphMany(Booking::class, 'bookable');
    }

    public function getAvailabilityAttribute(): array
    {
        $today = now()->startOfDay();

        $relevant = $this->relationLoaded('bookings')
            ? $this->bookings
            : $this->bookings()->whereIn('status', ['pending', 'confirmed'])->get();

        $current = $relevant
            ->filter(fn ($b) => in_array($b->status, ['pending', 'confirmed'])
                && $b->start_date <= $today
                && $b->end_date >= $today)
            ->sortByDesc('end_date')
            ->first();

        if (! $current) {
            return ['status' => 'available', 'available_from' => null];
        }

        return [
            'status' => 'booked',
            'available_from' => $current->end_date->copy()->addDay()->toDateString(),
        ];
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