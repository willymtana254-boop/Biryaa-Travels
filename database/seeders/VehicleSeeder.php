<?php

namespace Database\Seeders;

use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        $vehicles = [
            ['name' => 'Toyota Vitz', 'category' => 'economy', 'seats' => 4, 'transmission' => 'automatic', 'price_per_day' => 35],
            ['name' => 'Toyota Axio', 'category' => 'midsize', 'seats' => 5, 'transmission' => 'automatic', 'price_per_day' => 45],
            ['name' => 'Toyota RAV4', 'category' => 'suv', 'seats' => 5, 'transmission' => 'automatic', 'price_per_day' => 75],
            ['name' => 'Toyota Land Cruiser Prado', 'category' => 'executive', 'seats' => 7, 'transmission' => 'automatic', 'price_per_day' => 130],
            ['name' => 'Toyota Noah', 'category' => 'van', 'seats' => 8, 'transmission' => 'automatic', 'price_per_day' => 90],
            ['name' => 'Coaster Mini Bus', 'category' => 'bus', 'seats' => 16, 'transmission' => 'manual', 'price_per_day' => 180],
        ];

        foreach ($vehicles as $vehicle) {
            Vehicle::updateOrCreate(
                ['slug' => str($vehicle['name'])->slug()],
                array_merge($vehicle, [
                    'slug' => str($vehicle['name'])->slug(),
                    'description' => "Fully insured {$vehicle['name']} in excellent condition, ready for self-drive hire across the Kenyan Coast.",
                    'is_available' => true,
                ])
            );
        }
    }
}
