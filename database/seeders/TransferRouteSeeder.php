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
                'Nyali' => ['sedan', 20, 12, 25],
                'Bamburi' => ['sedan', 22, 14, 30],
                'Shanzu' => ['sedan', 25, 20, 35],
                'Mtwapa' => ['sedan', 28, 25, 40],
                'Kikambala' => ['sedan', 32, 35, 50],
                'Kilifi' => ['sedan', 40, 60, 75],
                'Vipingo' => ['sedan', 30, 40, 50],
                'Diani' => ['sedan', 35, 45, 60],
                'Tiwi' => ['sedan', 38, 40, 55],
                'Msambweni' => ['suv', 50, 70, 90],
                'Shimoni' => ['suv', 65, 95, 120],
                'Watamu' => ['suv', 55, 105, 120],
                'Malindi' => ['suv', 60, 120, 135],
            ],
            'Malindi Airport (MYD)' => [
                'Malindi' => ['sedan', 15, 8, 15],
                'Watamu' => ['sedan', 20, 25, 30],
                'Kilifi' => ['sedan', 30, 55, 60],
            ],
            'Ukunda Airport (UUK)' => [
                'Diani' => ['sedan', 15, 8, 15],
                'Tiwi' => ['sedan', 18, 15, 25],
                'Msambweni' => ['sedan', 28, 35, 45],
                'Shimoni' => ['suv', 45, 60, 80],
                'Mombasa' => ['mini_van', 45, 45, 60],
            ],
            'Mombasa SGR Terminus' => [
                'Mombasa' => ['sedan', 20, 20, 30],
                'Nyali' => ['sedan', 24, 25, 40],
                'Bamburi' => ['sedan', 26, 28, 40],
                'Shanzu' => ['sedan', 28, 33, 45],
                'Mtwapa' => ['sedan', 30, 38, 50],
                'Kikambala' => ['sedan', 35, 48, 60],
                'Kilifi' => ['sedan', 42, 65, 80],
                'Vipingo' => ['sedan', 32, 45, 55],
                'Diani' => ['sedan', 38, 50, 65],
                'Watamu' => ['suv', 58, 110, 125],
                'Malindi' => ['suv', 63, 125, 140],
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