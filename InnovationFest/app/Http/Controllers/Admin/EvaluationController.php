<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityEvaluation;
use App\Models\Evaluation;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class EvaluationController extends Controller
{
    private const RECENT_LIMIT = 100;

    /**
     * Show the overall and forum (activity) evaluations, each with reward points, KPIs, per-question charts and responses.
     */
    public function index(): Response
    {
        $overall = Evaluation::query()->with('participant')->latest()->latest('id')->get();
        $activity = ActivityEvaluation::query()->with(['participant', 'forum:id,booth_name'])->latest()->latest('id')->get();

        return Inertia::render('admin/Evaluations', [
            'maxPoints' => Evaluation::MAX_POINTS,
            'overall' => [
                'points' => Evaluation::rewardPoints(),
                'questions' => Evaluation::QUESTIONS,
                'stats' => [
                    'total' => $overall->count(),
                    'average' => $this->average($overall),
                    'firstTime' => $overall->where('answers.first_time', 'Yes')->count(),
                    'highlyRecommended' => $overall->where('answers.recommend', 'Very much Recommended')->count(),
                ],
                'analytics' => $this->analytics($overall, Evaluation::QUESTIONS),
                'evaluations' => $overall->take(self::RECENT_LIMIT)->map(fn (Evaluation $evaluation) => [
                    'id' => $evaluation->id,
                    'forum' => null,
                    'festId' => $evaluation->participant->fest_id,
                    'name' => $evaluation->participant->fullName(),
                    'average' => $evaluation->averageRating(),
                    'answers' => $evaluation->answers,
                    'points' => $evaluation->points,
                    'submittedAt' => $evaluation->created_at?->toIso8601String(),
                ])->values(),
            ],
            'activity' => [
                'points' => ActivityEvaluation::rewardPoints(),
                'questions' => ActivityEvaluation::QUESTIONS,
                'stats' => [
                    'total' => $activity->count(),
                    'average' => $this->average($activity),
                    'forums' => $activity->unique('user_id')->count(),
                    'comments' => $activity->filter(fn (ActivityEvaluation $evaluation) => filled($evaluation->answers['comments'] ?? null))->count(),
                ],
                'forums' => $activity->groupBy('user_id')
                    ->map(fn (Collection $group) => [
                        'forum' => $group->first()->forum->booth_name,
                        'total' => $group->count(),
                        'average' => $this->average($group),
                    ])
                    ->sortByDesc('total')
                    ->values(),
                'analytics' => $this->analytics($activity, ActivityEvaluation::QUESTIONS),
                'evaluations' => $activity->take(self::RECENT_LIMIT)->map(fn (ActivityEvaluation $evaluation) => [
                    'id' => $evaluation->id,
                    'forum' => $evaluation->forum->booth_name,
                    'festId' => $evaluation->participant->fest_id,
                    'name' => $evaluation->participant->fullName(),
                    'average' => $evaluation->averageRating(),
                    'answers' => $evaluation->answers,
                    'points' => $evaluation->points,
                    'submittedAt' => $evaluation->created_at?->toIso8601String(),
                ])->values(),
            ],
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

    /**
     * Set how many points evaluating a forum earns. Evaluations already submitted keep their points.
     */
    public function updateForumPoints(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'points' => ['required', 'integer', 'min:0', 'max:'.Evaluation::MAX_POINTS],
        ]);

        Setting::put(ActivityEvaluation::POINTS_KEY, (string) $validated['points']);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Forum evaluation reward set to {$validated['points']} points.",
        ]);

        return to_route('admin.evaluations.index');
    }

    /**
     * @param  Collection<int, Evaluation|ActivityEvaluation>  $evaluations
     */
    private function average(Collection $evaluations): float
    {
        return round((float) $evaluations->avg(fn (Evaluation|ActivityEvaluation $evaluation) => $evaluation->averageRating()), 2);
    }

    /**
     * One chart's worth of data per question: answer counts for choice/rating questions, recent replies for text ones.
     *
     * @param  Collection<int, Evaluation|ActivityEvaluation>  $evaluations
     * @param  list<array{key: string, label: string, type: string, section?: string, options?: list<string>}>  $questions
     * @return list<array<string, mixed>>
     */
    private function analytics(Collection $evaluations, array $questions): array
    {
        $answers = $evaluations->pluck('answers');

        return array_map(function (array $question) use ($answers) {
            $values = $answers->pluck($question['key'])->filter(fn ($value) => filled($value));

            if ($question['type'] === 'text') {
                return [...$question, 'total' => $values->count(), 'responses' => $values->take(self::RECENT_LIMIT)->values()];
            }

            $options = $question['type'] === 'rating' ? ['1', '2', '3', '4', '5'] : $question['options'];
            $counts = $values->countBy(fn ($value) => (string) $value);

            return [
                ...$question,
                'total' => $values->count(),
                'average' => $question['type'] === 'rating' ? round((float) $values->avg(), 2) : null,
                'counts' => array_map(fn (string $option) => ['name' => $option, 'total' => $counts[$option] ?? 0], $options),
            ];
        }, $questions);
    }
}
