<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VerificationDocument extends Model
{
    public const KINDS = ['id_front', 'id_back', 'licence_front', 'licence_back', 'selfie'];

    protected $fillable = ['rental_verification_id', 'kind', 'mime', 'data'];

    // The image is stored encrypted, so it is useless if the database is ever copied.
    protected $hidden = ['data'];

    protected function casts(): array
    {
        return ['data' => 'encrypted'];
    }

    public function verification(): BelongsTo
    {
        return $this->belongsTo(RentalVerification::class, 'rental_verification_id');
    }
}
