<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $locations = [
            ['name' => 'Kilifi', 'tagline' => 'Creek cruises & coastal calm', 'description' => 'Airport & SGR transfers, luxury villas and holiday homes, creek cruises and coastal experiences.'],
            ['name' => 'Mombasa', 'tagline' => 'History, hotels and the old town', 'description' => 'Airport & SGR transfers, hotels, apartments and villas, city tours and historic experiences.'],
            ['name' => 'Diani', 'tagline' => 'Beachfront stays & marine adventure', 'description' => 'Airport transfers, luxury villas and beachfront stays, marine adventures and beach experiences.'],
            ['name' => 'Watamu', 'tagline' => 'Marine park & ocean adventures', 'description' => 'Airport transfers, villas and beach resorts, marine park and ocean adventures.'],
            ['name' => 'Malindi', 'tagline' => 'Beaches, culture & ocean excursions', 'description' => 'Airport transfers, hotels and luxury villas, beaches, culture and ocean excursions.'],
            ['name' => 'Vipingo', 'tagline' => 'Golf estates & leisure', 'description' => 'Airport transfers, luxury villas and golf estates, golf, beach and leisure experiences.'],
        ];

        foreach ($locations as $location) {
            Location::updateOrCreate(
                ['slug' => str($location['name'])->slug()],
                [
                    'name' => $location['name'],
                    'tagline' => $location['tagline'],
                    'description' => $location['description'],
                ]
            );
        }
    }
}
