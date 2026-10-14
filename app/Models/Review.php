<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id', 'reviewer_name', 'rating', 'title', 'body', 'visited_on',
        'marketing_consent', 'status', 'admin_reply', 'approved_at',
    ];

    protected $casts = [
        'visited_on' => 'date',
        'marketing_consent' => 'boolean',
        'approved_at' => 'datetime',
    ];

    protected $appends = ['display_name'];

    protected static function booted(): void
    {
        // Deleting a review also deletes its photo files.
        static::deleting(function (Review $review) {
            $review->photos->each(fn (ReviewPhoto $p) => \App\Support\ReviewPhotoStore::forget($p->path));
        });
    }

    public function reviewable(): MorphTo
    {
        return $this->morphTo();
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(ReviewPhoto::class);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /** "William Saidi" -> "William S." (guest privacy on public pages) */
    public function getDisplayNameAttribute(): string
    {
        $parts = preg_split('/\s+/', trim((string) $this->reviewer_name)) ?: [];
        $first = $parts[0] ?: 'Guest';
        $last = count($parts) > 1 ? ' '.mb_strtoupper(mb_substr(end($parts), 0, 1)).'.' : '';

        return $first.$last;
    }
}