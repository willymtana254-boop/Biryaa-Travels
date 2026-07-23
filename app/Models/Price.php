<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Price extends Model
{
    use HasFactory;

    protected $fillable = ['category', 'price_per_day', 'notes'];

    protected $casts = [
        'price_per_day' => 'decimal:2',
    ];

    public static function forCategory(string $category): ?self
    {
        return static::where('category', $category)->first();
    }
}
