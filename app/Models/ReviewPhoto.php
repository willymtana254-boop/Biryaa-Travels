<?php

namespace App\Models;

use App\Support\ReviewPhotoStore;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReviewPhoto extends Model
{
    protected $fillable = ['review_id', 'path'];

    protected $appends = ['url'];

    public function review(): BelongsTo
    {
        return $this->belongsTo(Review::class);
    }

    public function getUrlAttribute(): string
    {
        return ReviewPhotoStore::url($this->path);
    }
}