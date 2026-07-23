<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@biryaa.com'],
            [
                'name' => 'Admin',
                // Do NOT Hash::make() here — the User model already casts
                // 'password' => 'hashed', so this plain string gets hashed
                // automatically on save. Hashing it manually here as well
                // double-hashes it, which is why login was failing.
                'password' => 'password',
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );
    }
}