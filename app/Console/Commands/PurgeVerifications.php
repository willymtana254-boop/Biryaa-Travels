<?php

namespace App\Console\Commands;

use App\Http\Controllers\Admin\VerificationController;
use App\Models\RentalVerification;
use Illuminate\Console\Command;

class PurgeVerifications extends Command
{
    protected $signature = 'verifications:purge';

    protected $description = 'Delete hirer ID, licence and selfie images once their retention date has passed';

    public function handle(): int
    {
        $count = 0;

        RentalVerification::whereNotNull('purge_after')
            ->whereDate('purge_after', '<=', now()->toDateString())
            ->each(function (RentalVerification $v) use (&$count) {
                VerificationController::purge($v);
                $count++;
            });

        $this->info("Purged {$count} verification(s).");

        return self::SUCCESS;
    }
}
