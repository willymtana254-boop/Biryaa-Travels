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

        // hub => [town => [vehicle_category, price, distance_km, duration_minutes]]
        $matrix = [
            'Moi International Airport (MBA)' => [
                'Mombasa' => ['sedan', 25, 15, 25],
                'Kilifi' => ['sedan', 40, 60, 75],
                'Diani' => ['sedan', 35, 45, 60],
                'Watamu' => ['suv', 55, 105, 120],
                'Malindi' => ['suv', 60, 120, 135],
                'Vipingo' => ['sedan', 30, 40, 50],
            ],
            'Malindi Airport (MYD)' => [
                'Malindi' => ['sedan', 15, 8, 15],
                'Watamu' => ['sedan', 20, 25, 30],
                'Kilifi' => ['sedan', 30, 55, 60],
            ],
            'Ukunda Airport (UUK)' => [
                'Diani' => ['sedan', 15, 8, 15],
                'Mombasa' => ['mini_van', 45, 45, 60],
            ],
            'Mombasa SGR Terminus' => [
                'Mombasa' => ['sedan', 20, 20, 30],
                'Kilifi' => ['sedan', 42, 65, 80],
                'Diani' => ['sedan', 38, 50, 65],
                'Watamu' => ['suv', 58, 110, 125],
                'Malindi' => ['suv', 63, 125, 140],
                'Vipingo' => ['sedan', 32, 45, 55],
            ],
            'Mariakani SGR Station' => [
                'Mombasa' => ['sedan', 25, 35, 45],
                'Kilifi' => ['sedan', 35, 50, 60],
            ],
            'Miasenyi & Voi SGR Station' => [
                'Mombasa' => ['suv', 60, 150, 150],
                'Diani' => ['suv', 65, 165, 165],
            ],
        ];

        foreach ($matrix as $hubName => $towns) {
            $hubId = $byName($hubName);
            if (! $hubId) {
                continue;
            }

            foreach ($towns as $townName => [$category, $price, $distance, $duration]) {
                $townId = $byName($townName);
                if (! $townId) {
                    continue;
                }

                // Seed both directions so lookups work regardless of which side is "from".
                foreach ([[$hubId, $townId], [$townId, $hubId]] as [$fromId, $toId]) {
                    TransferRoute::updateOrCreate(
                        [
                            'from_location_id' => $fromId,
                            'to_location_id' => $toId,
                            'vehicle_category' => $category,
                        ],
                        [
                            'price' => $price,
                            'distance_km' => $distance,
                            'duration_minutes' => $duration,
                        ]
                    );
                }
            }
        }
    }
}