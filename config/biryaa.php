<?php

return [
    // Where new-booking alerts go (your team inbox). Falls back to the "from" address.
    'alert_email' => env('BOOKING_ALERT_EMAIL', env('MAIL_FROM_ADDRESS')),

    // Optional: your own phone for a text alert, e.g. +254728769798 (needs Africa's Talking, see config/verification.php)
    'alert_phone' => env('BOOKING_ALERT_PHONE'),

    // Also text the customer a short "booking received" message. Off by default (costs per SMS).
    'sms_customer' => (bool) env('BOOKING_SMS_CUSTOMER', false),

    'whatsapp' => '254728769798',
];
