<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Models\Villa;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class SitemapController extends Controller
{
    public function sitemap(): Response
    {
        $xml = Cache::remember('sitemap-xml', 3600, function () {
            $urls = [];

            foreach (['/', '/car-hire', '/airport-transfers', '/villas', '/gallery', '/testimonials', '/about', '/contact', '/terms', '/privacy'] as $path) {
                $urls[] = ['loc' => url($path), 'priority' => $path === '/' ? '1.0' : '0.8'];
            }

            try {
                foreach (Vehicle::all() as $vehicle) {
                    $urls[] = ['loc' => route('vehicles.show', $vehicle), 'priority' => '0.7'];
                }
                foreach (Villa::all() as $villa) {
                    $urls[] = ['loc' => route('villas.show', $villa), 'priority' => '0.7'];
                }
            } catch (\Throwable $e) {
                report($e);
            }

            $out = '<?xml version="1.0" encoding="UTF-8"?>'."\n".'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";
            foreach ($urls as $u) {
                $out .= '  <url><loc>'.e($u['loc']).'</loc><priority>'.$u['priority'].'</priority></url>'."\n";
            }

            return $out.'</urlset>'."\n";
        });

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }

    public function robots(): Response
    {
        $lines = [
            'User-agent: *',
            'Disallow: /admin',
            'Disallow: /verify',
            'Disallow: /account',
            'Disallow: /login',
            'Disallow: /register',
            'Disallow: /bookings',
            'Disallow: /booking',
            'Disallow: /book/',
            'Allow: /',
            '',
            'Sitemap: '.url('/sitemap.xml'),
        ];

        return response(implode("\n", $lines)."\n", 200, ['Content-Type' => 'text/plain; charset=UTF-8']);
    }
}
