<?php

use App\Mail\ParticipantRegistered;
use App\Models\Participant;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('participants:send-qr {fest_id}', function (string $fest_id) {
    $participant = Participant::where('fest_id', $fest_id)->first();

    if (! $participant) {
        $this->error("No participant with Innovation Fest ID {$fest_id}.");

        return 1;
    }

    Mail::to($participant->email)->send(new ParticipantRegistered($participant));

    if (in_array(config('mail.default'), ['log', 'array'])) {
        $this->warn("MAIL_MAILER is '".config('mail.default')."', so the email was only written to the log, not delivered.");

        return;
    }

    $this->info("Sent {$participant->fest_id} to {$participant->email}.");
})->purpose('Resend a participant their Innovation Fest ID and QR code');
