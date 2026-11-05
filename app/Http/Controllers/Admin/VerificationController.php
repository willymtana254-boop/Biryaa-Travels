<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\RentalVerification;
use App\Models\VerificationDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class VerificationController extends Controller
{
    /** Streams one image to a logged-in admin only. Never cached. */
    public function image(RentalVerification $verification, string $kind)
    {
        abort_unless(in_array($kind, VerificationDocument::KINDS, true), 404);

        $doc = $verification->documents()->where('kind', $kind)->firstOrFail();

        return response(base64_decode($doc->data), 200, [
            'Content-Type' => $doc->mime ?: 'image/jpeg',
            'Cache-Control' => 'no-store, private',
            'X-Robots-Tag' => 'noindex',
            'Content-Disposition' => 'inline',
        ]);
    }

    public function decide(Request $request, RentalVerification $verification): RedirectResponse
    {
        $data = $request->validate([
            'decision' => ['required', Rule::in(['approved', 'rejected'])],
            'note' => ['nullable', 'string', 'max:1000', 'required_if:decision,rejected'],
        ], ['note.required_if' => 'Tell the hirer what to fix.']);

        abort_unless($verification->status === 'pending' || $verification->status === 'approved' || $verification->status === 'rejected', 422);

        $verification->update([
            'status' => $data['decision'],
            'reviewer_note' => $data['note'] ?? null,
            'reviewed_at' => now(),
            'reviewed_by' => $request->user()?->name,
        ]);

        return back()->with('success', 'Verification '.$data['decision'].'.');
    }

    /** For when staff confirmed the number by calling or WhatsApp. */
    public function verifyPhone(Request $request, RentalVerification $verification): RedirectResponse
    {
        $verification->update(['phone_verified_at' => now(), 'phone_verified_by' => 'staff']);

        return back()->with('success', 'Phone marked as confirmed.');
    }

    /** Deletes the images and sensitive details right now. */
    public function destroy(RentalVerification $verification): RedirectResponse
    {
        self::purge($verification);

        return back()->with('success', 'Documents deleted.');
    }

    public static function purge(RentalVerification $v): void
    {
        $v->documents()->delete();
        $v->update([
            'status' => 'incomplete',
            'id_number' => null,
            'address_line' => null,
            'licence_number' => null,
            'licence_expiry' => null,
            'otp_hash' => null,
            'purge_after' => null,
            'selfie_taken_at' => null,
        ]);
    }
}
