<?php

namespace App\Http\Controllers\Visitor;

use App\Http\Controllers\Controller;
use App\Models\BonusCode;
use App\Models\Participant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class BonusCodeController extends Controller
{
    /**
     * Give the signed-in participant the points of a scanned bonus QR code. Each code works only once.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:255'],
        ]);

        /** @var Participant $participant */
        $participant = $request->user('participant');

        $code = BonusCode::query()
            ->with('batch')
            ->where('code', BonusCode::normalize($validated['code']))
            ->first();

        if ($code === null) {
            throw ValidationException::withMessages([
                'code' => 'This is not a bonus QR code.',
            ]);
        }

        if (! $code->redeemFor($participant)) {
            throw ValidationException::withMessages([
                'code' => $code->participant_id === $participant->id
                    ? 'You already scanned this QR code.'
                    : 'This QR code was already scanned by someone else.',
            ]);
        }

        Inertia::flash('bonus', [
            'label' => $code->batch->label,
            'points' => $code->batch->points,
        ]);

        return to_route('visitor.home');
    }
}
