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
            // Kilifi
            ['loc' => 'Kilifi', 'name' => 'Creekside Baobab Villa', 'beds' => 4, 'baths' => 4, 'guests' => 8, 'price' => 220,
                'amenities' => ['Private pool', 'Creek view', 'Backup generator', 'Wi-Fi'],
                'blurb' => 'A creekside family villa shaded by an ancient baobab, with a private pool and a deck made for sundowners over Kilifi Creek.'],
            ['loc' => 'Kilifi', 'name' => 'Kilifi Creek Treehouse Loft', 'beds' => 2, 'baths' => 2, 'guests' => 4, 'price' => 130,
                'amenities' => ['Creek view', 'Open-air deck', 'Kayaks', 'Wi-Fi'],
                'blurb' => 'A raised timber loft above the creek, ideal for couples and small families who want quiet mornings and kayaks at the door.'],
            // Mombasa & north mainland
            ['loc' => 'Mombasa', 'name' => 'Old Town Swahili Courtyard House', 'beds' => 3, 'baths' => 3, 'guests' => 6, 'price' => 150,
                'amenities' => ['Courtyard garden', 'Rooftop terrace', 'AC', 'Wi-Fi'],
                'blurb' => 'A restored Swahili house steps from Fort Jesus, with carved doors, a shaded courtyard and a rooftop view over the old harbour.'],
            ['loc' => 'Nyali', 'name' => 'Nyali Oceanview Penthouse', 'beds' => 3, 'baths' => 3, 'guests' => 6, 'price' => 190,
                'amenities' => ['Ocean view', 'Shared pool', 'Gym', 'AC', 'Wi-Fi', 'Secure parking'],
                'blurb' => 'A top-floor penthouse with sweeping Indian Ocean views, a short drive from Nyali beach, restaurants and the city.'],
            ['loc' => 'Nyali', 'name' => 'Nyali Palm Garden Villa', 'beds' => 4, 'baths' => 4, 'guests' => 8, 'price' => 210,
                'amenities' => ['Private pool', 'Garden', 'Housekeeping', 'AC', 'Wi-Fi'],
                'blurb' => 'A private villa in a leafy palm garden with its own pool, perfect for families and longer stays.'],
            ['loc' => 'Bamburi', 'name' => 'Bamburi Beach Family Villa', 'beds' => 5, 'baths' => 5, 'guests' => 10, 'price' => 260,
                'amenities' => ['Beach access', 'Private pool', 'Housekeeping', 'BBQ area', 'AC'],
                'blurb' => 'A spacious beach-side villa with a big pool and BBQ terrace, built for family holidays and reunions.'],
            ['loc' => 'Shanzu', 'name' => 'Shanzu Coral Cove Villa', 'beds' => 4, 'baths' => 4, 'guests' => 8, 'price' => 230,
                'amenities' => ['Beachfront', 'Private pool', 'Chef on request', 'AC', 'Wi-Fi'],
                'blurb' => 'Right on a quiet cove with reef snorkelling from the sand and a chef available for beachfront dinners.'],
            ['loc' => 'Mtwapa', 'name' => 'Mtwapa Creek Retreat', 'beds' => 3, 'baths' => 3, 'guests' => 6, 'price' => 140,
                'amenities' => ['Creek view', 'Pool', 'Boat jetty', 'Wi-Fi'],
                'blurb' => 'A relaxed waterfront home with its own jetty, close to the marinas and deep-sea fishing charters.'],
            ['loc' => 'Kikambala', 'name' => 'Kikambala Coconut Grove Villa', 'beds' => 4, 'baths' => 4, 'guests' => 8, 'price' => 200,
                'amenities' => ['Beach access', 'Pool', 'Coconut grove garden', 'Housekeeping'],
                'blurb' => 'Hammocks under coconut palms, a pool and a short walk to an open white-sand beach.'],
            // South coast
            ['loc' => 'Diani', 'name' => 'Diani Beachfront Retreat', 'beds' => 5, 'baths' => 5, 'guests' => 10, 'price' => 320,
                'amenities' => ['Beachfront', 'Private chef', 'Infinity pool', 'AC'],
                'blurb' => 'Step from the infinity pool straight onto Diani\'s white sand, with a private chef and room for the whole group.'],
            ['loc' => 'Diani', 'name' => 'Galu Kinondo Garden Villa', 'beds' => 6, 'baths' => 6, 'guests' => 12, 'price' => 380,
                'amenities' => ['Private pool', 'Large garden', 'Chef on request', 'Beach 5 min walk', 'AC'],
                'blurb' => 'A big garden villa built for large groups, weddings parties and multi-family holidays, a short walk from the beach.'],
            ['loc' => 'Tiwi', 'name' => 'Tiwi Cliffside Cottage', 'beds' => 2, 'baths' => 2, 'guests' => 4, 'price' => 110,
                'amenities' => ['Ocean view', 'Secluded beach', 'Hammock deck', 'Wi-Fi'],
                'blurb' => 'A secluded cottage above a quiet cove, made for couples who want ocean sounds and nothing else.'],
            ['loc' => 'Msambweni', 'name' => 'Msambweni Lagoon Lodge', 'beds' => 4, 'baths' => 4, 'guests' => 8, 'price' => 175,
                'amenities' => ['Lagoon view', 'Pool', 'Kayaks', 'Backup generator'],
                'blurb' => 'A lodge on a calm lagoon with kayaks, a pool and uncrowded beaches on your doorstep.'],
            ['loc' => 'Shimoni', 'name' => 'Shimoni Dhow House', 'beds' => 3, 'baths' => 3, 'guests' => 6, 'price' => 160,
                'amenities' => ['Sea view', 'Dhow trips arranged', 'Garden', 'Wi-Fi'],
                'blurb' => 'Base yourself near the dhow jetty for Wasini Island and Kisite-Mpunguti marine park trips, with sea views from the veranda.'],
            // North coast
            ['loc' => 'Watamu', 'name' => 'Watamu Reef House', 'beds' => 3, 'baths' => 3, 'guests' => 6, 'price' => 180,
                'amenities' => ['Snorkeling access', 'Garden', 'Wi-Fi'],
                'blurb' => 'A breezy house beside the reef, minutes from Watamu Marine Park and the turtle-nesting beaches.'],
            ['loc' => 'Watamu', 'name' => 'Watamu Turtle Bay Villa', 'beds' => 5, 'baths' => 5, 'guests' => 10, 'price' => 290,
                'amenities' => ['Private pool', 'Sea view', 'Housekeeping', 'Chef on request', 'AC'],
                'blurb' => 'A premium sea-view villa with a pool, staff and space for two families, close to Turtle Bay.'],
            ['loc' => 'Malindi', 'name' => 'Malindi Old Town Villa', 'beds' => 4, 'baths' => 3, 'guests' => 8, 'price' => 200,
                'amenities' => ['Pool', 'Rooftop terrace', 'AC'],
                'blurb' => 'A characterful villa near Malindi\'s old town, with a rooftop terrace for sunsets and a cool pool for the afternoons.'],
            ['loc' => 'Malindi', 'name' => 'Malindi Sailfish Beach House', 'beds' => 6, 'baths' => 6, 'guests' => 12, 'price' => 340,
                'amenities' => ['Beachfront', 'Pool', 'Deep-sea fishing arranged', 'Housekeeping', 'AC'],
                'blurb' => 'A large beachfront house for groups, with fishing charters arranged from the doorstep.'],
            ['loc' => 'Vipingo', 'name' => 'Vipingo Golf Estate Villa', 'beds' => 4, 'baths' => 4, 'guests' => 8, 'price' => 260,
                'amenities' => ['Golf course access', 'Private pool', 'Housekeeping'],
                'blurb' => 'A fairway-side villa on the Vipingo estate, with a private pool and easy beach access.'],
            // Lamu
            ['loc' => 'Lamu', 'name' => 'Shela Dhow-View House', 'beds' => 4, 'baths' => 4, 'guests' => 8, 'price' => 240,
                'amenities' => ['Seafront terrace', 'Dhow trips arranged', 'Housekeeping', 'Rooftop lounge'],
                'blurb' => 'A whitewashed Shela house overlooking the dhows, with a rooftop lounge and boat trips arranged on request.'],
            ['loc' => 'Lamu', 'name' => 'Lamu Old Town Jahazi House', 'beds' => 3, 'baths' => 3, 'guests' => 6, 'price' => 170,
                'amenities' => ['Swahili courtyard', 'Rooftop terrace', 'Cooling fans', 'Waterfront walk'],
                'blurb' => 'A centuries-old stone house in the heart of Lamu Town, with a cool courtyard and a rooftop view over the harbour.'],
        ];

        foreach ($villas as $v) {
            $location = Location::where('name', $v['loc'])->first();
            if (! $location) {
                continue;
            }

            $slug = str($v['name'])->slug()->toString();
            $photos = $this->photosFor($slug);

            if (empty($photos)) {
                $this->command?->warn("No photos yet for {$v['name']} — add public/images/villas/{$slug}-1.jpg");
            }

            Villa::updateOrCreate(
                ['slug' => $slug],
                [
                    'location_id' => $location->id,
                    'name' => $v['name'],
                    'description' => $v['blurb'],
                    'price_per_night' => $v['price'],
                    'bedrooms' => $v['beds'],
                    'bathrooms' => $v['baths'],
                    'max_guests' => $v['guests'],
                    'amenities' => $v['amenities'],
                    'images' => $photos ?: null,
                    'is_available' => true,
                ]
            );
        }
    }

    /**
     * Finds {slug}-1.jpg, {slug}-2.jpg ... in public/images/villas.
     * (Avoids GLOB_BRACE, which isn't available on Alpine/musl.)
     */
    private function photosFor(string $slug): array
    {
        $dir = public_path('images/villas');
        $found = [];

        foreach (['jpg', 'jpeg', 'png', 'webp'] as $ext) {
            foreach (glob("{$dir}/{$slug}-*.{$ext}") ?: [] as $file) {
                $found[] = '/images/villas/'.basename($file);
            }
        }

        sort($found, SORT_NATURAL);

        return $found;
    }
}