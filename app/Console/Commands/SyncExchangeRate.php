<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class SyncExchangeRate extends Command
{
    protected $signature = 'rates:sync';

    protected $description = 'Fetch the latest USD to KES rate and cache it.';

    public function handle(): int
    {
        try {
            $res = Http::timeout(10)->get('https://open.er-api.com/v6/latest/USD');
            $rate = $res->json('rates.KES');

            if ($res->ok() && is_numeric($rate) && $rate > 50 && $rate < 400) {
                Cache::forever('kes_per_usd', (float) $rate);
                $this->info("1 USD = {$rate} KES");

                return self::SUCCESS;
            }
        } catch (\Throwable $e) {
            // fall through
        }

        $this->warn('Could not update the rate; keeping the previous value.');

        return self::FAILURE;
    }
}