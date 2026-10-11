<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Evaluation;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EvaluationController extends Controller
{
    /**
     * Show the evaluation reward setting and the evaluations participants submitted.
     */
    public function index(): Response
    {
        $evaluations = Evaluation::query()
            ->with('participant')
            ->latest()
            ->latest('id')
            ->limit(100)
            ->get();

        return Inertia::render('admin/Evaluations', [
            'points' => Evaluation::rewardPoints(),
            'maxPoints' => Evaluation::MAX_POINTS,
            'questions' => Evaluation::QUESTIONS,
            'stats' => [
                'total' => Evaluation::count(),
                'average' => round((float) Evaluation::all()->avg(fn (Evaluation $evaluation) => $evaluation->averageRating()), 1),
            ],
            'evaluations' => $evaluations->map(fn (Evaluation $evaluation) => [
                'id' => $evaluation->id,
                'festId' => $evaluation->participant->fest_id,
                'name' => $evaluation->participant->fullName(),
                'average' => $evaluation->averageRating(),
                'answers' => $evaluation->answers,
                'points' => $evaluation->points,
                'submittedAt' => $evaluation->created_at?->toIso8601String(),
            ]),
        ]);
    }

    /**
     * Set how many points completing the evaluation earns. Evaluations already submitted keep their points.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'points' => ['required', 'integer', 'min:0', 'max:'.Evaluation::MAX_POINTS],
        ]);

        Setting::put(Evaluation::POINTS_KEY, (string) $validated['points']);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Evaluation reward set to {$validated['points']} points.",
        ]);

        return to_route('admin.evaluations.index');
    }
}
