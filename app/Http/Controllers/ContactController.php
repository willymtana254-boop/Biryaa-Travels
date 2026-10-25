<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('Contact');
    }

    public function store(Request $request): RedirectResponse
    {
        // Hidden "website" field: real visitors leave it empty, spam bots fill it in.
        if ($request->filled('website')) {
            return back()->with('success', 'Thank you! We will get back to you shortly.');
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['required_without:email', 'nullable', 'string', 'max:40'],
            'email' => ['required_without:phone', 'nullable', 'email', 'max:190'],
            'subject' => ['nullable', 'string', 'max:160'],
            'message' => ['required', 'string', 'min:5', 'max:3000'],
        ], [
            'phone.required_without' => 'Please give us a phone number or an email so we can reply.',
            'email.required_without' => 'Please give us a phone number or an email so we can reply.',
        ]);

        ContactMessage::create($data);

        return back()->with('success', 'Thank you! We have received your message and will get back to you shortly.');
    }
}
