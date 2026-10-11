<?php

namespace App\Http\Controllers\Visitor;

use App\Enums\StaffCategory;
use App\Http\Controllers\Controller;
use App\Models\ActivityEvaluation;
use App\Models\BoothVisit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ActivityEvaluationController extends Controller
{
    /**
     * Show the forum survey, or the thank-you screen once it was submitted.
     */
    public function show(Request $request, BoothVisit $visit): Response
    {
        $visit = $this->ownForumVisit($request, $visit);

        return Inertia::render('visitors/ActivityEvaluation', [
            'visitId' => $visit->id,
            'forumName' => $visit->booth->booth_name,
            'points' => ActivityEvaluation::rewardPoints(),
            'questions' => ActivityEvaluation::QUESTIONS,
            'submitted' => $visit->evaluation ? ['points' => $visit->evaluation->points] : null,
        ]);
    }

    /**
     * Save the evaluation once per forum visit and award the points the admin currently set.
     */
    public function store(Request $request, BoothVisit $visit): RedirectResponse
    {
        $visit = $this->ownForumVisit($request, $visit);

        $answers = $request->validate(ActivityEvaluation::rules(), [
            '*.required' => 'Please answer this question.',
            '*.in' => 'Choose one of the options.',
        ]);

        $evaluation = $visit->evaluation()->createOrFirst([], [
            'participant_id' => $visit->participant_id,
            'user_id' => $visit->user_id,
            'answers' => $answers,
            'points' => ActivityEvaluation::rewardPoints(),
        ]);

        if (! $evaluation->wasRecentlyCreated) {
            throw ValidationException::withMessages([
                'overall' => 'You already evaluated this forum.',
            ]);
        }

        return to_route('visitor.activity-evaluation.show', $visit);
    }

    /**
     * Only the scanned participant may evaluate, and only forums (not booths).
     */
    private function ownForumVisit(Request $request, BoothVisit $visit): BoothVisit
    {
        abort_unless($visit->participant_id === $request->user('participant')->id, 404);

        $visit->load('booth:id,booth_name,category', 'evaluation');

        abort_unless($visit->booth->category === StaffCategory::Forum, 404);

        return $visit;
    }
}
