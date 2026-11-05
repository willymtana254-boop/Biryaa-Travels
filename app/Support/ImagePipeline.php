<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;

/**
 * Turns an upload into a clean JPEG (max 1600px). Re-saving the image removes hidden
 * data such as GPS location, and it proves the file really is a picture.
 */
class ImagePipeline
{
    public static function fromUpload(UploadedFile $file, int $max = 1600, int $quality = 82): ?string
    {
        $raw = @file_get_contents($file->getRealPath());

        if (! $raw) {
            return null;
        }

        $image = self::decode($raw);

        if (! $image) {
            return null;
        }

        // Respect the camera's rotation flag on JPEG photos.
        if (function_exists('exif_read_data') && in_array($file->getMimeType(), ['image/jpeg', 'image/jpg'], true)) {
            $orientation = @exif_read_data($file->getRealPath())['Orientation'] ?? 1;
            $rotated = match ($orientation) {
                3 => imagerotate($image, 180, 0),
                6 => imagerotate($image, -90, 0),
                8 => imagerotate($image, 90, 0),
                default => $image,
            };
            $image = $rotated ?: $image;
        }

        return self::encode($image, $max, $quality);
    }

    public static function fromBinary(string $raw, int $max = 1280, int $quality = 82): ?string
    {
        $image = self::decode($raw);

        return $image ? self::encode($image, $max, $quality) : null;
    }

    private static function decode(string $raw)
    {
        $image = @imagecreatefromstring($raw);

        return $image ?: null;
    }

    private static function encode($image, int $max, int $quality): string
    {
        $width = imagesx($image);
        $height = imagesy($image);
        $scale = min(1, $max / max($width, $height));
        $newWidth = max(1, (int) round($width * $scale));
        $newHeight = max(1, (int) round($height * $scale));

        // White canvas so transparent PNGs do not turn black.
        $canvas = imagecreatetruecolor($newWidth, $newHeight);
        imagefill($canvas, 0, 0, imagecolorallocate($canvas, 255, 255, 255));
        imagecopyresampled($canvas, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

        ob_start();
        imagejpeg($canvas, null, $quality);

        return (string) ob_get_clean();
    }
}
