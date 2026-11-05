<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

/** One simple branded email used for every booking message. */
class BookingMessage extends Mailable
{
    /** @param array{subject:string,heading:string,intro:string,rows:array,button?:array,note?:string} $d */
    public function __construct(public array $d)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: $this->d['subject']);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.booking', with: ['d' => $this->d]);
    }
}
