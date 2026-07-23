<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Driver extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'phone', 'license_number', 'photo', 'is_available', 'vehicle_id',
    ];

    protected $casts = [
        'is_available' => 'boolean',
    ];

    /**
     * The vehicle this driver is currently assigned to, if any.
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function scopeAvailable($query)
    {
        return $query->where('is_available', true)->whereNull('vehicle_id');
    }
}
