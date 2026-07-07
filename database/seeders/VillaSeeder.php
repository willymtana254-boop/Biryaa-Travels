<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\Villa;
use Illuminate\Database\Seeder;

class VillaSeeder extends Seeder
{
    public function run(): void
    {
        $villas = [
            ['location' => 'Kilifi', 'name' => 'Creekside Baobab Villa', 'bedrooms' => 4, 'bathrooms' => 4, 'max_guests' => 8, 'price_per_night' => 220, 'amenities' => ['Private pool', 'Creek view', 'Backup generator', 'Wi-Fi']],
            ['location' => 'Diani', 'name' => 'Diani Beachfront Retreat', 'bedrooms' => 5, 'bathrooms' => 5, 'max_guests' => 10, 'price_per_night' => 320, 'amenities' => ['Beachfront', 'Private chef', 'Infinity pool', 'AC']],
            ['location' => 'Watamu', 'name' => 'Watamu Reef House', 'bedrooms' => 3, 'bathrooms' => 3, 'max_guests' => 6, 'price_per_night' => 180, 'amenities' => ['Snorkeling access', 'Garden', 'Wi-Fi']],
            ['location' => 'Malindi', 'name' => 'Malindi Old Town Villa', 'bedrooms' => 4, 'bathrooms' => 3, 'max_guests' => 8, 'price_per_night' => 200, 'amenities' => ['Pool', 'Rooftop terrace', 'AC']],
            ['location' => 'Vipingo', 'name' => 'Vipingo Golf Estate Villa', 'bedrooms' => 4, 'bathrooms' => 4, 'max_guests' => 8, 'price_per_night' => 260, 'amenities' => ['Golf course access', 'Private pool', 'Housekeeping']],
        ];

        foreach ($villas as $villa) {
            $location = Location::where('name', $villa['location'])->first();
            if (! $location) {
                continue;
            }

            Villa::updateOrCreate(
                ['slug' => str($villa['name'])->slug()],
                [
                    'location_id' => $location->id,
                    'name' => $villa['name'],
                    'description' => "A handpicked {$villa['bedrooms']}-bedroom holiday home in {$villa['location']}, ready for families and groups.",
                    'price_per_night' => $villa['price_per_night'],
                    'bedrooms' => $villa['bedrooms'],
                    'bathrooms' => $villa['bathrooms'],
                    'max_guests' => $villa['max_guests'],
                    'amenities' => $villa['amenities'],
                    'is_available' => true,
                ]
            );
        }
    }
}
