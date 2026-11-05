<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function index(Request $request): Response
    {
        $filter = $request->query('filter', 'pending');

        $items = Testimonial::query()
            ->when($filter === 'pending', fn ($q) => $q->where('is_approved', false))
            ->when($filter === 'approved', fn ($q) => $q->where('is_approved', true))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Testimonials/Index', [
            'items' => $items,
            'filter' => $filter,
            'pendingCount' => Testimonial::where('is_approved', false)->count(),
            'services' => Testimonial::SERVICES,
        ]);
    }

    /** For a real testimonial received on WhatsApp, a card, etc. Only add ones the guest agreed to share. */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:80'],
            'location' => ['nullable', 'string', 'max:80'],
            'service' => ['required', Rule::in(array_keys(Testimonial::SERVICES))],
            'rating' => ['required', 'integer', 'between:1,5'],
            'message' => ['required', 'string', 'min:10', 'max:600'],
        ]);

        Testimonial::create($data + ['source' => 'manual', 'is_approved' => true, 'verified' => false]);

        return back()->with('success', 'Testimonial added.');
    }

    public function toggleApproved(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->update([
            'is_approved' => ! $testimonial->is_approved,
            'is_featured' => $testimonial->is_approved ? false : $testimonial->is_featured,
        ]);

        return back();
    }

    public function toggleFeatured(Testimonial $testimonial): RedirectResponse
    {
        abort_unless($testimonial->is_approved, 422);
        $testimonial->update(['is_featured' => ! $testimonial->is_featured]);

        return back();
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->delete();

        return back()->with('success', 'Testimonial deleted.');
    }
}
