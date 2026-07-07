<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\TransferRoute;
use Illuminate\Database\Seeder;

class TransferRouteSeeder extends Seeder
{
    public function run(): void
    {
        $byName = fn (string $name) => Location::where('name', $name)->first()?->id;

        // Mombasa Airport is modeled as a stop within "Mombasa" for simplicity.
        $routes = [
            ['from' => 'Mombasa', 'to' => 'Kilifi', 'vehicle_category' => 'sedan', 'price' => 40, 'distance_km' => 60, 'duration_minutes' => 75],
            ['from' => 'Mombasa', 'to' => 'Diani', 'vehicle_category' => 'sedan', 'price' => 35, 'distance_km' => 45, 'duration_minutes' => 60],
            ['from' => 'Mombasa', 'to' => 'Watamu', 'vehicle_category' => 'suv', 'price' => 55, 'distance_km' => 105, 'duration_minutes' => 120],
            ['from' => 'Mombasa', 'to' => 'Malindi', 'vehicle_category' => 'suv', 'price' => 60, 'distance_km' => 120, 'duration_minutes' => 135],
            ['from' => 'Malindi', 'to' => 'Watamu', 'vehicle_category' => 'sedan', 'price' => 20, 'distance_km' => 25, 'duration_minutes' => 30],
            ['from' => 'Malindi', 'to' => 'Kilifi', 'vehicle_category' => 'sedan', 'price' => 30, 'distance_km' => 55, 'duration_minutes' => 60],
            ['from' => 'Diani', 'to' => 'Mombasa', 'vehicle_category' => 'mini_van', 'price' => 45, 'distance_km' => 45, 'duration_minutes' => 60],
            ['from' => 'Mombasa', 'to' => 'Vipingo', 'vehicle_category' => 'sedan', 'price' => 30, 'distance_km' => 40, 'duration_minutes' => 50],
        ];

        foreach ($routes as $route) {
            $fromId = $byName($route['from']);
            $toId = $byName($route['to']);
            if (! $fromId || ! $toId) {
                continue;
            }

            TransferRoute::updateOrCreate(
                [
                    'from_location_id' => $fromId,
                    'to_location_id' => $toId,
                    'vehicle_category' => $route['vehicle_category'],
                ],
                [
                    'price' => $route['price'],
                    'distance_km' => $route['distance_km'],
                    'duration_minutes' => $route['duration_minutes'],
                ]
            );
        }
    }
}
