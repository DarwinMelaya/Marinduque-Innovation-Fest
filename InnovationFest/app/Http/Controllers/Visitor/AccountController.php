<?php

namespace App\Http\Controllers\Visitor;

use App\Http\Controllers\Controller;
use App\Models\BonusCode;
use App\Models\BoothVisit;
use App\Models\Participant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    /**
     * Show the participant their booth visits and the points they earned.
     */
    public function show(Request $request): Response
    {
        /** @var Participant $participant */
        $participant = $request->user('participant');

        $visits = $participant->boothVisits()
            ->with('booth:id,booth_name')
            ->latest()
            ->latest('id')
            ->get();

        $bonuses = $participant->bonusCodes()
            ->with('batch')
            ->latest('redeemed_at')
            ->latest('id')
            ->get();

        return Inertia::render('visitors/VisitorsHome', [
            'participant' => [
                'name' => $participant->fullName(),
                'firstName' => $participant->first_name,
                'festId' => $participant->fest_id,
                'qrCode' => 'data:image/png;base64,'.base64_encode($participant->qrCodePng()),
                'qrTicket' => 'data:image/png;base64,'.base64_encode($participant->qrTicketPng()),
            ],
            'stats' => [
                'points' => $visits->sum('points') + $bonuses->sum('batch.points'),
                'visits' => $visits->count(),
                'booths' => $visits->unique('user_id')->count(),
            ],
            'visits' => $visits->map(fn (BoothVisit $visit) => [
                'id' => $visit->id,
                'boothName' => $visit->booth->booth_name,
                'points' => $visit->points,
                'visitedAt' => $visit->created_at?->toIso8601String(),
            ]),
            'bonuses' => $bonuses->map(fn (BonusCode $bonus) => [
                'id' => $bonus->id,
                'label' => $bonus->batch->label,
                'points' => $bonus->batch->points,
                'redeemedAt' => $bonus->redeemed_at?->toIso8601String(),
            ]),
        ]);
    }

    /**
     * Sign a participant in with the Innovation Fest ID typed in or read from their QR code.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'fest_id' => ['required', 'string', 'max:50'],
        ]);

        $participant = Participant::findByFestId($validated['fest_id']);

        if ($participant === null) {
            throw ValidationException::withMessages([
                'fest_id' => 'No participant found for this Innovation Fest ID.',
            ]);
        }

        Auth::guard('participant')->login($participant);
        $request->session()->regenerate();

        return to_route('visitor.home');
    }

    /**
     * Sign the participant out without touching any staff or admin login in the same browser.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('participant')->logout();
        $request->session()->regenerateToken();

        return to_route('participants.register');
    }
}
