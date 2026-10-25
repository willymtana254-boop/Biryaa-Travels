<?php

namespace App\Http\Controllers;

use App\Models\GalleryPhoto;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(): Response
    {
        $photos = GalleryPhoto::listing()->get()->map(fn ($p) => $p->toCard())->values();

        return Inertia::render('Gallery', [
            'photos' => $photos,
            // Only show filter tabs for categories that actually have photos.
            'categories' => $photos->pluck('category')->filter()->unique()->values(),
        ]);
    }

    public function photo(GalleryPhoto $photo): HttpResponse
    {
        return response(base64_decode($photo->data), 200, [
            'Content-Type' => 'image/jpeg',
            'Cache-Control' => 'public, max-age=31536000, immutable',
        ]);
    }
}
