<?php

/*
| Search and share text for each page. Edit freely.
| Keep titles under about 60 characters and descriptions under about 155.
| Pages not listed here use "default".
*/
return [
    'site_name' => 'Biryaa Travels',

    'image' => '/images/og-share.jpg',

    'default' => [
        'title' => 'Biryaa Travels | Car Hire, Airport Transfers & Stays on the Kenyan Coast',
        'description' => 'Hire a car, book airport and SGR transfers, and find stays in Kilifi, Mombasa, Diani, Watamu and Malindi. Clear prices, verified hirers, friendly local team. Twende Tuzuru!',
    ],

    // keyed by URL path without the leading slash ("" is the front page)
    'pages' => [
        '' => [
            'title' => 'Biryaa Travels | Car Hire, Airport Transfers & Stays on the Kenyan Coast',
            'description' => 'Hire a car, book airport and SGR transfers, and find stays in Kilifi, Mombasa, Diani, Watamu and Malindi. Clear prices, verified hirers, friendly local team. Twende Tuzuru!',
            'home' => true,
        ],
        'home' => [
            'title' => 'Biryaa Travels | Car Hire, Airport Transfers & Stays on the Kenyan Coast',
            'description' => 'Hire a car, book airport and SGR transfers, and find stays in Kilifi, Mombasa, Diani, Watamu and Malindi. Clear prices, verified hirers, friendly local team. Twende Tuzuru!',
            'home' => true,
        ],
        'car-hire' => [
            'title' => 'Car Hire in Mombasa, Kilifi & Diani | Biryaa Travels',
            'description' => 'Self-drive and chauffeur-driven car hire on the Kenyan Coast. See prices upfront, pick your dates and book online. Verified hirers, friendly support.',
        ],
        'airport-transfers' => [
            'title' => 'Airport & SGR Transfers on the Kenyan Coast | Biryaa Travels',
            'description' => 'Pre-booked transfers from Moi International Airport, Mombasa SGR and more to Diani, Kilifi, Watamu and Malindi. Choose from and to, see the price, book in minutes.',
        ],
        'villas' => [
            'title' => 'Accommodation, Hotels & Villas on the Kenyan Coast | Biryaa Travels',
            'description' => 'Find places to stay near you on the Kenyan Coast. Live hotel links, a nearby map for villas, hotels and restaurants, and help from a local team.',
        ],
        'gallery' => [
            'title' => 'Gallery | Biryaa Travels',
            'description' => 'Photos of the Kenyan Coast and our trips: beaches, cars, stays and happy guests.',
        ],
        'testimonials' => [
            'title' => 'Guest Experiences & Reviews | Biryaa Travels',
            'description' => 'Read what travellers say about hiring cars, transfers and stays with Biryaa Travels, and share your own experience.',
        ],
        'about' => [
            'title' => 'About Us & Services | Biryaa Travels',
            'description' => 'Meet Biryaa Travels Ltd, a Mombasa-based travel company for car hire, airport transfers and accommodation across the Kenyan Coast.',
        ],
        'contact' => [
            'title' => 'Contact Us | Biryaa Travels',
            'description' => 'Call, WhatsApp or write to Biryaa Travels in Mombasa. Monday to Saturday, 8am to 6pm East Africa Time.',
        ],
        'terms' => [
            'title' => 'Terms & Conditions | Biryaa Travels',
            'description' => 'Booking, cancellation and car hire rules for Biryaa Travels.',
        ],
        'privacy' => [
            'title' => 'Privacy Policy | Biryaa Travels',
            'description' => 'How Biryaa Travels collects, uses and protects your personal information.',
        ],
    ],

    // Pages that must never appear in Google (private or account pages).
    'noindex_prefixes' => ['admin', 'verify', 'account', 'login', 'register', 'email', 'logout', 'bookings', 'book', 'booking', 'forgot-password', 'reset-password'],

    // Shown to Google as your business details.
    'business' => [
        'name' => 'Biryaa Travels Ltd',
        'phones' => ['+254728769798', '+254750192910'],
        'email' => 'info@biryaatravelsltd.co.ke',
        'street' => 'P.O. Box 3339-80100',
        'city' => 'Mombasa',
        'country' => 'KE',
        'hours' => ['days' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 'opens' => '08:00', 'closes' => '18:00'],
        'areas' => ['Kilifi', 'Mombasa', 'Diani', 'Watamu', 'Malindi', 'Vipingo'],
    ],
];
