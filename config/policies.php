<?php

/*
|--------------------------------------------------------------------------
| Biryaa Travels policies: edit the numbers here, the Terms page updates itself.
|--------------------------------------------------------------------------
| Leave a value as null if you have not decided it yet. The page then uses
| neutral wording ("we will confirm") instead of showing a number.
| Have these terms checked by a lawyer before relying on them.
*/
return [
    'updated' => '6 November 2026',

    'booking' => [
        // e.g. 'M-Pesa, bank transfer or card'. null = "we send payment details when confirming".
        'payment_methods' => null,
        // % of the total paid to secure a booking. null = "we will tell you the amount when confirming".
        'deposit_percent' => null,
    ],

    'cancellation' => [
        // Free cancellation up to this many hours before the start. null = decided case by case.
        'free_until_hours' => null,
        // % refunded when cancelling after that window (0 = no refund). null = decided case by case.
        'late_refund_percent' => null,
    ],

    'car_hire' => [
        'min_driver_age' => 23,
        'min_licence_years' => 2,
        // Refundable security deposit in KES. null = "we will tell you before pickup".
        'security_deposit_kes' => null,
        // Free kilometres per day. null = "we will tell you when confirming".
        'km_per_day' => null,
        // Charge per extra hour when a car is returned late, in KES. null = "charged at a fair hourly rate".
        'late_return_kes_per_hour' => null,
    ],
];
