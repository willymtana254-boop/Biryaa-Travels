<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'tagline', 'description', 'hero_image'];

    public function villas(): HasMany
    {
        return $this->hasMany(Villa::class);
    }

    public function tours(): HasMany
    {
        return $this->hasMany(Tour::class);
    }

    public function transfersFrom(): HasMany
    {
        return $this->hasMany(TransferRoute::class, 'from_location_id');
    }

    public function transfersTo(): HasMany
    {
        return $this->hasMany(TransferRoute::class, 'to_location_id');
    }
}
