<?php

namespace App\Support;

use Illuminate\Http\Request;

/**
 * Works out the search / share tags for the page being requested.
 * Runs on the server so WhatsApp, Facebook and Google see them without running any JavaScript.
 */
class Seo
{
    public static function forRequest(Request $request): array
    {
        $path = trim($request->path(), '/');
        if ($path === '/') {
            $path = '';
        }

        $cfg = config('seo');
        $page = $cfg['pages'][$path] ?? $cfg['default'];

        $title = $page['title'] ?? $cfg['default']['title'];
        $description = $page['description'] ?? $cfg['default']['description'];

        // Detail pages: use the car or villa name.
        $route = $request->route();
        if ($route) {
            $name = $route->getName();
            if ($name === 'vehicles.show' && is_object($route->parameter('vehicle')) && filled($route->parameter('vehicle')->name ?? null)) {
                $car = $route->parameter('vehicle')->name;
                $title = "Hire {$car} on the Kenyan Coast | Biryaa Travels";
                $description = "Book the {$car} online with Biryaa Travels. See the price for your dates, add a driver if you like, and our team confirms quickly.";
            } elseif ($name === 'villas.show' && is_object($route->parameter('villa')) && filled($route->parameter('villa')->name ?? null)) {
                $stay = $route->parameter('villa')->name;
                $title = "{$stay} | Stay on the Kenyan Coast | Biryaa Travels";
                $description = "Details, photos and booking for {$stay}. Book with Biryaa Travels on the Kenyan Coast.";
            }
        }

        $first = explode('/', $path)[0] ?? '';
        $noindex = in_array($first, $cfg['noindex_prefixes'], true);

        $isHome = ! empty($page['home']);

        return [
            'title' => $title,
            'description' => $description,
            'image' => url($cfg['image']),
            'url' => url($path === '' ? '/' : $path),
            'site_name' => $cfg['site_name'],
            'robots' => $noindex ? 'noindex, nofollow' : 'index, follow',
            'jsonld' => $isHome ? self::business($cfg['business']) : null,
        ];
    }

    private static function business(array $b): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'TravelAgency',
            'name' => $b['name'],
            'url' => url('/'),
            'logo' => url('/images/biryaa-logo.png'),
            'image' => url(config('seo.image')),
            'email' => $b['email'],
            'telephone' => $b['phones'][0] ?? null,
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => $b['street'],
                'addressLocality' => $b['city'],
                'addressCountry' => $b['country'],
            ],
            'areaServed' => array_map(fn ($a) => ['@type' => 'City', 'name' => $a], $b['areas']),
            'openingHoursSpecification' => [[
                '@type' => 'OpeningHoursSpecification',
                'dayOfWeek' => $b['hours']['days'],
                'opens' => $b['hours']['opens'],
                'closes' => $b['hours']['closes'],
            ]],
        ];
    }
}
