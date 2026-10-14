<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Tour;
use App\Support\ReviewPhotoStore;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function create(Request $request, Tour $tour): Response
    {
        return Inertia::render('Tours/Review', [
            'tour' => $tour->only(['id', 'name', 'slug']),
            'prefill' => ['reference' => strtoupper((string) $request->query('ref', ''))],
            'maxPhotos' => (int) config('reviews.max_photos'),
        ]);
    }

    public function store(Request $request, Tour $tour): RedirectResponse
    {
        $max = (int) config('reviews.max_photos');

        $data = $request->validate([
            'reference' => ['required', 'string', 'max:30'],
            'email' => ['required', 'email', 'max:255'],
            'rating' => ['required', 'integer', 'between:1,5'],
            'title' => ['nullable', 'string', 'max:120'],
            'body' => ['required', 'string', 'min:15', 'max:2000'],
            'marketing_consent' => ['boolean'],
            'photos' => ['nullable', 'array', "max:{$max}"],
            'photos.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
        ], [
            'body.min' => 'Please write at least a sentence or two.',
            'photos.max' => "You can add up to {$max} photos.",
            'photos.*.image' => 'Each photo must be a JPG, PNG or WebP image.',
            'photos.*.mimes' => 'Each photo must be a JPG, PNG or WebP image.',
            'photos.*.max' => 'Each photo must be under 8 MB.',
        ]);

        // Only a guest with a real booking for THIS experience can review it.
        $booking = Booking::where('reference', strtoupper(trim($data['reference'])))
            ->whereRaw('LOWER(customer_email) = ?', [strtolower(trim($data['email']))])
            ->where('bookable_type', Tour::class)
            ->where('bookable_id', $tour->id)
            ->first();

        if (! $booking) {
            return back()->withInput()->withErrors([
                'reference' => 'We couldn\'t find an experience booking that matches this reference and email.',
            ]);
        }

        if (! in_array($booking->status, ['confirmed', 'completed']) || $booking->start_date->gt(today())) {
            return back()->withInput()->withErrors([
                'reference' => 'You can review once your experience has taken place and our team has confirmed it.',
            ]);
        }

        if ($booking->review()->exists()) {
            return back()->withInput()->withErrors([
                'reference' => 'This booking has already been reviewed. Thank you!',
            ]);
        }

        DB::transaction(function () use ($request, $tour, $booking, $data) {
            $review = $tour->reviews()->create([
                'booking_id' => $booking->id,
                'reviewer_name' => $booking->customer_name,
                'rating' => $data['rating'],
                'title' => $data['title'] ?? null,
                'body' => $data['body'],
                'visited_on' => $booking->start_date,
                'marketing_consent' => (bool) ($data['marketing_consent'] ?? false),
                'status' => 'pending',
            ]);

            foreach ($request->file('photos', []) as $file) {
                if ($path = ReviewPhotoStore::store($file)) {
                    $review->photos()->create(['path' => $path]);
                }
            }
        });

        return redirect()
            ->route('tours.show', $tour->slug)
            ->with('success', 'Thank you! Your review will appear once our team has checked it.');
    }
}