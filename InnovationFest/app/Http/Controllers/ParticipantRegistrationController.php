<?php

namespace App\Http\Controllers;

use App\Mail\ParticipantRegistered;
use App\Models\Participant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class ParticipantRegistrationController extends Controller
{
    /**
     * Show the participant registration form.
     */
    public function create(Request $request): Response
    {
        $participant = Participant::find($request->session()->get('registered_participant_id'));

        return Inertia::render('auth/ParticipantsRegistration', [
            'registration' => $participant ? [
                'festId' => $participant->fest_id,
                'name' => $participant->fullName(),
                'email' => $participant->email,
                'qrCode' => 'data:image/png;base64,'.base64_encode($participant->qrCodePng()),
                'qrTicket' => 'data:image/png;base64,'.base64_encode($participant->qrTicketPng()),
                'emailSent' => (bool) $request->session()->get('registration_email_sent', false),
            ] : null,
            'barangays' => config('marinduque.barangays'),
            'educationLevels' => Participant::EDUCATION_LEVELS,
        ]);
    }

    /**
     * Save a participant registration.
     */
    public function store(Request $request): RedirectResponse
    {
        $barangays = config('marinduque.barangays');

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'age' => ['required', 'integer', 'min:1', 'max:120'],
            'sex' => ['required', Rule::in(Participant::SEXES)],
            'is_pwd' => ['sometimes', 'boolean'],
            'is_indigenous' => ['sometimes', 'boolean'],
            'is_senior_citizen' => ['sometimes', 'boolean'],
            'is_4ps_member' => ['sometimes', 'boolean'],
            'municipality' => ['required', Rule::in(array_keys($barangays))],
            'barangay' => ['required', Rule::in($barangays[$request->input('municipality')] ?? [])],
            'education_level' => ['nullable', Rule::in(Participant::EDUCATION_LEVELS)],
            'school' => ['exclude_without:education_level', 'required', 'string', 'max:255'],
            'course' => ['exclude_unless:education_level,College', 'required', 'string', 'max:255'],
            'agency' => ['exclude_unless:education_level,null', 'nullable', 'string', 'max:255'],
            'organization' => ['exclude_unless:education_level,null', 'nullable', 'string', 'max:255'],
            'contact_number' => ['required', 'string', 'regex:/^(09|\+639)\d{9}$/'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(Participant::class)],
        ], [
            'contact_number.regex' => 'Enter a valid mobile number, e.g. 09171234567.',
            'email.unique' => 'This email is already registered.',
            'barangay.in' => 'Select a barangay from the chosen municipality.',
        ]);

        $participant = Participant::create($validated);

        try {
            Mail::to($participant->email)->send(new ParticipantRegistered($participant));
            $emailSent = true;
        } catch (Throwable $e) {
            report($e);
            $emailSent = false;
        }

        return to_route('participants.register')->with([
            'registered_participant_id' => $participant->id,
            'registration_email_sent' => $emailSent,
        ]);
    }
}
