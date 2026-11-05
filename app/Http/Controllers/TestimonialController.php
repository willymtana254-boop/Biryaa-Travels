<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    /** Full page: all approved testimonials + the "share your experience" form. */
    public function index(): Response
    {
        $approved = Testimonial::where('is_approved', true);

        return Inertia::render('Testimonials', [
            'testimonials' => (clone $approved)->latest()->take(60)->get()->map->toPublic()->values(),
            'stats' => [
                'count' => (clone $approved)->count(),
                'average' => round((float) (clone $approved)->avg('rating'), 1),
            ],
            'services' => Testimonial::SERVICES,
        ]);
    }

    /** Small JSON feed for the home page section. Real, approved testimonials only. */
    public function featured(): JsonResponse
    {
        $approved = Testimonial::where('is_approved', true);

        $items = (clone $approved)
            ->orderByDesc('is_featured')
            ->latest()
            ->take(6)
            ->get()
            ->map->toPublic()
            ->values();

        return response()->json([
            'testimonials' => $items,
            'count' => (clone $approved)->count(),
            'average' => round((float) (clone $approved)->avg('rating'), 1),
        ])->header('Cache-Control', 'public, max-age=300');
    }

    public function store(Request $request): RedirectResponse
    {
        // Hidden field that real people leave empty. Bots usually fill it.
        if ($request->filled('website')) {
            return back()->with('success', 'Thank you! Your testimonial will appear once we have checked it.');
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:80'],
            'location' => ['nullable', 'string', 'max:80'],
            'service' => ['required', Rule::in(array_keys(Testimonial::SERVICES))],
            'rating' => ['required', 'integer', 'between:1,5'],
            'message' => ['required', 'string', 'min:20', 'max:600'],
            'reference' => ['nullable', 'string', 'max:40'],
            'email' => ['nullable', 'email', 'max:255'],
            'consent' => ['accepted'],
        ], [
            'name.required' => 'Please tell us your name.',
            'service.required' => 'Please choose the service you used.',
            'rating.required' => 'Please give a star rating.',
            'message.required' => 'Please write a few words about your experience.',
            'message.min' => 'Please write at least 20 characters so others can learn from your experience.',
            'consent.accepted' => 'Please tick the box so we may show your testimonial.',
        ]);

        // A matching booking reference + email earns a "Verified guest" badge.
        $booking = null;
        if (filled($data['reference'] ?? null) && filled($data['email'] ?? null)) {
            $candidate = Booking::where('reference', trim($data['reference']))->first();
            if ($candidate && mb_strtolower($candidate->customer_email) === mb_strtolower(trim($data['email']))) {
                $booking = $candidate;
            }
        }

        Testimonial::create([
            'name' => trim($data['name']),
            'location' => $data['location'] ?? null,
            'service' => $data['service'],
            'rating' => $data['rating'],
            'message' => trim($data['message']),
            'booking_id' => $booking?->id,
            'verified' => (bool) $booking,
            'source' => 'website',
            'is_approved' => false, // a person in our team approves it first
        ]);

        return back()->with('success', 'Thank you! Your testimonial will appear once we have checked it.');
    }
}
