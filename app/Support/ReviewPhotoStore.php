<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ReviewPhotoStore
{
    public static function disk(): string
    {
        return config('reviews.disk', 'public');
    }

    public static function url(string $path): string
    {
        // Relative URL for the local disk, so it works whatever APP_URL is set to.
        if (self::disk() === 'public') {
            return '/storage/'.$path;
        }

        return Storage::disk(self::disk())->url($path);
    }

    public static function forget(string $path): void
    {
        Storage::disk(self::disk())->delete($path);
    }

    /** Returns the stored path, or null if the file isn't a readable image. */
    public static function store(UploadedFile $file): ?string
    {
        $raw = @file_get_contents($file->getRealPath());
        $img = $raw ? @imagecreatefromstring($raw) : false;

        if (! $img) {
            return null;
        }

        // Respect phone camera orientation before the metadata is dropped.
        if (function_exists('exif_read_data') && in_array(strtolower($file->getClientOriginalExtension()), ['jpg', 'jpeg'])) {
            $exif = @exif_read_data($file->getRealPath());
            $angle = match ($exif['Orientation'] ?? 1) {
                3 => 180,
                6 => -90,
                8 => 90,
                default => 0,
            };
            if ($angle && ($rotated = imagerotate($img, $angle, 0))) {
                $img = $rotated;
            }
        }

        $w = imagesx($img);
        $h = imagesy($img);
        $scale = min(1, 1600 / max($w, $h));
        $nw = (int) round($w * $scale);
        $nh = (int) round($h * $scale);

        $canvas = imagecreatetruecolor($nw, $nh);
        imagefill($canvas, 0, 0, imagecolorallocate($canvas, 255, 255, 255));
        imagecopyresampled($canvas, $img, 0, 0, 0, 0, $nw, $nh, $w, $h);

        ob_start();
        imagejpeg($canvas, null, 82);
        $jpeg = ob_get_clean();

        imagedestroy($img);
        imagedestroy($canvas);

        $path = 'reviews/'.now()->format('Y/m').'/'.Str::random(32).'.jpg';
        Storage::disk(self::disk())->put($path, $jpeg);

        return $path;
    }
}