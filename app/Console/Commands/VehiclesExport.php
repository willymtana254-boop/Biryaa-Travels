<?php

namespace App\Console\Commands;

use App\Models\Vehicle;
use Illuminate\Console\Command;

class VehiclesExport extends Command
{
    protected $signature = 'vehicles:export';

    protected $description = 'Save every vehicle in this database to database/seed/vehicles.json';

    public function handle(): int
    {
        $rows = Vehicle::query()->orderBy('id')->get()->map(function (Vehicle $vehicle) {
            $row = $vehicle->attributesToArray();
            unset($row['id'], $row['created_at'], $row['updated_at']);

            return $row;
        })->values();

        $path = database_path('seed/vehicles.json');
        @mkdir(dirname($path), 0777, true);
        file_put_contents($path, json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

        $this->info("Saved {$rows->count()} vehicles to database/seed/vehicles.json");

        foreach ($rows as $row) {
            $this->line(' - '.($row['name'] ?? $row['slug'] ?? '?'));
        }

        return self::SUCCESS;
    }
}
