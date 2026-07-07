<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\TransferRoute;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransferController extends Controller
{
    public function index(Request $request): Response
    {
        $routes = TransferRoute::with(['fromLocation', 'toLocation'])
            ->when($request->from, fn ($q, $from) => $q->where('from_location_id', $from))
            ->when($request->to, fn ($q, $to) => $q->where('to_location_id', $to))
            ->orderBy('price')
            ->get();

        return Inertia::render('Transfers/Index', [
            'routes' => $routes,
            'locations' => Location::orderBy('name')->get(['id', 'name', 'slug']),
            'filters' => $request->only('from', 'to'),
        ]);
    }
}
