<?php

namespace App\Http\Controllers\Visitor;

use App\Http\Controllers\Controller;
use App\Models\Evaluation;
use App\Models\Participant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class EvaluationController extends Controller
{
    /**
     * Show the survey, or the thank-you screen once it was submitted.
     */
    public function show(Request $request): Response
    {
        /** @var Participant $participant */
        $participant = $request->user('participant');
        $evaluation = $participant->evaluation;

        return Inertia::render('visitors/OverallEvaluation', [
            'points' => Evaluation::rewardPoints(),
            'questions' => Evaluation::QUESTIONS,
            'submitted' => $evaluation ? ['points' => $evaluation->points] : null,
        ]);
    }

    /**
     * Save the evaluation once per participant and award the points the admin currently set.
     */
    public function store(Request $request): RedirectResponse
    {
        $answers = $request->validate(Evaluation::rules(), [
            '*.required' => 'Please answer this question.',
            '*.in' => 'Choose one of the options.',
        ]);

        $evaluation = $request->user('participant')->evaluation()->createOrFirst([], [
            'answers' => $answers,
            'points' => Evaluation::rewardPoints(),
        ]);

        if (! $evaluation->wasRecentlyCreated) {
            throw ValidationException::withMessages([
                'first_time' => 'You already submitted your evaluation.',
            ]);
        }

        return to_route('visitor.evaluation.show');
    }
}
