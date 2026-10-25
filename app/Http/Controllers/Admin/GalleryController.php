<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryPhoto;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Gallery/Index', [
            'photos' => GalleryPhoto::listing()->get()->map(fn ($p) => $p->toCard())->values(),
            'max' => GalleryPhoto::MAX,
            'categories' => GalleryPhoto::CATEGORIES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $remaining = GalleryPhoto::MAX - GalleryPhoto::count();

        if ($remaining <= 0) {
            return back()->with('error', 'The gallery is full ('.GalleryPhoto::MAX.' photos). Delete one to add another.');
        }

        $request->validate([
            'photos' => ['required', 'array', 'min:1', 'max:'.$remaining],
            'photos.*' => ['file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
            'category' => ['nullable', Rule::in(GalleryPhoto::CATEGORIES)],
        ], [
            'photos.max' => "You can add only {$remaining} more photo(s). The gallery holds ".GalleryPhoto::MAX.'.',
            'photos.*.image' => 'Each file must be a photo (JPG, PNG or WebP).',
            'photos.*.max' => 'Each photo must be smaller than 8 MB.',
        ]);

        $next = (int) GalleryPhoto::max('sort_order') + 1;
        $added = 0;

        foreach ($request->file('photos') as $file) {
            $processed = $this->process($file);

            if (! $processed) {
                continue;
            }

            GalleryPhoto::create([
                'category' => $request->input('category'),
                'sort_order' => $next++,
                'data' => $processed['data'],
                'width' => $processed['width'],
                'height' => $processed['height'],
            ]);
            $added++;
        }

        if ($added === 0) {
            return back()->with('error', 'Those files could not be read as photos. Try a JPG or PNG.');
        }

        return back()->with('success', $added === 1 ? 'Photo added.' : "{$added} photos added.");
    }

    public function update(Request $request, GalleryPhoto $photo): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:120'],
            'caption' => ['nullable', 'string', 'max:300'],
            'category' => ['nullable', Rule::in(GalleryPhoto::CATEGORIES)],
        ]);

        $photo->update($data);

        return back()->with('success', 'Photo details saved.');
    }

    public function move(Request $request, GalleryPhoto $photo): RedirectResponse
    {
        $direction = $request->validate(['direction' => ['required', 'in:up,down']])['direction'];

        $ids = GalleryPhoto::query()->orderBy('sort_order')->orderBy('id')->pluck('id')->all();
        $i = array_search($photo->id, $ids, true);
        $j = $direction === 'up' ? $i - 1 : $i + 1;

        if ($i !== false && isset($ids[$j])) {
            [$ids[$i], $ids[$j]] = [$ids[$j], $ids[$i]];
        }

        foreach ($ids as $position => $id) {
            GalleryPhoto::whereKey($id)->update(['sort_order' => $position]);
        }

        return back();
    }

    public function destroy(GalleryPhoto $photo): RedirectResponse
    {
        $photo->delete();

        return back()->with('success', 'Photo deleted.');
    }

    /**
     * Re-encode the upload as a clean JPEG no wider than 1600px.
     * This also strips location data and other hidden metadata.
     */
    private function process(UploadedFile $file): ?array
    {
        $raw = @file_get_contents($file->getRealPath());
        $image = $raw ? @imagecreatefromstring($raw) : false;

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

        $width = imagesx($image);
        $height = imagesy($image);
        $scale = min(1, 1600 / max($width, $height));
        $newWidth = max(1, (int) round($width * $scale));
        $newHeight = max(1, (int) round($height * $scale));

        // Draw on a white canvas so transparent PNGs do not turn black.
        $canvas = imagecreatetruecolor($newWidth, $newHeight);
        imagefill($canvas, 0, 0, imagecolorallocate($canvas, 255, 255, 255));
        imagecopyresampled($canvas, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

        ob_start();
        imagejpeg($canvas, null, 82);
        $jpeg = ob_get_clean();

        return [
            'data' => base64_encode($jpeg),
            'width' => $newWidth,
            'height' => $newHeight,
        ];
    }
}
