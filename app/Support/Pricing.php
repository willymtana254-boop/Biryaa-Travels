<?php

namespace App\Support;

use Carbon\Carbon;

class Pricing
{
    /**
     * @param  'vehicle'|'villa'|'tour'|'transfer'  $type
     * @param  array{start_date:string,end_date?:?string,guests?:?int,with_driver?:bool,extras?:array}  $input
     * @return array{lines: array<int,array{label:string,amount:float}>, total: float, units: int, extras: array<string,int>}
     */
    public static function quote(string $type, $bookable, array $input): array
    {
        $start = Carbon::parse($input['start_date'])->startOfDay();
        $end = ! empty($input['end_date']) ? Carbon::parse($input['end_date'])->startOfDay() : $start;
        $units = max(1, (int) $start->diffInDays($end));

        $lines = [];
        $discountable = 0.0;
        $tiers = [];

        if ($type === 'vehicle') {
            $base = (float) $bookable->price_per_day * $units;
            $lines[] = self::line("Car hire · {$units} ".self::plural($units, 'day'), $base);
            $discountable = $base;

            if (! empty($input['with_driver'])) {
                $fee = (float) config('pricing.vehicle.driver_fee_per_day') * $units;
                $lines[] = self::line("Driver · {$units} ".self::plural($units, 'day'), $fee);
            }

            $tiers = config('pricing.vehicle.discounts', []);
        } elseif ($type === 'villa') {
            $base = (float) $bookable->price_per_night * $units;
            $lines[] = self::line("Accommodation · {$units} ".self::plural($units, 'night'), $base);
            $discountable = $base;
            $tiers = config('pricing.villa.discounts', []);
        } elseif ($type === 'tour') {
            $guests = max(1, (int) ($input['guests'] ?? 1));
            $lines[] = self::line("Experience · {$guests} ".self::plural($guests, 'guest'), (float) $bookable->price * $guests);
        } else { // transfer: fixed fare per route and vehicle
            $lines[] = self::line('Transfer · fixed fare', (float) $bookable->price);
        }

        // Longest-stay tier that applies
        $percent = 0;
        foreach (collect($tiers)->sortByDesc('min_days') as $tier) {
            if ($units >= $tier['min_days']) {
                $percent = $tier['percent'];
                break;
            }
        }
        if ($percent > 0 && $discountable > 0) {
            $lines[] = self::line("Length-of-stay discount ({$percent}%)", -($discountable * $percent / 100));
        }

        // Add-ons (unknown keys ignored, quantities clamped)
        $defs = config("pricing.extras.{$type}", []);
        $cleanExtras = [];
        foreach ((array) ($input['extras'] ?? []) as $key => $qty) {
            if (! isset($defs[$key])) {
                continue;
            }
            $qty = max(0, min((int) $qty, (int) $defs[$key]['max']));
            if ($qty === 0) {
                continue;
            }
            $perUnit = $defs[$key]['unit'] === 'day' ? $units : 1;
            $lines[] = self::line("{$defs[$key]['label']} × {$qty}", (float) $defs[$key]['price'] * $qty * $perUnit);
            $cleanExtras[$key] = $qty;
        }

        return [
            'lines' => $lines,
            'total' => round(max(0, array_sum(array_column($lines, 'amount'))), 2),
            'units' => $units,
            'extras' => $cleanExtras,
        ];
    }

    private static function line(string $label, float $amount): array
    {
        return ['label' => $label, 'amount' => round($amount, 2)];
    }

    private static function plural(int $n, string $word): string
    {
        return $n === 1 ? $word : $word.'s';
    }
}