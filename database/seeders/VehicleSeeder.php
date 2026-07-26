<?php

namespace Database\Seeders;

use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        $vehicles = [
            ['name' => 'Toyota Vitz', 'category' => 'economy', 'seats' => 4, 'transmission' => 'automatic', 'price_per_day' => 35, 'image' => 'vitz-economy.jpg'],
            ['name' => 'Toyota Yaris', 'category' => 'economy', 'seats' => 5, 'transmission' => 'automatic', 'price_per_day' => 38, 'image' => 'yaris-economy.jpg'],
            ['name' => 'Toyota Aqua Hybrid', 'category' => 'economy', 'seats' => 5, 'transmission' => 'automatic', 'price_per_day' => 40, 'image' => 'aqua-economy.jpg'],
            ['name' => 'Volkswagen Polo', 'category' => 'economy', 'seats' => 5, 'transmission' => 'automatic', 'price_per_day' => 38, 'image' => 'polo-economy.jpg'],
            ['name' => 'Toyota Axio', 'category' => 'midsize', 'seats' => 5, 'transmission' => 'automatic', 'price_per_day' => 45, 'image' => 'axio-midsize.jpg'],
            ['name' => 'Toyota Mark X', 'category' => 'midsize', 'seats' => 5, 'transmission' => 'automatic', 'price_per_day' => 55, 'image' => 'markx-midsize.jpg'],
            ['name' => 'Toyota RAV4', 'category' => 'suv', 'seats' => 5, 'transmission' => 'automatic', 'price_per_day' => 75, 'image' => 'rav4-suv.jpg'],
            ['name' => 'Honda HR-V', 'category' => 'suv', 'seats' => 5, 'transmission' => 'automatic', 'price_per_day' => 70, 'image' => 'hrv-suv.jpg'],
            ['name' => 'Land Rover Defender', 'category' => 'suv', 'seats' => 5, 'transmission' => 'automatic', 'price_per_day' => 150, 'image' => 'defender-suv.jpg'],
            ['name' => 'Range Rover Sport', 'category' => 'executive', 'seats' => 5, 'transmission' => 'automatic', 'price_per_day' => 220, 'image' => 'rangerover-executive.jpg'],
            ['name' => 'Toyota Land Cruiser VX V8', 'category' => 'executive', 'seats' => 7, 'transmission' => 'automatic', 'price_per_day' => 200, 'image' => 'landcruiser-executive.jpg'],
            ['name' => 'Toyota Noah', 'category' => 'van', 'seats' => 8, 'transmission' => 'automatic', 'price_per_day' => 90, 'image' => 'noah-van.jpg'],
            ['name' => 'Toyota Alphard (Executive Shuttle)', 'category' => 'van', 'seats' => 6, 'transmission' => 'automatic', 'price_per_day' => 180, 'image' => 'alphard-van.jpg'],
            ['name' => 'Coaster Mini Bus', 'category' => 'bus', 'seats' => 16, 'transmission' => 'manual', 'price_per_day' => 180, 'image' => null],
        ];

        foreach ($vehicles as $vehicle) {
            Vehicle::updateOrCreate(
                ['slug' => str($vehicle['name'])->slug()],
                [
                    'name' => $vehicle['name'],
                    'category' => $vehicle['category'],
                    'seats' => $vehicle['seats'],
                    'transmission' => $vehicle['transmission'],
                    'price_per_day' => $vehicle['price_per_day'],
                    'description' => "Fully insured {$vehicle['name']} in excellent condition, ready for self-drive hire across the Kenyan Coast.",
                    'images' => $vehicle['image'] ? ["/images/vehicles/{$vehicle['image']}"] : null,
                    'is_available' => true,
                ]
            );
        }
    }
}