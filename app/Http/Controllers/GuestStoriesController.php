<?php

namespace App\Http\Controllers;

use App\Models\ReviewPhoto;
use App\Models\Tour;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class GuestStoriesController extends Controller
{
    public function __invoke(): Response
    {
        $photos = ReviewPhoto::query()
            ->whereHas('review', fn ($q) => $q
                ->where('status', 'approved')
                ->where('marketing_consent', true)
                ->where('reviewable_type', Tour::class))
            ->with('review.reviewable')
            ->latest('id')
            ->take(60)
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'url' => $p->url,
                'tour' => $p->review->reviewable?->name,
                'slug' => $p->review->reviewable?->slug,
                'name' => $p->review->display_name,
                'rating' => $p->review->rating,
                'quote' => Str::limit($p->review->body, 120),
            ]);

        return Inertia::render('GuestStories', ['photos' => $photos]);
    }
}