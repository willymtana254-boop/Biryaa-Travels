<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    public const SERVICES = [
        'car_hire' => 'Car hire',
        'transfer' => 'Airport / SGR transfer',
        'accommodation' => 'Accommodation',
        'experience' => 'Tour / experience',
    ];

    protected $fillable = [
        'name', 'location', 'service', 'rating', 'message', 'booking_id',
        'verified', 'source', 'is_approved', 'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'verified' => 'boolean',
            'is_approved' => 'boolean',
            'is_featured' => 'boolean',
            'rating' => 'integer',
        ];
    }

    /** What the public is allowed to see. Never includes the booking link. */
    public function toPublic(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'location' => $this->location,
            'service' => self::SERVICES[$this->service] ?? null,
            'rating' => $this->rating,
            'message' => $this->message,
            'verified' => $this->verified,
            'date' => $this->created_at?->format('M Y'),
        ];
    }
}
