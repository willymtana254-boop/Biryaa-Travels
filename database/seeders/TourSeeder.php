<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\Tour;
use Illuminate\Database\Seeder;

class TourSeeder extends Seeder
{
    public function run(): void
    {
        $tours = [
            ['location' => 'Watamu', 'name' => 'Watamu Marine Park Snorkeling', 'category' => 'marine', 'price' => 45, 'duration_hours' => 4],
            ['location' => 'Diani', 'name' => 'Wasini Island Dhow Cruise', 'category' => 'marine', 'price' => 65, 'duration_hours' => 6],
            ['location' => 'Mombasa', 'name' => 'Mombasa Old Town Walking Tour', 'category' => 'cultural', 'price' => 30, 'duration_hours' => 3],
            ['location' => 'Vipingo', 'name' => 'Vipingo Ridge Golf Round', 'category' => 'golf', 'price' => 90, 'duration_hours' => 5],
            ['location' => 'Kilifi', 'name' => 'Kilifi Creek Sunset Cruise', 'category' => 'marine', 'price' => 40, 'duration_hours' => 3],
            ['location' => 'Malindi', 'name' => 'Malindi Marine Park & Old Town', 'category' => 'cultural', 'price' => 50, 'duration_hours' => 5],
        ];

        foreach ($tours as $tour) {
            $location = Location::where('name', $tour['location'])->first();
            if (! $location) {
                continue;
            }

            Tour::updateOrCreate(
                ['slug' => str($tour['name'])->slug()],
                [
                    'location_id' => $location->id,
                    'name' => $tour['name'],
                    'category' => $tour['category'],
                    'description' => "A guided {$tour['category']} experience in {$tour['location']}, led by a local, vetted operator.",
                    'price' => $tour['price'],
                    'duration_hours' => $tour['duration_hours'],
                    'is_available' => true,
                ]
            );
        }
    }
}
