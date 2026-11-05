<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\RentalVerification;
use App\Models\VerificationDocument;
use App\Models\Vehicle;
use App\Rules\ValidPhone;
use App\Support\ImagePipeline;
use App\Support\PhoneNumber;
use App\Support\Sms;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Hirer verification for car hire bookings.
 * The hirer proves who they are with their booking reference + the email used to book.
 */
class VerificationController extends Controller
{
    private function carBooking(string $reference): Booking
    {
        return Booking::where('reference', $reference)
            ->where('bookable_type', Vehicle::class)
            ->firstOrFail();
    }

    private function authorised(Request $request, Booking $booking): void
    {
        abort_unless($request->session()->get('verify.'.$booking->reference) === true, 403);
    }

    private function forBooking(Booking $booking): RentalVerification
    {
        $v = RentalVerification::firstOrCreate(
            ['booking_id' => $booking->id],
            [
                'status' => 'incomplete',
                'phone' => PhoneNumber::normalize($booking->customer_phone) ?? $booking->customer_phone,
            ]
        );

        // Load the database defaults on a freshly created row.
        return $v->wasRecentlyCreated ? $v->refresh() : $v;
    }

    public function lookup(Request $request): Response
    {
        return Inertia::render('Verify/Lookup', ['reference' => (string) $request->query('ref', '')]);
    }

    public function start(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'reference' => ['required', 'string', 'max:40'],
            'email' => ['required', 'email', 'max:255'],
        ]);

        $booking = Booking::where('reference', trim($data['reference']))
            ->where('bookable_type', Vehicle::class)
            ->first();

        // Same message whether the reference or the email was wrong, so references cannot be probed.
        if (! $booking || mb_strtolower($booking->customer_email) !== mb_strtolower(trim($data['email']))) {
            return back()->withErrors(['reference' => 'We could not find a car hire booking with those details.']);
        }

        $request->session()->put('verify.'.$booking->reference, true);

        return redirect()->route('verify.show', $booking->reference);
    }

    public function show(Request $request, string $reference): Response|RedirectResponse
    {
        $booking = $this->carBooking($reference);

        if (! $request->session()->get('verify.'.$booking->reference)) {
            return redirect()->route('verify.lookup', ['ref' => $reference]);
        }

        $v = $this->forBooking($booking);

        return Inertia::render('Verify/Form', [
            'booking' => [
                'reference' => $booking->reference,
                'customer_name' => $booking->customer_name,
                'start_date' => optional($booking->start_date)->toDateString(),
                'end_date' => optional($booking->end_date)->toDateString(),
            ],
            'verification' => [
                'status' => $v->status,
                'editable' => $v->isEditable(),
                'full_name' => $v->full_name ?? $booking->customer_name,
                'id_type' => $v->id_type ?? 'national_id',
                'id_number' => $v->id_number,
                'address_line' => $v->address_line,
                'town' => $v->town,
                'country' => $v->country ?? 'Kenya',
                'licence_number' => $v->licence_number,
                'licence_expiry' => optional($v->licence_expiry)->toDateString(),
                'phone' => $v->phone,
                'phone_verified' => (bool) $v->phone_verified_at,
                'consent' => (bool) $v->consent_at,
                'documents' => $v->documentKinds(),
                'reviewer_note' => $v->status === 'rejected' ? $v->reviewer_note : null,
            ],
            'smsEnabled' => Sms::configured(),
            'missing' => $v->missing(Sms::configured()),
        ]);
    }

    public function details(Request $request, string $reference): RedirectResponse
    {
        $booking = $this->carBooking($reference);
        $this->authorised($request, $booking);
        $v = $this->forBooking($booking);
        abort_unless($v->isEditable(), 403);

        $data = $request->validate([
            'full_name' => ['required', 'string', 'max:120'],
            'id_type' => ['required', Rule::in(['national_id', 'passport'])],
            'id_number' => ['required', 'string', 'min:5', 'max:30'],
            'address_line' => ['required', 'string', 'max:255'],
            'town' => ['required', 'string', 'max:100'],
            'country' => ['required', 'string', 'max:100'],
            'licence_number' => ['required', 'string', 'min:4', 'max:40'],
            'licence_expiry' => ['required', 'date', 'after_or_equal:'.optional($booking->end_date)->toDateString()],
            'phone' => ['required', new ValidPhone],
            'consent' => ['accepted'],
        ], [
            'licence_expiry.after_or_equal' => 'Your driving licence must still be valid on the last day of the hire.',
            'consent.accepted' => 'Please tick the box to agree to how we use your details.',
        ]);

        $phone = PhoneNumber::normalize($data['phone']);

        // A changed phone number must be confirmed again.
        if ($phone !== $v->phone) {
            $v->phone_verified_at = null;
            $v->phone_verified_by = null;
        }

        $v->fill([
            'full_name' => $data['full_name'],
            'id_type' => $data['id_type'],
            'id_number' => $data['id_number'],
            'address_line' => $data['address_line'],
            'town' => $data['town'],
            'country' => $data['country'],
            'licence_number' => $data['licence_number'],
            'licence_expiry' => $data['licence_expiry'],
            'phone' => $phone,
            'consent_at' => $v->consent_at ?? now(),
            'consent_ip' => $v->consent_ip ?? $request->ip(),
        ])->save();

        return back()->with('success', 'Details saved.');
    }

    public function document(Request $request, string $reference): RedirectResponse
    {
        $booking = $this->carBooking($reference);
        $this->authorised($request, $booking);
        $v = $this->forBooking($booking);
        abort_unless($v->isEditable(), 403);
        abort_unless($v->consent_at, 422, 'Please save your details and consent first.');

        $request->validate([
            'kind' => ['required', Rule::in(['id_front', 'id_back', 'licence_front', 'licence_back'])],
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,webp,heic', 'max:10240'],
        ], ['file.max' => 'That photo is too large (10 MB max).', 'file.mimes' => 'Please upload a photo (JPG, PNG or WEBP).']);

        $jpeg = ImagePipeline::fromUpload($request->file('file'));

        if (! $jpeg) {
            return back()->withErrors(['file' => 'We could not read that image. Please take the photo again.']);
        }

        VerificationDocument::updateOrCreate(
            ['rental_verification_id' => $v->id, 'kind' => $request->input('kind')],
            ['mime' => 'image/jpeg', 'data' => base64_encode($jpeg)]
        );

        return back()->with('success', 'Photo saved.');
    }

    public function selfie(Request $request, string $reference): RedirectResponse
    {
        $booking = $this->carBooking($reference);
        $this->authorised($request, $booking);
        $v = $this->forBooking($booking);
        abort_unless($v->isEditable(), 403);
        abort_unless($v->consent_at, 422, 'Please save your details and consent first.');

        $request->validate(['image' => ['required', 'string', 'max:4000000']]);

        // Comes from the camera as a data URL: data:image/jpeg;base64,...
        $raw = preg_replace('#^data:image/\w+;base64,#', '', $request->input('image'));
        $binary = base64_decode($raw, true);
        $jpeg = $binary ? ImagePipeline::fromBinary($binary, 1000) : null;

        if (! $jpeg) {
            return back()->withErrors(['image' => 'We could not read the selfie. Please try again.']);
        }

        VerificationDocument::updateOrCreate(
            ['rental_verification_id' => $v->id, 'kind' => 'selfie'],
            ['mime' => 'image/jpeg', 'data' => base64_encode($jpeg)]
        );
        $v->update(['selfie_taken_at' => now()]);

        return back()->with('success', 'Selfie saved.');
    }

    public function sendCode(Request $request, string $reference): RedirectResponse
    {
        $booking = $this->carBooking($reference);
        $this->authorised($request, $booking);
        $v = $this->forBooking($booking);
        abort_unless($v->isEditable(), 403);

        if (! Sms::configured() || ! $v->phone) {
            return back()->withErrors(['code' => 'Text codes are not available. Our team will confirm your phone by calling or WhatsApp.']);
        }

        if ($v->otp_sent_at && $v->otp_sent_at->gt(now()->subSeconds(60))) {
            return back()->withErrors(['code' => 'Please wait a minute before asking for another code.']);
        }

        $code = (string) random_int(100000, 999999);

        $sent = Sms::send($v->phone, "Biryaa Travels: your verification code is {$code}. It expires in 10 minutes.");

        if (! $sent) {
            return back()->withErrors(['code' => 'We could not send the text. Check the number, or let our team verify it for you.']);
        }

        $v->update([
            'otp_hash' => Hash::make($code),
            'otp_sent_at' => now(),
            'otp_expires_at' => now()->addMinutes(10),
            'otp_attempts' => 0,
        ]);

        return back()->with('success', 'Code sent.');
    }

    public function checkCode(Request $request, string $reference): RedirectResponse
    {
        $booking = $this->carBooking($reference);
        $this->authorised($request, $booking);
        $v = $this->forBooking($booking);
        abort_unless($v->isEditable(), 403);

        $request->validate(['code' => ['required', 'digits:6']]);

        if (! $v->otp_hash || ! $v->otp_expires_at || $v->otp_expires_at->isPast()) {
            return back()->withErrors(['code' => 'That code has expired. Please ask for a new one.']);
        }

        if ($v->otp_attempts >= 5) {
            return back()->withErrors(['code' => 'Too many wrong tries. Please ask for a new code.']);
        }

        if (! Hash::check($request->input('code'), $v->otp_hash)) {
            $v->increment('otp_attempts');

            return back()->withErrors(['code' => 'That code is not right.']);
        }

        $v->update([
            'phone_verified_at' => now(),
            'phone_verified_by' => 'sms',
            'otp_hash' => null,
            'otp_expires_at' => null,
        ]);

        return back()->with('success', 'Phone confirmed.');
    }

    public function submit(Request $request, string $reference): RedirectResponse
    {
        $booking = $this->carBooking($reference);
        $this->authorised($request, $booking);
        $v = $this->forBooking($booking);
        abort_unless($v->isEditable(), 403);

        $missing = $v->missing(Sms::configured());

        if (! $v->consent_at || $missing) {
            return back()->withErrors(['submit' => 'Please complete every step before sending.']);
        }

        $keepUntil = ($booking->end_date ?? now())->copy()->addDays(config('verification.retention_days'));

        $v->update([
            'status' => 'pending',
            'submitted_at' => now(),
            'reviewer_note' => null,
            'purge_after' => $keepUntil->toDateString(),
        ]);

        return back()->with('success', 'Sent. We will review your documents and contact you.');
    }
}