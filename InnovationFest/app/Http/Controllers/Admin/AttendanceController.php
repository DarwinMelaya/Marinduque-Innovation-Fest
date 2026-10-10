<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Participant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Record fest attendance from a scanned QR code (fest ID). Once per participant per day.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'fest_id' => ['required', 'string', 'max:50'],
        ]);

        $participant = Participant::findByFestId($validated['fest_id']);

        if ($participant === null) {
            throw ValidationException::withMessages([
                'fest_id' => 'No participant found for this QR code.',
            ]);
        }

        $attendance = Attendance::query()->createOrFirst([
            'participant_id' => $participant->id,
            'attended_on' => Attendance::today(),
        ]);

        if (! $attendance->wasRecentlyCreated) {
            throw ValidationException::withMessages([
                'fest_id' => "{$participant->fullName()} already checked in today.",
            ]);
        }

        Inertia::flash('attendance', [
            'name' => $participant->fullName(),
            'festId' => $participant->fest_id,
            'municipality' => $participant->municipality,
        ]);

        return back();
    }
}
