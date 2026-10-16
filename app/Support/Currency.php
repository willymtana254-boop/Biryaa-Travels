<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;

class Currency
{
    public static function kesPerUsd(): float
    {
        try {
            $rate = Cache::get('kes_per_usd');
        } catch (\Throwable) {
            $rate = null;
        }

        return (float) ($rate ?: config('pricing.currency.kes_per_usd'));
    }
}