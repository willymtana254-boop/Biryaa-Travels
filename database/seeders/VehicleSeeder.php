<?php

namespace Database\Seeders;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        $vehicles = [
            ['name' => 'Toyota RAV4', 'category' => 'All', 'SUV', 'seats' => 5, 'transmission' => 'automatic', 'price_per_day' => 75, 'image' => 'rav4-suv.jpg'],
            ['name' => 'Toyota Noah', 'category' => 'All', 'Van', 'seats' => 8, 'transmission' => 'automatic', 'price_per_day' => 90, 'image' => 'noah-van.jpg'],
            ['name' => 'Toyota fielder', 'category' => 'All', 'Executive', 'seats' => 5, 'transmission' => 'automatic', 'price_per_day' => 60, 'image' => 'fielder-sedan.jpg'],
           
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