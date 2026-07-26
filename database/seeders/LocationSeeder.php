<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $towns = [
            ['name' => 'Kilifi', 'tagline' => 'Creek cruises & coastal calm', 'description' => 'Airport & SGR transfers, luxury villas and holiday homes, creek cruises and coastal experiences.'],
            ['name' => 'Mombasa', 'tagline' => 'History, hotels and the old town', 'description' => 'Airport & SGR transfers, hotels, apartments and villas, city tours and historic experiences.'],
            ['name' => 'Diani', 'tagline' => 'Beachfront stays & marine adventure', 'description' => 'Airport transfers, luxury villas and beachfront stays, marine adventures and beach experiences.'],
            ['name' => 'Watamu', 'tagline' => 'Marine park & ocean adventures', 'description' => 'Airport transfers, villas and beach resorts, marine park and ocean adventures.'],
            ['name' => 'Malindi', 'tagline' => 'Beaches, culture & ocean excursions', 'description' => 'Airport transfers, hotels and luxury villas, beaches, culture and ocean excursions.'],
            ['name' => 'Vipingo', 'tagline' => 'Golf estates & leisure', 'description' => 'Airport transfers, luxury villas and golf estates, golf, beach and leisure experiences.'],
        ];

        $hubs = [
            ['name' => 'Moi International Airport (MBA)', 'tagline' => 'Mombasa\'s international gateway', 'description' => 'The major international hub of the coast region, handling global and domestic flights into Mombasa.'],
            ['name' => 'Malindi Airport (MYD)', 'tagline' => 'Coastal domestic airport', 'description' => 'A vital coastal domestic airport north of Mombasa, serving tourism and local flights for Malindi and Watamu.'],
            ['name' => 'Ukunda Airport (UUK)', 'tagline' => 'Gateway to Diani Beach', 'description' => 'Located in Diani Beach, accommodating regional domestic flights straight to the southern coast beaches.'],
            ['name' => 'Mombasa SGR Terminus', 'tagline' => 'Madaraka Express coastal endpoint', 'description' => 'Located in Miritini, 20km northwest of Mombasa city centre — the main coastal endpoint of the Nairobi–Mombasa Standard Gauge Railway.'],
            ['name' => 'Mariakani SGR Station', 'tagline' => 'Inter-county SGR stop', 'description' => 'An inter-county SGR station located inland from Mombasa, styled with architecture inspired by local coconut trees.'],
            ['name' => 'Miasenyi & Voi SGR Station', 'tagline' => 'Coastal transit toward Tsavo', 'description' => 'Regional SGR transit stops along the route towards Tsavo, with Voi featuring a prominent "V"-shaped station design.'],
        ];

        foreach ($towns as $town) {
            Location::updateOrCreate(
                ['slug' => str($town['name'])->slug()],
                array_merge($town, ['type' => 'town'])
            );
        }

        foreach ($hubs as $hub) {
            Location::updateOrCreate(
                ['slug' => str($hub['name'])->slug()],
                array_merge($hub, ['type' => 'hub'])
            );
        }
    }
}