<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\BonusCode;
use App\Models\BoothVisit;
use App\Models\Participant;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class VisitorController extends Controller
{
    public const LEADERBOARD_SIZE = 10;

    /**
     * Show the points leaderboard and every booth visit, filterable by participant and booth.
     */
    public function index(Request $request): Response
    {
        $booths = User::query()
            ->where('role', UserRole::Staff)
            ->orderBy('booth_name')
            ->get(['id', 'booth_name']);

        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'booth' => ['nullable', 'integer', Rule::in($booths->modelKeys())],
        ]);

        $leaderboard = Participant::query()
            ->rankedByPoints()
            ->limit(self::LEADERBOARD_SIZE)
            ->get()
            ->map(fn (Participant $participant) => [
                'id' => $participant->id,
                'festId' => $participant->fest_id,
                'name' => $participant->fullName(),
                'municipality' => $participant->municipality,
                'points' => (int) $participant->points,
                'visits' => (int) $participant->visits,
            ]);

        $visits = BoothVisit::query()
            ->with(['participant', 'booth:id,booth_name'])
            ->when($filters['search'] ?? null, fn (Builder $query, string $search) => $query->whereHas(
                'participant',
                fn (Builder $query) => $query
                    ->where('fest_id', 'like', "%{$search}%")
                    ->orWhere('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%"),
            ))
            ->when($filters['booth'] ?? null, fn (Builder $query, int $booth) => $query->where('user_id', $booth))
            ->latest()
            ->latest('id')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (BoothVisit $visit) => [
                'id' => $visit->id,
                'festId' => $visit->participant->fest_id,
                'name' => $visit->participant->fullName(),
                'municipality' => $visit->participant->municipality,
                'boothName' => $visit->booth->booth_name,
                'points' => $visit->points,
                'visitedAt' => $visit->created_at?->toIso8601String(),
            ]);

        return Inertia::render('admin/VisitorsList', [
            'stats' => [
                'visits' => BoothVisit::count(),
                'visitors' => BoothVisit::distinct()->count('participant_id'),
                'points' => (int) BoothVisit::sum('points') + (int) BonusCode::query()
                    ->join('bonus_code_batches', 'bonus_code_batches.id', '=', 'bonus_codes.bonus_code_batch_id')
                    ->whereNotNull('bonus_codes.redeemed_at')
                    ->sum('bonus_code_batches.points'),
            ],
            'leaderboard' => $leaderboard,
            'visits' => $visits,
            'booths' => $booths->map(fn (User $booth) => [
                'id' => $booth->id,
                'name' => $booth->booth_name,
            ]),
            'filters' => [
                'search' => $filters['search'] ?? '',
                'booth' => isset($filters['booth']) ? (string) $filters['booth'] : '',
            ],
        ]);
    }
}
