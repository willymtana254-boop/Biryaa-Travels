<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class GalleryPhoto extends Model
{
    /** The most photos the gallery can hold. */
    public const MAX = 15;

    public const CATEGORIES = [
        'Beaches',
        'Stays',
        'Cars & Transfers',
        'Experiences',
        'Food & Dining',
        'Happy Guests',
    ];

    protected $fillable = ['title', 'caption', 'category', 'sort_order', 'width', 'height', 'data'];

    /** Everything except the (large) image data. */
    public function scopeListing(Builder $query): Builder
    {
        return $query
            ->select(['id', 'title', 'caption', 'category', 'sort_order', 'width', 'height', 'updated_at'])
            ->orderBy('sort_order')
            ->orderBy('id');
    }

    /** Public address of the image; ?v= makes browsers reload it after a change. */
    public function toCard(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'caption' => $this->caption,
            'category' => $this->category,
            'width' => $this->width,
            'height' => $this->height,
            'url' => '/gallery/photo/'.$this->id.'?v='.optional($this->updated_at)->timestamp,
        ];
    }
}
