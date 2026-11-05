<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PolicyController extends Controller
{
    public function terms(): Response
    {
        return Inertia::render('Terms', ['policies' => config('policies')]);
    }
}
