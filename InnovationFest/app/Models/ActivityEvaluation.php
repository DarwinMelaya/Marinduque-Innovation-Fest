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
     * The forum survey, in the order it is shown. Same shape as Evaluation::QUESTIONS, plus an optional
     * "section" heading and optional free-text ("text") questions.
     *
     * @var list<array{key: string, label: string, type: 'choice'|'rating'|'text', section?: string, options?: list<string>}>
     */
    public const QUESTIONS = [
        ['key' => 'age_group', 'label' => 'Age Group', 'type' => 'choice', 'options' => ['16–20 years old', '21–25 years old', '26–30 years old', '31–35 years old', '36–40 years old', '41–45 years old', '46–50 years old', '51 years old and above']],
        ['key' => 'design_topics', 'section' => 'Designs', 'label' => 'The training topics and activities were up to my expectations.', 'type' => 'rating'],
        ['key' => 'design_schedule', 'section' => 'Designs', 'label' => 'The training was conducted as scheduled.', 'type' => 'rating'],
        ['key' => 'design_objectives', 'section' => 'Designs', 'label' => 'The objectives of the training were clearly met.', 'type' => 'rating'],
        ['key' => 'design_materials', 'section' => 'Designs', 'label' => 'The training materials provided were appropriate and helpful.', 'type' => 'rating'],
        ['key' => 'design_activities', 'section' => 'Designs', 'label' => 'The presentations and hands-on activities conducted were essential in the training.', 'type' => 'rating'],
        ['key' => 'trainer_overall', 'section' => 'Trainer/s and Facilitators', 'label' => 'Overall, how would you rate the trainer/s and facilitators?', 'type' => 'rating'],
        ['key' => 'trainer_knowledge', 'section' => 'Trainer/s and Facilitators', 'label' => 'The trainers were well versed on their topics.', 'type' => 'rating'],
        ['key' => 'trainer_presentation', 'section' => 'Trainer/s and Facilitators', 'label' => 'The trainers’ methods of presentation were interesting.', 'type' => 'rating'],
        ['key' => 'trainer_effective', 'section' => 'Trainer/s and Facilitators', 'label' => 'The trainers were effective.', 'type' => 'rating'],
        ['key' => 'facilitators', 'section' => 'Trainer/s and Facilitators', 'label' => 'The training facilitators were courteous and helpful.', 'type' => 'rating'],
        ['key' => 'facility', 'section' => 'Environment', 'label' => 'The training facility was complete and appropriate.', 'type' => 'rating'],
        ['key' => 'venue', 'section' => 'Environment', 'label' => 'The venue was comfortable and accessible.', 'type' => 'rating'],
        ['key' => 'understanding', 'section' => 'Results', 'label' => 'The topics discussed enhanced my understanding.', 'type' => 'rating'],
        ['key' => 'application', 'section' => 'Results', 'label' => 'I will be able to use/apply what I learned from the training.', 'type' => 'rating'],
        ['key' => 'comments', 'section' => 'Written responses', 'label' => 'Topics, improvements, and comments from evaluators', 'type' => 'text'],
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
            $rules[$question['key']] = match ($question['type']) {
                'rating' => ['required', 'integer', 'between:1,5'],
                'text' => ['nullable', 'string', 'max:2000'],
                default => ['required', 'string', 'in:'.implode(',', $question['options'])],
            };
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
