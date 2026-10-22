<?php

namespace App\Console\Commands;

use App\Models\Location;
use App\Models\Tour;
use App\Models\TransferRoute;
use App\Models\Vehicle;
use App\Models\Villa;
use Illuminate\Console\Command;

class SeedReferenceData extends Command
{
    protected $signature = 'reference:seed';

    protected $description = 'Seed locations, vehicles, villas, tours and routes, but only into tables that are empty.';

    public function handle(): int
    {
        // Order matters: villas, tours and routes need locations first.
        $steps = [
            [Location::class, 'LocationSeeder'],
            [Vehicle::class, 'VehicleSeeder'],
            [Villa::class, 'VillaSeeder'],
            [Tour::class, 'TourSeeder'],
            [TransferRoute::class, 'TransferRouteSeeder'],
        ];

        foreach ($steps as [$model, $seeder]) {
            if ($model::query()->exists()) {
                $this->line("Skipping {$seeder}: data already present.");

                continue;
            }

            $this->call('db:seed', ['--class' => "Database\\Seeders\\{$seeder}", '--force' => true]);
        }

        return self::SUCCESS;
    }
}