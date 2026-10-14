<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\ReviewPhoto;
use App\Models\Tour;
use App\Support\ReviewPhotoStore;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TourController extends Controller
{
    public function index(Request $request): Response
    {
        $tours = Tour::with('location')
            ->withAvg('approvedReviews as rating_avg', 'rating')
            ->withCount('approvedReviews as rating_count')
            ->where('is_available', true)
            ->when($request->category, fn ($q, $c) => $q->where('category', $c))
            ->when($request->location, fn ($q, $l) => $q->where('location_id', $l))
            ->orderBy('price')
            ->get();

        $covers = $this->guestCovers($tours->pluck('id'));

        $tours->each(fn ($t) => $t->setAttribute('cover_image', data_get($t->images, 0) ?? $covers->get($t->id)));

        if ($request->sort === 'rating') {
            $tours = $tours->sortByDesc(fn ($t) => (float) $t->rating_avg)->values();
        }

        return Inertia::render('Tours/Index', [
            'tours' => $tours,
            'locations' => Location::towns()->orderBy('name')->get(['id', 'name', 'slug']),
            'categories' => ['marine', 'cultural', 'city', 'golf', 'wildlife'],
            'filters' => $request->only('category', 'location', 'sort'),
        ]);
    }

    public function show(Tour $tour): Response
    {
        $tour->load('location');

        $reviews = $tour->approvedReviews()->with('photos')->latest('approved_at')->take(30)->get();

        $byStars = $tour->approvedReviews()
            ->selectRaw('rating, count(*) as total')
            ->groupBy('rating')
            ->pluck('total', 'rating');

        $count = (int) $byStars->sum();
        $average = $count ? round($byStars->map(fn ($total, $stars) => $stars * $total)->sum() / $count, 1) : null;

        $reviewData = $reviews->map(fn ($r) => [
            'id' => $r->id,
            'name' => $r->display_name,
            'rating' => $r->rating,
            'title' => $r->title,
            'body' => $r->body,
            'visited_on' => $r->visited_on?->format('F Y'),
            'reply' => $r->admin_reply,
            'photos' => $r->photos->map(fn ($p) => $p->url)->values(),
        ]);

        return Inertia::render('Tours/Show', [
            'tour' => $tour,
            'cover' => data_get($tour->images, 0) ?? $this->guestCovers(collect([$tour->id]))->get($tour->id),
            'summary' => [
                'average' => $average,
                'count' => $count,
                'distribution' => collect([5, 4, 3, 2, 1])
                    ->map(fn ($s) => ['stars' => $s, 'count' => (int) ($byStars[$s] ?? 0)])
                    ->values(),
            ],
            'reviews' => $reviewData,
            'photos' => $reviewData->pluck('photos')->flatten()->values(),
        ]);
    }

    /** First guest photo per tour. Only photos the guest allowed us to use in marketing. */
    private function guestCovers($tourIds)
    {
        return ReviewPhoto::query()
            ->join('reviews', 'reviews.id', '=', 'review_photos.review_id')
            ->where('reviews.status', 'approved')
            ->where('reviews.marketing_consent', true)
            ->where('reviews.reviewable_type', Tour::class)
            ->whereIn('reviews.reviewable_id', $tourIds)
            ->orderBy('review_photos.id')
            ->get(['review_photos.path', 'reviews.reviewable_id'])
            ->groupBy('reviewable_id')
            ->map(fn ($rows) => ReviewPhotoStore::url($rows->first()->path));
    }
}