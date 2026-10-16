<?php

return [
    'currency' => [
        // Fallback only. The daily sync (php artisan rates:sync) overrides it.
        'kes_per_usd' => (float) env('KES_PER_USD', 129),
    ],

    'vehicle' => [
        'driver_fee_per_day' => 25,
        'discounts' => [
            ['min_days' => 3, 'percent' => 5],
            ['min_days' => 7, 'percent' => 10],
            ['min_days' => 14, 'percent' => 15],
        ],
    ],

    'villa' => [
        'discounts' => [
            ['min_days' => 7, 'percent' => 5],
            ['min_days' => 14, 'percent' => 10],
        ],
    ],

    // unit: 'day' multiplies by the number of days, 'trip' is charged once
    'extras' => [
        'vehicle' => [
            'child_seat' => ['label' => 'Child seat', 'price' => 3, 'unit' => 'day', 'max' => 3],
            'guide' => ['label' => 'Professional tour guide', 'price' => 40, 'unit' => 'day', 'max' => 1],
        ],
        'transfer' => [
            'child_seat' => ['label' => 'Child seat', 'price' => 5, 'unit' => 'trip', 'max' => 3],
            'extra_luggage' => ['label' => 'Extra luggage space', 'price' => 10, 'unit' => 'trip', 'max' => 1],
        ],
        'villa' => [],
        'tour' => [],
    ],
];