<?php

namespace App\Http\Controllers\Booth;

use App\Http\Controllers\Controller;
use App\Models\BoothVisit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Show the booth's visitor counts and today's latest visitors.
     */
    public function __invoke(Request $request): Response
    {
        $visits = $request->user()->boothVisits();
        $today = BoothVisit::today();

        return Inertia::render('boothstaff/BoothHome', [
            'stats' => [
                'today' => (clone $visits)->where('visited_on', $today)->count(),
                'total' => (clone $visits)->count(),
            ],
            'recentVisits' => (clone $visits)
                ->where('visited_on', $today)
                ->with('participant')
                ->latest()
                ->latest('id')
                ->limit(5)
                ->get()
                ->map(fn (BoothVisit $visit) => VisitController::present($visit)),
        ]);
    }
}
