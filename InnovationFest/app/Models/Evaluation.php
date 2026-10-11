<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * A participant's overall festival evaluation; one per participant.
 *
 * @property int $id
 * @property int $participant_id
 * @property array<string, string|int> $answers Keyed by the question keys in self::QUESTIONS.
 * @property int $points Points awarded at submission, so later admin changes don't rewrite past earnings.
 * @property Carbon|null $created_at
 */
#[Fillable(['participant_id', 'answers', 'points'])]
class Evaluation extends Model
{
    public const POINTS_KEY = 'evaluation_points';

    public const DEFAULT_POINTS = 10;

    public const MAX_POINTS = 1000;

    /**
     * The survey, in the order it is shown. "choice" questions pick one option; "rating" questions score 1 (lowest) to 5 (highest).
     *
     * @var list<array{key: string, label: string, type: 'choice'|'rating', options?: list<string>}>
     */
    public const QUESTIONS = [
        ['key' => 'first_time', 'label' => 'Is this your first time to visit DOST-MIMAROPA - DOST Marinduque Events?', 'type' => 'choice', 'options' => ['Yes', 'No']],
        ['key' => 'gender', 'label' => 'What is your gender?', 'type' => 'choice', 'options' => ['Male', 'Female', 'Prefer not to say']],
        ['key' => 'agency', 'label' => 'What agency did you come from?', 'type' => 'choice', 'options' => ['Government', 'Civil Society Organization', 'Private Sector', 'Academe', 'Media', 'Others']],
        ['key' => 'source', 'label' => 'How did you hear about this event?', 'type' => 'choice', 'options' => ['Word of mouth', 'Invitation Letter', 'Radio Ads', 'Online Ads', 'Print Ads', 'TV Ads', 'Others']],
        ['key' => 'venue', 'label' => 'How satisfied are you with the venue of the event?', 'type' => 'rating'],
        ['key' => 'staff', 'label' => 'How satisfied are you with the staff/event organizers?', 'type' => 'rating'],
        ['key' => 'exhibits', 'label' => 'How satisfied are you with the content of the exhibits?', 'type' => 'rating'],
        ['key' => 'info_amount', 'label' => 'How satisfied are you with the amount of information learned?', 'type' => 'rating'],
        ['key' => 'info_usefulness', 'label' => 'How satisfied are you with the usefulness of information learned?', 'type' => 'rating'],
        ['key' => 'organized', 'label' => 'How organized was the event?', 'type' => 'choice', 'options' => ['Not Organized', 'Organized', 'Very Organized']],
        ['key' => 'recommend', 'label' => 'How likely is it that you would recommend the event to a friend or colleague?', 'type' => 'choice', 'options' => ['Recommended', 'Very much Recommended']],
    ];

    /**
     * Points a participant earns for completing the evaluation.
     */
    public static function rewardPoints(): int
    {
        return (int) Setting::get(self::POINTS_KEY, (string) self::DEFAULT_POINTS);
    }

    /**
     * Validation rules for every question.
     *
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

    /**
     * Mean of this evaluation's 1-5 satisfaction ratings.
     */
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
     * @return BelongsTo<Participant, $this>
     */
    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }
}
