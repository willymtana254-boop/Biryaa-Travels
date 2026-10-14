<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'pending');
        abort_unless(in_array($status, ['pending', 'approved', 'rejected']), 404);

        return Inertia::render('Admin/Reviews/Index', [
            'reviews' => Review::with(['photos', 'reviewable', 'booking'])
                ->where('status', $status)
                ->latest()
                ->paginate(15)
                ->withQueryString(),
            'counts' => Review::selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status'),
            'status' => $status,
        ]);
    }

    public function approve(Review $review): RedirectResponse
    {
        $review->update(['status' => 'approved', 'approved_at' => now()]);

        return back()->with('success', 'Review approved and published.');
    }

    public function reject(Review $review): RedirectResponse
    {
        $review->update(['status' => 'rejected']);

        return back()->with('success', 'Review rejected.');
    }

    public function reply(Request $request, Review $review): RedirectResponse
    {
        $data = $request->validate(['admin_reply' => ['nullable', 'string', 'max:1000']]);

        $review->update(['admin_reply' => $data['admin_reply'] ?? null]);

        return back()->with('success', 'Reply saved.');
    }

    public function destroy(Review $review): RedirectResponse
    {
        $review->delete();

        return back()->with('success', 'Review and its photos deleted.');
    }
}