<?php

return [
    // Any disk from config/filesystems.php ('public' locally; 's3' for R2/S3 in production)
    'disk' => env('REVIEW_PHOTO_DISK', 'public'),
    'max_photos' => 6,
];