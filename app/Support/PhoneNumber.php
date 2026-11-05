<?php

namespace App\Support;

/**
 * Phone number rules:
 *  - Kenyan numbers: exactly 10 digits, starting 07 or 01 (e.g. 0712 345 678),
 *    or the same number written +254… / 254…
 *  - Any other country: must start with + (or 00) and the country code,
 *    at most 15 digits in total (the international standard).
 */
class PhoneNumber
{
    public const MESSAGE = 'Enter a Kenyan number with 10 digits (for example 0712 345 678), or an international number starting with + and the country code (up to 15 digits).';

    /** Returns the number as +254712345678 style, or null if it is not valid. */
    public static function normalize(?string $input): ?string
    {
        $raw = trim((string) $input);

        if ($raw === '') {
            return null;
        }

        $hasPlus = str_starts_with($raw, '+');
        $digits = preg_replace('/\D+/', '', $raw);

        if ($digits === '') {
            return null;
        }

        if (! $hasPlus && str_starts_with($digits, '00')) {
            $hasPlus = true;
            $digits = substr($digits, 2);
        }

        if ($hasPlus) {
            if (str_starts_with($digits, '254')) {
                return preg_match('/^254[17]\d{8}$/', $digits) ? '+'.$digits : null;
            }

            // Other countries: no leading 0, 8 to 15 digits including the country code.
            return preg_match('/^[1-9]\d{7,14}$/', $digits) ? '+'.$digits : null;
        }

        if (preg_match('/^0[17]\d{8}$/', $digits)) {
            return '+254'.substr($digits, 1);
        }

        if (preg_match('/^254[17]\d{8}$/', $digits)) {
            return '+'.$digits;
        }

        return null;
    }

    public static function isValid(?string $input): bool
    {
        return self::normalize($input) !== null;
    }

    /** +254 7•• ••• 798  (for showing a number without giving it all away) */
    public static function mask(?string $input): string
    {
        $n = self::normalize($input) ?? (string) $input;

        return strlen($n) > 6 ? substr($n, 0, 5).str_repeat('•', max(strlen($n) - 8, 1)).substr($n, -3) : $n;
    }
}
