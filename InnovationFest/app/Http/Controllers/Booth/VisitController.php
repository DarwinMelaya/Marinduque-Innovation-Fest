<?php

namespace App\Http\Controllers\Booth;

use App\Http\Controllers\Controller;
use App\Models\BoothVisit;
use App\Models\Participant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class VisitController extends Controller
{
    /**
     * List every visitor scanned at the booth.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('boothstaff/BoothListVisits', [
            'visits' => $request->user()
                ->boothVisits()
                ->with('participant')
                ->latest()
                ->latest('id')
                ->get()
                ->map(fn (BoothVisit $visit) => self::present($visit)),
        ]);
    }

    /**
     * Record a visitor from their scanned QR code (their fest ID). Each participant counts once per booth per day.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'fest_id' => ['required', 'string', 'max:50'],
        ]);

        $participant = Participant::query()
            ->where('fest_id', Str::upper(trim($validated['fest_id'])))
            ->first();

        if ($participant === null) {
            throw ValidationException::withMessages([
                'fest_id' => 'No participant found for this QR code.',
            ]);
        }

        $visit = $request->user()->boothVisits()->createOrFirst([
            'participant_id' => $participant->id,
            'visited_on' => BoothVisit::today(),
        ], [
            'points' => $request->user()->scan_points,
        ]);

        if (! $visit->wasRecentlyCreated) {
            throw ValidationException::withMessages([
                'fest_id' => "{$participant->fullName()} already visited your booth today.",
            ]);
        }

        Inertia::flash('visit', self::present($visit->setRelation('participant', $participant)));

        return to_route('booth.home');
    }

    /**
     * @return array{id: int, name: string, festId: string|null, municipality: string, points: int, visitedAt: string|null}
     */
    public static function present(BoothVisit $visit): array
    {
        return [
            'id' => $visit->id,
            'name' => $visit->participant->fullName(),
            'festId' => $visit->participant->fest_id,
            'municipality' => $visit->participant->municipality,
            'points' => $visit->points,
            'visitedAt' => $visit->created_at?->toIso8601String(),
        ];
    }
}
