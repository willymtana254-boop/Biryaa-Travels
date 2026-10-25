<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Notification;
use App\Models\Review;
use App\Models\Tour;
use App\Models\TransferRoute;
use App\Models\Vehicle;
use App\Models\Villa;
use App\Support\BookingLabels;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class BookingController extends Controller
{
    /** Filters shared by the list and the CSV export. */
    private function filtered(Request $request): Builder
    {
        $types = [
            'car' => Vehicle::class,
            'accommodation' => Villa::class,
            'experience' => Tour::class,
            'transfer' => TransferRoute::class,
        ];

        return Booking::query()
            ->when($request->filled('q'), function ($query) use ($request) {
                $like = '%'.mb_strtolower(trim($request->input('q'))).'%';
                $query->where(function ($w) use ($like) {
                    foreach (['reference', 'customer_name', 'customer_email', 'customer_phone'] as $col) {
                        $w->orWhereRaw("LOWER({$col}) LIKE ?", [$like]);
                    }
                });
            })
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->input('status')))
            ->when($request->filled('payment'), fn ($q) => $q->where('payment_status', $request->input('payment')))
            ->when(
                $request->filled('type') && isset($types[$request->input('type')]),
                fn ($q) => $q->where('bookable_type', $types[$request->input('type')])
            )
            ->when($request->filled('from'), fn ($q) => $q->whereDate('start_date', '>=', $request->input('from')))
            ->when($request->filled('to'), fn ($q) => $q->whereDate('start_date', '<=', $request->input('to')))
            ->latest();
    }

    public function index(Request $request): Response
    {
        $bookings = $this->filtered($request)
            ->with('bookable')
            ->paginate(20)
            ->withQueryString()
            ->through(fn ($b) => BookingLabels::row($b));

        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $bookings,
            'filters' => $request->only(['q', 'status', 'payment', 'type', 'from', 'to']),
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $rows = $this->filtered($request)->with('bookable')->get();

        return response()->streamDownload(function () use ($rows) {
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF"); // so Excel reads the file as UTF-8
            fputcsv($out, ['Reference', 'Type', 'Item', 'Customer', 'Phone', 'Email', 'Start', 'End', 'Total (KES)', 'Status', 'Payment', 'Created']);

            foreach ($rows as $b) {
                $r = BookingLabels::row($b);
                fputcsv($out, [
                    $r['reference'], $r['type'], $r['title'], $r['customer_name'], $r['customer_phone'],
                    $r['customer_email'], $r['start_date'], $r['end_date'], $r['total_price'],
                    $r['status'], $r['payment_status'], $r['created_at'],
                ]);
            }

            fclose($out);
        }, 'biryaa-bookings-'.now()->format('Y-m-d').'.csv', ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    public function show(Booking $booking): Response
    {
        $booking->load(['bookable', 'user']);

        if ($booking->bookable instanceof TransferRoute) {
            $booking->bookable->load(['fromLocation', 'toLocation']);
        }

        return Inertia::render('Admin/Bookings/Show', [
            'booking' => $booking,
            'bookingType' => match ($booking->bookable_type) {
                Vehicle::class => 'Car Hire',
                Villa::class => 'Accommodation',
                Tour::class => 'Experience',
                TransferRoute::class => 'Airport / SGR Transfer',
                default => 'Unknown',
            },
            'title' => BookingLabels::title($booking),
        ]);
    }

    public function update(Request $request, Booking $booking): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['sometimes', Rule::in(['pending', 'confirmed', 'cancelled', 'completed'])],
            'payment_status' => ['sometimes', Rule::in(['unpaid', 'paid', 'refunded'])],
        ]);

        $booking->update($data);

        return back()->with('success', 'Booking updated.');
    }

    public function destroy(Booking $booking): RedirectResponse
    {
        try {
            DB::transaction(function () use ($booking) {
                Notification::where('booking_id', $booking->id)->delete();
                Review::where('booking_id', $booking->id)->update(['booking_id' => null]);
                $booking->delete();
            });
        } catch (\Throwable $e) {
            report($e);

            return back()->with('error', 'Could not delete this booking. Mark it Cancelled instead.');
        }

        return redirect()->route('admin.bookings.index')->with('success', 'Booking deleted.');
    }
}
