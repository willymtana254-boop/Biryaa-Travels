<?php

namespace App\Support;

class Phone
{
    /** 0716 168 180 / +254 716 168 180 / 254716168180  ->  254716168180 */
    public static function normalize(?string $raw): ?string
    {
        if ($raw === null) {
            return null;
        }

        $digits = preg_replace('/\D+/', '', $raw);

        if ($digits === '') {
            return null;
        }

        if (str_starts_with($digits, '00')) {            // 0044... -> 44...
            $digits = substr($digits, 2);
        }

        if (str_starts_with($digits, '2540') && strlen($digits) === 13) {   // +254 0716...
            return '254'.substr($digits, 4);
        }

        if (str_starts_with($digits, '0') && strlen($digits) === 10) {      // 0716...
            return '254'.substr($digits, 1);
        }

        if (strlen($digits) === 9 && in_array($digits[0], ['7', '1'], true)) { // 716...
            return '254'.$digits;
        }

        return $digits; // already international
    }
}