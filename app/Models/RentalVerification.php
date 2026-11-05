<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RentalVerification extends Model
{
    /** The documents every hirer must provide (id_back is skipped for passports). */
    public const DOCUMENT_KINDS = ['id_front', 'id_back', 'licence_front', 'licence_back'];

    protected $fillable = [
        'booking_id', 'status', 'full_name', 'id_type', 'id_number', 'address_line', 'town', 'country',
        'licence_number', 'licence_expiry', 'phone', 'phone_verified_at', 'phone_verified_by',
        'otp_hash', 'otp_sent_at', 'otp_expires_at', 'otp_attempts',
        'consent_at', 'consent_ip', 'selfie_taken_at', 'submitted_at',
        'reviewed_at', 'reviewed_by', 'reviewer_note', 'purge_after',
    ];

    protected $hidden = ['otp_hash'];

    protected function casts(): array
    {
        return [
            // Stored encrypted with the app key. Keep APP_KEY the same forever.
            'id_number' => 'encrypted',
            'address_line' => 'encrypted',
            'licence_number' => 'encrypted',
            'licence_expiry' => 'date',
            'purge_after' => 'date',
            'phone_verified_at' => 'datetime',
            'otp_sent_at' => 'datetime',
            'otp_expires_at' => 'datetime',
            'consent_at' => 'datetime',
            'selfie_taken_at' => 'datetime',
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
        ];
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(VerificationDocument::class);
    }

    public function documentKinds(): array
    {
        return $this->documents()->pluck('kind')->all();
    }

    public function isEditable(): bool
    {
        return in_array($this->status, ['incomplete', 'rejected'], true);
    }

    /** What is still missing before the hirer can submit. */
    public function missing(bool $smsEnabled): array
    {
        $kinds = $this->documentKinds();
        $missing = [];

        foreach (['full_name', 'id_type', 'id_number', 'address_line', 'town', 'country', 'licence_number', 'licence_expiry'] as $field) {
            if (blank($this->{$field})) {
                $missing[] = 'details';
                break;
            }
        }

        if (! in_array('id_front', $kinds, true)) {
            $missing[] = 'id_front';
        }

        if ($this->id_type !== 'passport' && ! in_array('id_back', $kinds, true)) {
            $missing[] = 'id_back';
        }

        if (! in_array('licence_front', $kinds, true)) {
            $missing[] = 'licence_front';
        }

        if (! in_array('selfie', $kinds, true)) {
            $missing[] = 'selfie';
        }

        // With text messages switched on the phone must be confirmed by code.
        // Otherwise our staff confirm it by calling or WhatsApp.
        if ($smsEnabled && ! $this->phone_verified_at) {
            $missing[] = 'phone';
        }

        return $missing;
    }
}
