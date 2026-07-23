<?php

namespace Database\Seeders;

use App\Models\Price;
use Illuminate\Database\Seeder;

class PriceSeeder extends Seeder
{
    public function run(): void
    {
        $rates = [
            'economy' => 3000,
            'midsize' => 4800,
            'suv' => 7500,
            'executive' => 14000,
            'van' => 9500,
            'bus' => 16000,
        ];

        foreach ($rates as $category => $pricePerDay) {
            Price::updateOrCreate(['category' => $category], ['price_per_day' => $pricePerDay]);
        }
    }
}
