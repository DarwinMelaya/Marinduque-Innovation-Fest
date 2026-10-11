<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * A participant's evaluation of one forum they were scanned at; one per forum visit.
 *
 * @property int $id
 * @property int $booth_visit_id
 * @property int $participant_id
 * @property int $user_id The forum staff account that was evaluated.
 * @property array<string, string|int> $answers Keyed by the question keys in self::QUESTIONS.
 * @property int $points Points awarded at submission, so later admin changes don't rewrite past earnings.
 * @property Carbon|null $created_at
 */
#[Fillable(['booth_visit_id', 'participant_id', 'user_id', 'answers', 'points'])]
class ActivityEvaluation extends Model
{
    public const POINTS_KEY = 'activity_evaluation_points';

    public const DEFAULT_POINTS = 5;

    /**
     * The forum survey, in the order it is shown. Same shape as Evaluation::QUESTIONS.
     * Placeholder until the final questions are provided.
     *
     * @var list<array{key: string, label: string, type: 'choice'|'rating', options?: list<string>}>
     */
    public const QUESTIONS = [
        ['key' => 'overall', 'label' => 'How would you rate this forum overall?', 'type' => 'rating'],
    ];

    public static function rewardPoints(): int
    {
        return (int) Setting::get(self::POINTS_KEY, (string) self::DEFAULT_POINTS);
    }

    /**
     * @return array<string, list<mixed>>
     */
    public static function rules(): array
    {
        $rules = [];

        foreach (self::QUESTIONS as $question) {
            $rules[$question['key']] = $question['type'] === 'rating'
                ? ['required', 'integer', 'between:1,5']
                : ['required', 'string', 'in:'.implode(',', $question['options'])];
        }

        return $rules;
    }

    public function averageRating(): float
    {
        $ratings = collect(self::QUESTIONS)
            ->where('type', 'rating')
            ->map(fn (array $question) => (int) ($this->answers[$question['key']] ?? 0))
            ->filter();

        return round((float) $ratings->avg(), 1);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['answers' => 'array'];
    }

    /**
     * @return BelongsTo<BoothVisit, $this>
     */
    public function visit(): BelongsTo
    {
        return $this->belongsTo(BoothVisit::class, 'booth_visit_id');
    }

    /**
     * @return BelongsTo<Participant, $this>
     */
    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function forum(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
