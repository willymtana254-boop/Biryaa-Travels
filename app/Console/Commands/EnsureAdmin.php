<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class EnsureAdmin extends Command
{
    protected $signature = 'admin:ensure';

    protected $description = 'Create or update the admin account from ADMIN_EMAIL / ADMIN_PASSWORD.';

    public function handle(): int
    {
        $email = config('admin.email');
        $password = config('admin.password');

        if (! $email || ! $password) {
            $this->warn('ADMIN_EMAIL / ADMIN_PASSWORD not set; skipping.');

            return self::SUCCESS;
        }

        if (strlen($password) < 12) {
            $this->error('ADMIN_PASSWORD must be at least 12 characters.');

            return self::FAILURE;
        }

        User::updateOrCreate(['email' => $email], ['name' => 'Admin', 'password' => $password, 'role' => 'admin']);
        $this->info("Admin account ready: {$email}");

        return self::SUCCESS;
    }
}