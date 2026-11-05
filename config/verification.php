<?php

return [
    // When true, a car hire booking cannot be set to "confirmed" until the hirer's
    // verification has been approved. Set KYC_REQUIRED=false in Render to switch it off.
    'required' => (bool) env('KYC_REQUIRED', true),

    // ID, licence and selfie images are deleted this many days after the hire ends.
    'retention_days' => (int) env('KYC_RETENTION_DAYS', 90),

    // Text-message codes to verify the hirer's phone. Leave empty to verify by hand instead.
    // Get these from an Africa's Talking account (africastalking.com).
    'sms' => [
        'username' => env('AT_USERNAME'),
        'api_key' => env('AT_API_KEY'),
        'sender' => env('AT_SENDER'),
        'sandbox' => (bool) env('AT_SANDBOX', false),
    ],
];
