<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Models\Vehicle;
use Illuminate\Console\Command;

class VehiclesImport extends Command
{
    protected $signature = 'vehicles:import {--prune : Also remove vehicles that are not in the file (never ones with bookings)}';

    protected $description = 'Make this database match database/seed/vehicles.json';

    public function handle(): int
    {
        $path = database_path('seed/vehicles.json');

        if (! is_file($path)) {
            $this->error('database/seed/vehicles.json not found. Run vehicles:export on your computer first.');

            return self::FAILURE;
        }

        $rows = json_decode(file_get_contents($path), true);

        if (! is_array($rows) || $rows === []) {
            $this->error('The vehicles file is empty or unreadable. Nothing changed.');

            return self::FAILURE;
        }

        $slugs = [];

        foreach ($rows as $row) {
            if (empty($row['slug'])) {
                continue;
            }

            $vehicle = Vehicle::firstOrNew(['slug' => $row['slug']]);
            $vehicle->forceFill($row)->save();
            $slugs[] = $row['slug'];
        }

        $this->info('Synced '.count($slugs).' vehicles.');

        if ($this->option('prune')) {
            foreach (Vehicle::whereNotIn('slug', $slugs)->get() as $old) {
                $hasBookings = Booking::where('bookable_type', Vehicle::class)->where('bookable_id', $old->id)->exists();

                if ($hasBookings) {
                    $this->warn("Kept {$old->name}: it has bookings.");
                    continue;
                }

                $old->delete();
                $this->line("Removed {$old->name}");
            }
        }

        return self::SUCCESS;
    }
}
